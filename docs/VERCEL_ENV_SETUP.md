# Vercel Environment Variables Setup

## Quick Setup Guide

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

---

## Required Variables

### 1. Mindbody API (🔒 Server-side only)

| Name | Value | Sensitive |
|------|-------|-----------|
| `MINDBODY_API_KEY` | `e1acf5c4136e461991395b31edcb7cd7` | ✅ Yes |
| `MINDBODY_SITE_ID` | `-41931` | ❌ No |
| `MINDBODY_API_URL` | `https://api.mindbodyonline.com/public/v6` | ❌ No |

### 2. Supabase

| Name | Value | Sensitive |
|------|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[your-project].supabase.co` | ❌ No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | ❌ No |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | ✅ Yes |

### 3. Site Configuration

| Name | Value | Sensitive |
|------|-------|-----------|
| `NEXT_PUBLIC_SITE_URL` | `https://mimosaretreat.com` | ❌ No |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `50760001234` | ❌ No |
| `NEXT_PUBLIC_ITBM_RATE` | `0.07` | ❌ No |

---

## Step-by-Step Instructions

### Step 1: Access Environment Variables

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project: **mimosa-spa-website**
3. Click **Settings** tab
4. Click **Environment Variables** in sidebar

### Step 2: Add Each Variable

For each variable:

1. Click **Add New**
2. Enter the **Name** (e.g., `MINDBODY_API_KEY`)
3. Enter the **Value**
4. Check **Sensitive** if it's a secret
5. Select environments: ✅ Production ✅ Preview ✅ Development
6. Click **Save**

### Step 3: Verify Configuration

After adding all variables, your list should look like:

```
┌────────────────────────────────────┬─────────────────────┬─────────────┐
│ Name                               │ Value               │ Environment │
├────────────────────────────────────┼─────────────────────┼─────────────┤
│ MINDBODY_API_KEY                   │ ●●●●●●●●           │ All         │
│ MINDBODY_SITE_ID                   │ -41931             │ All         │
│ MINDBODY_API_URL                   │ https://api.mind...│ All         │
│ NEXT_PUBLIC_SUPABASE_URL           │ https://xxxx.sup...│ All         │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY      │ eyJhbGci...        │ All         │
│ SUPABASE_SERVICE_ROLE_KEY          │ ●●●●●●●●           │ All         │
│ NEXT_PUBLIC_SITE_URL               │ https://mimosa...  │ All         │
│ NEXT_PUBLIC_WHATSAPP_NUMBER        │ 50760001234        │ All         │
│ NEXT_PUBLIC_ITBM_RATE              │ 0.07               │ All         │
└────────────────────────────────────┴─────────────────────┴─────────────┘
```

### Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **⋮** menu → **Redeploy**
4. Confirm redeploy

---

## Security Notes

### Variables WITHOUT `NEXT_PUBLIC_` prefix:
- ✅ Only available on server (API routes, server components)
- ✅ Never sent to browser
- ✅ Safe for secrets

**These are server-only:**
- `MINDBODY_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Variables WITH `NEXT_PUBLIC_` prefix:
- ⚠️ Exposed to browser
- ⚠️ Visible in client-side code
- ✅ OK for non-sensitive config

**These are public:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_ITBM_RATE`

---

## Troubleshooting

### "Environment variable not found"

1. Check spelling (case-sensitive)
2. Ensure variable is enabled for the environment
3. Redeploy after adding variables

### "API Key Invalid"

1. Verify the key is correct
2. Check if key has proper permissions
3. Ensure no extra spaces in value

### "Supabase connection failed"

1. Verify Supabase project URL
2. Check anon key is from correct project
3. Ensure project is not paused

---

## Getting Your Credentials

### Mindbody API
1. Go to [developers.mindbodyonline.com](https://developers.mindbodyonline.com)
2. Log in with your account
3. Go to **API Credentials**
4. Copy your **API Key**
5. Your **Site ID** is your studio's negative ID

### Supabase
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Future Variables

These will be added when features are implemented:

### Online Payments (Stripe)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```

### WhatsApp Notifications (WATI)
```
WATI_API_URL=https://live-server.wati.io
WATI_API_KEY=your-wati-api-key
```

### Analytics (Google)
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
