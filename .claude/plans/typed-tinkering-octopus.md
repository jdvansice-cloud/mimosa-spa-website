# Dual-Channel OTP Auth with Account Linking

## Context
**Problem**: Mindbody emails and phones are NOT unique — a family of 4 can share one email or phone. The current system can't handle: phone-only clients, shared credentials, or verifying the communication channel actually works.

**Goal**: Let users log in with email OR phone, verify the channel via OTP (email or WhatsApp), and permanently link their verified credential to their specific Mindbody client ID so future logins always resolve to the right account.

## Key Constraints
- Mindbody `searchClients(searchText)` accepts both email and phone
- Emails and phone numbers are reusable across Mindbody clients (families)
- Some Mindbody clients have no email (phone only)
- Mindbody `addClient` requires email (registration still needs email)
- Supabase Auth only supports email/phone OTP natively — WhatsApp OTP needs custom handling
- WATI template `codigo_verificacion` must be created and approved before WhatsApp OTP works

## New Concept: `linked_accounts` Table

The core of the redesign is a new `linked_accounts` table that maps a **verified credential** (email or phone) to a **specific Mindbody client ID**. Once linked, login skips Mindbody search entirely.

```sql
CREATE TABLE linked_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  credential TEXT NOT NULL,           -- email or phone (normalized)
  credential_type TEXT NOT NULL,      -- 'email' or 'phone'
  mindbody_client_id INTEGER NOT NULL,
  client_name TEXT NOT NULL,          -- for display during login
  verified_at TIMESTAMPTZ NOT NULL,   -- when OTP was confirmed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(credential, credential_type, mindbody_client_id)
);
```

One credential can link to multiple Mindbody clients (family scenario), and one Mindbody client can have multiple linked credentials (email + phone).

## New Flows

### Login Flow
```
1. User enters email OR phone number
2. Look up linked_accounts for that credential
   ├─ Found 1 link → skip to step 4
   ├─ Found multiple links → show "Select your profile" (names from linked_accounts)
   └─ Found 0 links → search Mindbody
3. Mindbody search results:
   ├─ 0 results → "Not found. Register?"
   ├─ 1 result → auto-select
   └─ Multiple → show "Select your profile" (names from Mindbody)
4. Choose OTP channel:
   ├─ If credential is email → send email OTP (Supabase) or WhatsApp OTP (if phone in Mindbody)
   └─ If credential is phone → send WhatsApp OTP (WATI)
5. User enters 6-digit code → verify
6. If new link: save to linked_accounts
7. Create/resume Supabase session → redirect
```

### Registration Flow
```
1. User fills: firstName, lastName, email, phone
2. Create client in Mindbody
3. Choose which channel to verify: email or WhatsApp
4. Send OTP to chosen channel → verify
5. Save linked_accounts entry for verified credential
6. Create Supabase session → redirect
```

## Pre-requisites (Manual Steps)
1. **Create WATI template** `codigo_verificacion`:
   - Body: `Hola {{1}}, tu código de verificación para Mimosa Spa es: *{{2}}*. Expira en 15 minutos.`
   - Category: Authentication
   - Submit for Meta approval (1-48 hours)

2. **Run SQL migration** (in Supabase SQL Editor):
   ```sql
   -- New linked_accounts table
   CREATE TABLE IF NOT EXISTS linked_accounts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     credential TEXT NOT NULL,
     credential_type TEXT NOT NULL CHECK (credential_type IN ('email', 'phone')),
     mindbody_client_id INTEGER NOT NULL,
     client_name TEXT NOT NULL,
     verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(credential, credential_type, mindbody_client_id)
   );
   CREATE INDEX idx_linked_accounts_credential ON linked_accounts(credential, credential_type);
   CREATE INDEX idx_linked_accounts_client ON linked_accounts(mindbody_client_id);
   ALTER TABLE linked_accounts ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Service role full access" ON linked_accounts FOR ALL TO service_role USING (true) WITH CHECK (true);

   -- Add otp_code to phone_verifications
   ALTER TABLE phone_verifications ADD COLUMN IF NOT EXISTS otp_code TEXT;
   ```

## Implementation Steps

### Step 1: New API — `/api/portal/auth/lookup`
Replaces the current email-only `/api/portal/auth/verify` for the login flow.

**Input**: `{ credential: string }` (email or phone)
**Logic**:
1. Detect type: if contains `@` → email, else → phone (normalize: strip non-digits)
2. Check `linked_accounts` first (by credential + type)
3. If linked accounts found → return them (no Mindbody call)
4. If no links → search Mindbody via `searchClients(credential)`
5. Filter results: exact email match or phone match (using existing `phoneNumbersMatch`)
6. Return `{ linked: boolean, clients: [...], credentialType: 'email'|'phone' }`

### Step 2: New API — `/api/portal/auth/send-otp`
Unified OTP sender for both email and WhatsApp channels.

**Input**: `{ email?: string, phone?: string, channel: 'email'|'whatsapp', clientId: number, clientName: string }`
**Logic**:
- If `channel === 'email'`: use `supabase.auth.admin.generateLink({ type: 'magiclink', email })` — but we don't send the link. Instead we use Supabase's signInWithOtp on the client side (simpler). Actually, keep the existing client-side `supabase.auth.signInWithOtp({ email })` for email.
- If `channel === 'whatsapp'`: generate 6-digit code, store in `phone_verifications` (with otp_code, phone, client_id, expires_at=15min), send via WATI `sendOtpCode()`, return `{ success: true }`
- Rate limit: reject if code sent to same phone/email in last 60 seconds

### Step 3: New API — `/api/portal/auth/verify-otp`
Unified OTP verifier for WhatsApp channel + session creation.

**Input**: `{ phone: string, otp_code: string, email?: string, clientId: number }`
**Logic**:
1. Look up `phone_verifications` where phone + otp_code match, not used, not expired
2. Mark as used
3. Upsert `linked_accounts` (credential=phone, type='phone', mindbody_client_id=clientId)
4. Create Supabase session:
   - If `email` provided: `admin.generateLink({ type: 'magiclink', email })` → return `hashed_token`
   - If no email: `admin.createUser({ phone, phone_confirm: true })` + `admin.generateLink`
5. Save profile with mindbody_client_id
6. Return `{ success: true, token_hash }`

For email OTP, the existing client-side `supabase.auth.verifyOtp({ email, token, type: 'email' })` continues to work. After verification, the frontend calls a new endpoint to save the link.

### Step 4: New API — `/api/portal/auth/link-account`
Saves a verified credential to `linked_accounts` after successful OTP.

**Input**: `{ credential: string, credentialType: 'email'|'phone', clientId: number, clientName: string }`
**Logic**: Upsert into `linked_accounts`. Called by frontend after successful OTP verification (both channels).

### Step 5: Add `sendOtpCode` to WATI library
**File:** `src/lib/booking/wati.ts`
- New function that sends `codigo_verificacion` template with 6-digit code

### Step 6: Update verify route to return phone
**File:** `src/app/api/portal/auth/verify/route.ts`
- Add `mobilePhone` to single-client response (needed for channel choice)
- Add phone search support (detect if input is phone, search by phone, filter by phone match)

### Step 7: Create `OtpChannelChoice` component
**New file:** `src/components/auth/OtpChannelChoice.tsx`
- Shows email and WhatsApp options
- WhatsApp hidden if no phone available
- Email hidden if no email available (phone-only client)

### Step 8: Update AuthStep (booking flow)
**File:** `src/components/booking/steps/AuthStep.tsx`
- Change input from email-only to "email or phone"
- Add `'channel-choice'` to AuthState
- After lookup → if linked, skip to channel choice. If unlinked, show client selection if multiple.
- Channel choice → send OTP via selected channel
- After OTP verify → save link + create session + proceed

### Step 9: Update portal login pages
**Files:** `src/app/[locale]/portal/login/page.tsx` and `src/app/portal/login/page.tsx`
- Same changes as Step 8 for portal login context
- Input accepts email or phone
- Full channel choice + linking flow

## Files Summary
| File | Action | Purpose |
|------|--------|---------|
| `src/app/api/portal/auth/lookup/route.ts` | **New** | Credential lookup (linked_accounts → Mindbody fallback) |
| `src/app/api/portal/auth/send-otp/route.ts` | **New** | Unified OTP sender (email via Supabase, WhatsApp via WATI) |
| `src/app/api/portal/auth/verify-otp/route.ts` | **New** | WhatsApp OTP verify + Supabase session creation |
| `src/app/api/portal/auth/link-account/route.ts` | **New** | Save verified credential → Mindbody client link |
| `src/lib/booking/wati.ts` | **Modify** | Add `sendOtpCode()` |
| `src/app/api/portal/auth/verify/route.ts` | **Modify** | Add phone search + return mobilePhone |
| `src/components/auth/OtpChannelChoice.tsx` | **New** | Channel selection UI |
| `src/components/booking/steps/AuthStep.tsx` | **Modify** | Full dual-channel flow |
| `src/app/[locale]/portal/login/page.tsx` | **Modify** | Full dual-channel flow |
| `src/app/portal/login/page.tsx` | **Modify** | Full dual-channel flow |
| `supabase/migrations/20260401_linked_accounts.sql` | **New** | Migration file |

## Verification
1. **Email login (existing client)**: Enter email → found in Mindbody → choose Email → OTP → logged in → link saved
2. **Phone login (existing client)**: Enter phone → found in Mindbody → choose WhatsApp → OTP → logged in → link saved
3. **Returning user (linked)**: Enter email/phone → found in linked_accounts → skip Mindbody → choose channel → OTP → logged in
4. **Family scenario**: Enter shared email → multiple clients shown → user picks their name → OTP → link saved for that specific person
5. **Phone-only client**: Enter phone → found in Mindbody (no email) → only WhatsApp option → OTP → logged in
6. **Registration**: Fill form → create in Mindbody → choose channel → OTP → link saved
7. **Booking flow**: Same flows through AuthStep
