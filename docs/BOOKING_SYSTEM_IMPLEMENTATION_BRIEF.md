# Mimosa Spa Retreat - Booking System Implementation Brief

**Document Version:** 1.0  
**Date:** January 11, 2026  
**Project:** Native Booking Widget Integration  
**Client:** Mimosa Spa Retreat, Panama  

---

## Executive Summary

This document outlines the comprehensive implementation plan for building a native booking system integrated into the Mimosa Spa Retreat website. The system will replace the current iframe-based booking widget with a fully integrated Next.js solution that connects directly to Mindbody's API.

### Key Objectives

1. **Native Integration:** Replace iframe widget with React components built into the website
2. **Multi-Treatment Booking:** Support booking multiple treatments in a single session
3. **Promotion-Linked Bookings:** Connect website promotions to Mindbody packages/services
4. **Add-on Services:** Separate "Adicionales" category shown after main treatment selection
5. **Smart Availability:** Calculate combined duration for availability checking

---

## Current State Analysis

### What's Already Built (v1.0.10)

| Component | Status | Description |
|-----------|--------|-------------|
| Next.js Website | ✅ Complete | Main website with bilingual support (ES/EN) |
| Admin Dashboard | ✅ Complete | Protected routes with Supabase auth |
| Promotions Management | ✅ Complete | CRUD for promotions with image upload |
| Gallery Management | ✅ Complete | Image gallery with categories |
| UI Components | ✅ Complete | Buttons, Cards, Modals, Spinners |
| Database Schema | ✅ Complete | Supabase tables for promotions, gallery |
| Booking Widget | ⚠️ Iframe | External widget via iframe (to be replaced) |

### Current Booking Widget (Iframe)

The current implementation embeds an external booking widget:
```tsx
// Current: /src/components/booking/BookingWidget.tsx
<iframe src="https://mimosa-spa-booking-widget.netlify.app" />
```

**Limitations of current approach:**
- No deep integration with website
- Cannot pre-select services from promotions
- No shared state with main application
- Limited styling control
- Separate hosting/maintenance

---

## New Requirements

### 1. Promotion-Linked Bookings

**Requirement:** When admin creates a promotion in the website, they should link it to a Mindbody promotion/package that contains multiple treatments.

**User Flow:**
1. Admin creates promotion in website admin panel
2. Admin selects corresponding Mindbody promotion/package
3. System fetches and stores the linked treatment IDs
4. Customer clicks "Book" on promotion card
5. Booking widget pre-loads all treatments from that promotion
6. Combined duration is calculated for availability

**Database Changes:**
```sql
-- Add to promotions table
ALTER TABLE promotions ADD COLUMN mindbody_promotion_id TEXT;
ALTER TABLE promotions ADD COLUMN mindbody_service_ids TEXT[]; -- Array of service IDs
ALTER TABLE promotions ADD COLUMN total_duration_minutes INTEGER;
```

### 2. Multi-Treatment Booking

**Requirement:** A booking can contain multiple treatments. The system must calculate total duration and find time slots where all treatments can be performed consecutively.

**Logic:**
```
Total Duration = Sum of all selected treatment durations
Available Slot = Start time where therapist has continuous availability for Total Duration
```

**Example:**
- Masaje Relajante: 60 min
- Exfoliación Corporal: 30 min
- Total Duration: 90 min
- System finds 90-minute continuous availability blocks

### 3. Add-on Services (Adicionales Category)

**Requirement:** The "ADICIONALES" category should NOT appear in the main treatment list. Instead, after selecting main treatment(s), show an add-on step where these services can be added.

**Implementation:**
```typescript
// Filter services
const mainServices = services.filter(s => s.Category !== 'ADICIONALES')
const addOnServices = services.filter(s => s.Category === 'ADICIONALES' && s.OnlineBooking)
```

**Booking Flow Update:**
1. Authentication
2. Location Selection
3. **Treatment Selection** (excludes ADICIONALES)
4. **Add-on Selection** (only ADICIONALES category)
5. Staff Selection
6. Date & Time Selection
7. Confirmation

---

## Technical Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MIMOSA SPA WEBSITE                           │
│                         (Vercel - Next.js)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Website    │  │    Admin     │  │   Booking    │              │
│  │    Pages     │  │   Dashboard  │  │    Widget    │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                       │
│         └─────────────────┼─────────────────┘                       │
│                           │                                         │
│                    ┌──────┴──────┐                                  │
│                    │  API Routes │                                  │
│                    │  /api/*     │                                  │
│                    └──────┬──────┘                                  │
│                           │                                         │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    ┌───────────────┐ ┌───────────┐ ┌───────────────┐
    │   Supabase    │ │  Mindbody │ │   Supabase    │
    │   Database    │ │  API v6.0 │ │    Storage    │
    │  (PostgreSQL) │ │           │ │   (Images)    │
    └───────────────┘ └───────────┘ └───────────────┘
```

### API Proxy Architecture

All Mindbody API calls go through Next.js API routes:

```
Browser → Next.js API Route → Mindbody API → Response
```

**Benefits:**
- API keys stay on server (never exposed to client)
- CORS handled automatically
- Token management on server
- Rate limiting and caching possible

---

## Database Schema

### Updated Promotions Table

```sql
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Display Information
  title_es TEXT NOT NULL,
  title_en TEXT,
  description_es TEXT,
  description_en TEXT,
  image_url TEXT,
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2), -- For showing discount
  
  -- Mindbody Integration
  mindbody_promotion_id TEXT,           -- Mindbody promotion/package ID
  mindbody_service_ids TEXT[] DEFAULT '{}', -- Array of service IDs in this promotion
  total_duration_minutes INTEGER,        -- Combined duration of all services
  
  -- Validity
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### New Booking Cart Table (Optional - for persistent carts)

```sql
CREATE TABLE booking_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL, -- Browser session
  
  -- Client Info
  client_email TEXT,
  mindbody_client_id INTEGER,
  
  -- Selections
  location_id INTEGER NOT NULL,
  service_ids INTEGER[] DEFAULT '{}',
  addon_ids INTEGER[] DEFAULT '{}',
  staff_id INTEGER, -- NULL = Any Therapist
  
  -- Schedule
  selected_date DATE,
  selected_time TIME,
  total_duration_minutes INTEGER,
  
  -- Promotion Link
  promotion_id UUID REFERENCES promotions(id),
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, completed, expired
  expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Endpoints

### Mindbody Proxy Endpoints

| Endpoint | Method | Description | Mindbody API |
|----------|--------|-------------|--------------|
| `/api/mindbody/auth/lookup` | POST | Client lookup by email/phone (returns array) | GET /client/clients |
| `/api/mindbody/auth/register` | POST | Create new client | POST /client/addclient |
| `/api/mindbody/locations` | GET | Get all locations | GET /site/locations |
| `/api/mindbody/services` | GET | Get services by location | GET /site/sessiontypes |
| `/api/mindbody/services/[id]` | GET | Get single service details | GET /site/sessiontypes |
| `/api/mindbody/staff` | GET | Get staff by location | GET /staff/staff |
| `/api/mindbody/availability` | GET | Check availability | GET /appointment/bookableitems |
| `/api/mindbody/book` | POST | Create appointment(s) | POST /appointment/addappointment |
| `/api/mindbody/promotions` | GET | Get Mindbody promotions | GET /sale/contracts or /sale/services |

**Note:** `/api/mindbody/auth/lookup` returns an array of clients. If multiple clients share the same email/phone, all matching clients are returned for user selection.

### Internal API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/promotions` | GET | Get website promotions with Mindbody links |
| `/api/promotions/[id]` | GET | Get single promotion with services |
| `/api/promotions/sync` | POST | Sync promotion with Mindbody data |

---

## Authentication System

### Email or Phone-Based Client Lookup

Customers can identify themselves using either email address OR phone number. The system handles cases where multiple clients share the same contact information (e.g., family members).

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Customer enters email OR phone number                          │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────┐                                    │
│  │ Search Clients          │                                    │
│  │ by Email or Phone       │                                    │
│  └───────────┬─────────────┘                                    │
│              │                                                   │
│       ┌──────┼──────┬──────────────┐                            │
│       │      │      │              │                            │
│       ▼      ▼      ▼              ▼                            │
│  ┌────────┐ ┌────────────┐ ┌─────────────┐                      │
│  │ Found  │ │ Found      │ │ Not Found   │                      │
│  │ 1      │ │ Multiple   │ │             │                      │
│  └───┬────┘ └─────┬──────┘ └──────┬──────┘                      │
│      │            │               │                              │
│      ▼            ▼               ▼                              │
│  Continue    Show Client     Offer Registration                  │
│  to Step 2   Selection Popup                                     │
│                   │                                              │
│                   ▼                                              │
│              User selects                                        │
│              client profile                                      │
│                   │                                              │
│                   ▼                                              │
│              Continue to Step 2                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Auth Step UI

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│              Ingresa tu información                             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📧  Correo electrónico o número de teléfono            │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │ ejemplo@email.com o +507 6789-1234              │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│              [ Continuar ]                                      │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  ¿Primera vez en Mimosa Spa?                                    │
│              [ Crear cuenta ]                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Multiple Clients Selection Popup

When multiple clients are found with the same email or phone number (e.g., family members sharing contact info), display a selection popup:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│              Selecciona tu perfil                               │
│                                                                  │
│  Encontramos varias cuentas asociadas a este contacto.          │
│  Por favor selecciona para quién deseas reservar:               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  👤  María García López                                  │    │
│  │      maria.garcia@email.com                             │    │
│  │      +507 6789-1234                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  👤  Carlos García López                                 │    │
│  │      maria.garcia@email.com                             │    │
│  │      +507 6789-1234                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  👤  Sofia García (Menor)                                │    │
│  │      maria.garcia@email.com                             │    │
│  │      +507 6789-1234                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│                    [ Cancelar ]                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Client Lookup Logic

```typescript
interface ClientLookupResult {
  found: boolean
  clients: MindbodyClient[]
  count: number
}

async function lookupClient(identifier: string): Promise<ClientLookupResult> {
  // Determine if input is email or phone
  const isEmail = identifier.includes('@')
  const isPhone = /^[\d\s\-\+\(\)]+$/.test(identifier.replace(/\s/g, ''))
  
  if (!isEmail && !isPhone) {
    throw new Error('Por favor ingresa un correo electrónico o número de teléfono válido')
  }
  
  // Search in Mindbody
  const response = await fetch('/api/mindbody/auth/lookup', {
    method: 'POST',
    body: JSON.stringify({ 
      searchText: identifier,
      searchType: isEmail ? 'email' : 'phone'
    }),
  })
  
  const data = await response.json()
  
  return {
    found: data.clients.length > 0,
    clients: data.clients,
    count: data.clients.length
  }
}

// Usage in AuthStep component
async function handleLookup(identifier: string) {
  setLoading(true)
  
  try {
    const result = await lookupClient(identifier)
    
    if (!result.found) {
      // Show registration option
      setShowRegistration(true)
    } else if (result.count === 1) {
      // Single client found - proceed directly
      setClient(result.clients[0])
      nextStep()
    } else {
      // Multiple clients found - show selection popup
      setMultipleClients(result.clients)
      setShowClientSelector(true)
    }
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}
```

### Client Selector Component

```typescript
// /src/components/booking/shared/ClientSelector.tsx

interface ClientSelectorProps {
  clients: MindbodyClient[]
  onSelect: (client: MindbodyClient) => void
  onCancel: () => void
}

function ClientSelector({ clients, onSelect, onCancel }: ClientSelectorProps) {
  return (
    <Modal isOpen onClose={onCancel} title="Selecciona tu perfil">
      <p className="text-warm-gray mb-4">
        Encontramos varias cuentas asociadas a este contacto.
        Por favor selecciona para quién deseas reservar:
      </p>
      
      <div className="space-y-3">
        {clients.map((client) => (
          <button
            key={client.Id}
            onClick={() => onSelect(client)}
            className="w-full p-4 border rounded-lg hover:border-gold 
                       hover:bg-gold/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-beige-100 rounded-full 
                              flex items-center justify-center">
                <User className="h-5 w-5 text-warm-gray" />
              </div>
              <div>
                <p className="font-medium text-dark">
                  {client.FirstName} {client.LastName}
                </p>
                <p className="text-sm text-warm-gray">
                  {client.Email}
                </p>
                {client.MobilePhone && (
                  <p className="text-sm text-warm-gray">
                    {client.MobilePhone}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={onCancel}
          className="text-warm-gray hover:text-dark transition-colors"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  )
}
```

### API Endpoint for Client Lookup

```typescript
// /api/mindbody/auth/lookup/route.ts

export async function POST(request: Request) {
  const { searchText, searchType } = await request.json()
  
  // Get Mindbody token
  const token = await getMindbodyToken()
  
  // Search clients
  const response = await fetch(
    `${MINDBODY_API_URL}/client/clients?searchText=${encodeURIComponent(searchText)}`,
    {
      headers: {
        'Api-Key': MINDBODY_API_KEY,
        'SiteId': MINDBODY_SITE_ID,
        'Authorization': `Bearer ${token}`,
      },
    }
  )
  
  const data = await response.json()
  
  // Filter results based on search type for accuracy
  let clients = data.Clients || []
  
  if (searchType === 'email') {
    clients = clients.filter((c: MindbodyClient) => 
      c.Email?.toLowerCase() === searchText.toLowerCase()
    )
  } else if (searchType === 'phone') {
    // Normalize phone numbers for comparison
    const normalizedSearch = searchText.replace(/\D/g, '')
    clients = clients.filter((c: MindbodyClient) => 
      c.MobilePhone?.replace(/\D/g, '').includes(normalizedSearch) ||
      c.HomePhone?.replace(/\D/g, '').includes(normalizedSearch)
    )
  }
  
  return Response.json({ 
    clients,
    count: clients.length 
  })
}
```

---

## Booking Widget Components

### Component Structure

```
/src/components/booking/
├── BookingWidget.tsx           # Main container component
├── BookingProvider.tsx         # Context provider for booking state
├── steps/
│   ├── AuthStep.tsx           # Email/phone login
│   ├── RegisterStep.tsx       # New client registration
│   ├── LocationStep.tsx       # Select spa location
│   ├── ServiceStep.tsx        # Select treatments (excludes ADICIONALES)
│   ├── AddonsStep.tsx         # Select add-ons (ADICIONALES only)
│   ├── StaffStep.tsx          # Select therapist
│   ├── DateTimeStep.tsx       # Calendar + time slots
│   └── ConfirmStep.tsx        # Review and confirm
├── shared/
│   ├── StepProgress.tsx       # Progress indicator
│   ├── ClientSelector.tsx     # Multiple clients selection popup
│   ├── ServiceCard.tsx        # Service display card
│   ├── StaffCard.tsx          # Therapist display card
│   ├── Calendar.tsx           # Date picker with availability
│   ├── TimeSlots.tsx          # Available time grid
│   ├── BookingSummary.tsx     # Selected items summary
│   └── CartSidebar.tsx        # Floating cart summary
└── hooks/
    ├── useBookingState.ts     # Booking state management
    ├── useClientLookup.ts     # Client search hook
    ├── useMindbody.ts         # Mindbody API calls
    └── useAvailability.ts     # Availability calculations
```

### Booking State (Zustand Store)

```typescript
interface BookingState {
  // Progress
  currentStep: number
  totalSteps: 8
  
  // Loading/Error
  isLoading: boolean
  error: string | null
  
  // Client Authentication
  clientIdentifier: string              // Email or phone entered by user
  identifierType: 'email' | 'phone' | null
  clientId: number | null
  clientInfo: MindbodyClient | null
  
  // Multiple Clients Handling
  availableClients: MindbodyClient[]    // When multiple clients found
  showClientSelector: boolean           // Show selection popup
  
  // Location
  selectedLocation: MindbodyLocation | null
  
  // Services
  selectedServices: MindbodyService[]      // Main treatments
  selectedAddons: MindbodyService[]        // ADICIONALES
  totalDuration: number                     // Combined minutes
  
  // Pricing
  subtotalRegular: number                   // Sum of regular prices
  promotionDiscount: number                 // Discount amount from promotion
  totalPrice: number                        // Final price (subtotal - discount)
  
  // Staff
  selectedStaff: MindbodyStaff | null      // null = Any Therapist
  
  // Schedule
  selectedDate: Date | null
  selectedTime: string | null
  
  // Promotion Link
  promotionId: string | null               // Website promotion ID
  mindbodyPromotionId: string | null       // Mindbody promotion ID
  activePromotion: Promotion | null        // Full promotion data
  
  // Available Data (from API)
  locations: MindbodyLocation[]
  services: MindbodyService[]
  addons: MindbodyService[]
  staff: MindbodyStaff[]
  availableDates: string[]
  availableSlots: TimeSlot[]
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  
  // Auth Actions
  lookupClient: (identifier: string) => Promise<void>
  selectClient: (client: MindbodyClient) => void
  clearClientSelection: () => void
  
  // Booking Actions
  setLocation: (location: MindbodyLocation) => void
  addService: (service: MindbodyService) => void
  removeService: (serviceId: number) => void
  addAddon: (addon: MindbodyService) => void
  removeAddon: (addonId: number) => void
  setStaff: (staff: MindbodyStaff | null) => void
  setDateTime: (date: Date, time: string) => void
  loadFromPromotion: (promotionId: string) => Promise<void>
  calculateTotals: () => void
  submitBooking: () => Promise<BookingResult>
  reset: () => void
}
```

---

## Cart & Pricing Display

### Cart Summary Component

The cart shows a floating summary during booking with clear pricing breakdown:

```
┌─────────────────────────────────────────────────────────────────┐
│                      TU RESERVA                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ⭐ PROMOCIÓN: ESENCIA DE PAZ                           │    │
│  │  ════════════════════════════════════════════════════   │    │
│  │                                                          │    │
│  │  ✓ Masaje de Piernas Cansadas          $45.00           │    │
│  │    30 minutos                          ─────            │    │
│  │                                                          │    │
│  │  ✓ Masaje Craneo-Facial                $55.00           │    │
│  │    35 minutos                          ─────            │    │
│  │                                                          │    │
│  │  Subtotal servicios:                   $100.00          │    │
│  │  Descuento promoción:                  -$21.00          │    │
│  │                                        ═══════          │    │
│  │  PRECIO PROMOCIONAL:                   $79.00           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ADICIONALES                                             │    │
│  │  ─────────────────────────────────────────────────────   │    │
│  │                                                          │    │
│  │  + Aromaterapia                        $15.00           │    │
│  │    15 minutos                                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ═══════════════════════════════════════════════════════════    │
│                                                                  │
│  Duración total:                          80 minutos            │
│                                                                  │
│  ───────────────────────────────────────────────────────────    │
│  Subtotal:                                $94.00                │
│  ITBM (7%):                               $6.58                 │
│  ───────────────────────────────────────────────────────────    │
│  TOTAL:                                   $100.58               │
│  ───────────────────────────────────────────────────────────    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Regular Booking Cart (No Promotion)

```
┌─────────────────────────────────────────────────────────────────┐
│                      TU RESERVA                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  TRATAMIENTOS                                            │    │
│  │  ─────────────────────────────────────────────────────   │    │
│  │                                                          │    │
│  │  • Masaje Relajante                    $75.00           │    │
│  │    60 minutos                                           │    │
│  │                                                          │    │
│  │  • Facial Hidratante                   $65.00           │    │
│  │    45 minutos                                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ADICIONALES                                             │    │
│  │  ─────────────────────────────────────────────────────   │    │
│  │                                                          │    │
│  │  + Piedras Calientes                   $20.00           │    │
│  │    20 minutos                                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ═══════════════════════════════════════════════════════════    │
│                                                                  │
│  Duración total:                          125 minutos           │
│                                                                  │
│  ───────────────────────────────────────────────────────────    │
│  Subtotal:                                $160.00               │
│  ITBM (7%):                               $11.20                │
│  ───────────────────────────────────────────────────────────    │
│  TOTAL:                                   $171.20               │
│  ───────────────────────────────────────────────────────────    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Distinction Rules

| Element | Promotion Booking | Regular Booking |
|---------|-------------------|-----------------|
| Header | ⭐ Gold background, "PROMOCIÓN" badge | White background |
| Border | Gold border (2px) | Gray border (1px) |
| Services | Checkmarks (✓) | Bullets (•) |
| Pricing | Shows strikethrough original + discount | Shows regular price |
| Highlight | Promotion name prominently displayed | No special highlight |

### Pricing Calculation Logic

```typescript
// Tax rate constant
const ITBM_RATE = 0.07 // 7% Panama tax

interface CartPricing {
  // Individual prices
  servicesPrices: { serviceId: number; regularPrice: number }[]
  addonsPrices: { addonId: number; price: number }[]
  
  // Subtotals
  servicesSubtotal: number      // Sum of service regular prices
  addonsSubtotal: number        // Sum of addon prices
  
  // Promotion (if applicable)
  hasPromotion: boolean
  promotionName: string | null
  promotionPrice: number | null  // Fixed promotion price
  promotionDiscount: number      // servicesSubtotal - promotionPrice
  
  // Tax calculation
  subtotalBeforeTax: number      // promotionPrice (or servicesSubtotal) + addonsSubtotal
  itbmAmount: number             // subtotalBeforeTax * 0.07
  
  // Final total
  totalWithTax: number           // subtotalBeforeTax + itbmAmount
  
  // Duration
  totalDuration: number          // Sum of all durations in minutes
}

function calculateCartPricing(state: BookingState): CartPricing {
  // Calculate service prices
  const servicesSubtotal = state.selectedServices.reduce(
    (sum, s) => sum + s.Price, 0
  )
  
  // Calculate addon prices
  const addonsSubtotal = state.selectedAddons.reduce(
    (sum, a) => sum + a.Price, 0
  )
  
  // Check for promotion
  const hasPromotion = state.activePromotion !== null
  let promotionDiscount = 0
  let finalServicesPrice = servicesSubtotal
  
  if (hasPromotion && state.activePromotion) {
    finalServicesPrice = state.activePromotion.price
    promotionDiscount = servicesSubtotal - finalServicesPrice
  }
  
  // Calculate subtotal before tax
  const subtotalBeforeTax = finalServicesPrice + addonsSubtotal
  
  // Calculate ITBM (7%)
  const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100
  
  // Calculate total with tax
  const totalWithTax = subtotalBeforeTax + itbmAmount
  
  return {
    servicesSubtotal,
    addonsSubtotal,
    hasPromotion,
    promotionName: state.activePromotion?.title_es || null,
    promotionPrice: hasPromotion ? state.activePromotion!.price : null,
    promotionDiscount,
    subtotalBeforeTax,
    itbmAmount,
    totalWithTax,
    totalDuration: calculateTotalDuration(
      state.selectedServices, 
      state.selectedAddons
    ),
  }
}
```
```

### Cart Component Structure

```typescript
// /src/components/booking/shared/CartSummary.tsx

interface CartSummaryProps {
  isFloating?: boolean      // Sidebar vs inline
  showRemoveButtons?: boolean
  compact?: boolean
}

function CartSummary({ isFloating, showRemoveButtons, compact }: CartSummaryProps) {
  const { 
    selectedServices, 
    selectedAddons, 
    activePromotion,
    removeService,
    removeAddon 
  } = useBookingStore()
  
  const pricing = calculateCartPricing(useBookingStore.getState())
  
  return (
    <div className={cn(
      'cart-summary rounded-xl border',
      pricing.hasPromotion 
        ? 'border-gold border-2 bg-gold/5' 
        : 'border-beige-300 bg-white'
    )}>
      {/* Promotion Header */}
      {pricing.hasPromotion && (
        <div className="bg-gold text-dark px-4 py-2 rounded-t-lg">
          <span className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <span className="font-semibold">
              PROMOCIÓN: {pricing.promotionName}
            </span>
          </span>
        </div>
      )}
      
      {/* Services List */}
      <div className="p-4">
        <h4 className="font-semibold mb-3">
          {pricing.hasPromotion ? 'Servicios Incluidos' : 'Tratamientos'}
        </h4>
        
        {selectedServices.map(service => (
          <CartServiceItem
            key={service.Id}
            service={service}
            isPromotion={pricing.hasPromotion}
            showRemove={showRemoveButtons && !pricing.hasPromotion}
            onRemove={() => removeService(service.Id)}
          />
        ))}
        
        {/* Promotion Pricing */}
        {pricing.hasPromotion && (
          <div className="mt-4 pt-3 border-t border-gold/30">
            <div className="flex justify-between text-sm text-warm-gray">
              <span>Subtotal servicios:</span>
              <span className="line-through">${pricing.servicesSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento promoción:</span>
              <span>-${pricing.promotionDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gold-600 mt-1">
              <span>Precio promocional:</span>
              <span>${pricing.promotionPrice?.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Addons Section */}
      {selectedAddons.length > 0 && (
        <div className="px-4 pb-4">
          <h4 className="font-semibold mb-3 text-warm-gray">Adicionales</h4>
          {selectedAddons.map(addon => (
            <CartAddonItem
              key={addon.Id}
              addon={addon}
              showRemove={showRemoveButtons}
              onRemove={() => removeAddon(addon.Id)}
            />
          ))}
        </div>
      )}
      
      {/* Total */}
      <div className="border-t border-beige-200 p-4 bg-beige-50 rounded-b-xl">
        <div className="flex justify-between text-sm mb-2">
          <span>Duración total:</span>
          <span>{pricing.totalDuration} minutos</span>
        </div>
        <div className="border-t border-beige-200 pt-3 mt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${pricing.subtotalBeforeTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-warm-gray">
            <span>ITBM (7%):</span>
            <span>${pricing.itbmAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-beige-300">
            <span>TOTAL:</span>
            <span className={pricing.hasPromotion ? 'text-gold-600' : ''}>
              ${pricing.totalWithTax.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Confirmation Step

### Confirmation Display

Shows complete booking summary before submission:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONFIRMAR RESERVA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📍 UBICACIÓN                                                   │
│  Costa del Este - Star Plaza                                    │
│                                                                  │
│  👤 TERAPEUTA                                                   │
│  María Rodríguez                                                │
│                                                                  │
│  📅 FECHA Y HORA                                                │
│  Lunes, 15 de Enero 2026 a las 10:00 AM                        │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  [        CART SUMMARY COMPONENT (as above)        ]            │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  ⚠️  Al confirmar, tu cita será registrada en nuestro          │
│      sistema. El pago se realizará en el spa.                   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │              [ CONFIRMAR RESERVA ]                       │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│                    [ ← Volver ]                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Booking Submission

On confirmation, the system:

1. **Validates** all selections are complete
2. **Submits to Mindbody** via API
3. **Creates appointment(s)** for all services consecutively
4. **Shows confirmation** with booking reference

```typescript
async function submitBooking(): Promise<BookingResult> {
  const state = useBookingStore.getState()
  
  // Combine all services (main + addons)
  const allServices = [...state.selectedServices, ...state.selectedAddons]
  
  // Calculate start times for consecutive appointments
  let currentStartTime = new Date(`${state.selectedDate}T${state.selectedTime}`)
  const appointments = []
  
  for (const service of allServices) {
    appointments.push({
      ClientId: state.clientId,
      LocationId: state.selectedLocation!.Id,
      SessionTypeId: service.Id,
      StaffId: state.selectedStaff?.Id || null,
      StartDateTime: currentStartTime.toISOString(),
      Notes: state.activePromotion 
        ? `Promoción: ${state.activePromotion.title_es}` 
        : undefined,
    })
    
    // Move start time for next service
    currentStartTime = addMinutes(currentStartTime, service.Duration)
  }
  
  // Submit to Mindbody
  const response = await fetch('/api/mindbody/book', {
    method: 'POST',
    body: JSON.stringify({ appointments }),
  })
  
  return response.json()
}
```

---

## Booking Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      BOOKING FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐     ┌──────────┐     ┌────────────┐                │
│  │  START  │────▶│ Auth     │────▶│ Location   │                │
│  │         │     │ Step 1   │     │ Step 2     │                │
│  └─────────┘     └──────────┘     └─────┬──────┘                │
│                       │                  │                       │
│                       ▼                  │                       │
│              ┌──────────────┐            │                       │
│              │ Registration │            │                       │
│              │ (if needed)  │────────────┤                       │
│              └──────────────┘            │                       │
│                                          ▼                       │
│  ┌────────────┐     ┌──────────┐     ┌────────────┐             │
│  │ Staff      │◀────│ Add-ons  │◀────│ Services   │             │
│  │ Step 5     │     │ Step 4   │     │ Step 3     │             │
│  └─────┬──────┘     └──────────┘     └────────────┘             │
│        │                                                         │
│        ▼                                                         │
│  ┌────────────┐     ┌──────────┐     ┌────────────┐             │
│  │ Date/Time  │────▶│ Confirm  │────▶│ SUCCESS    │             │
│  │ Step 6     │     │ Step 7   │     │            │             │
│  └────────────┘     └──────────┘     └────────────┘             │
│                                                                  │
│  ════════════════════════════════════════════════════           │
│                                                                  │
│  PROMOTION ENTRY POINT:                                         │
│  Customer clicks "Book" on promotion                             │
│         │                                                        │
│         ▼                                                        │
│  ┌────────────────────────────────────┐                         │
│  │ Pre-load services from promotion   │                         │
│  │ Skip to Step 4 (Add-ons) or        │                         │
│  │ Step 5 (Staff) if no add-ons       │                         │
│  └────────────────────────────────────┘                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Multi-Treatment Availability Logic

### Duration Calculation

```typescript
function calculateTotalDuration(
  services: MindbodyService[],
  addons: MindbodyService[]
): number {
  const serviceDuration = services.reduce((sum, s) => sum + s.Duration, 0)
  const addonDuration = addons.reduce((sum, a) => sum + a.Duration, 0)
  return serviceDuration + addonDuration
}

// Example:
// services = [{ Duration: 60 }, { Duration: 30 }]  // 90 min
// addons = [{ Duration: 15 }]                       // 15 min
// totalDuration = 105 minutes
```

### Availability Query

```typescript
async function getAvailability(params: {
  locationId: number
  staffId: number | null  // null = any therapist
  serviceIds: number[]    // All services including addons
  totalDuration: number
  startDate: string
  endDate: string
}): Promise<AvailableSlot[]> {
  
  // Call Mindbody API
  const response = await fetch('/api/mindbody/availability', {
    params: {
      locationIds: params.locationId,
      staffIds: params.staffId || '', // Empty = any
      sessionTypeIds: params.serviceIds.join(','),
      startDate: params.startDate,
      endDate: params.endDate,
    }
  })
  
  const slots = await response.json()
  
  // Filter slots that can accommodate total duration
  return slots.filter(slot => {
    const slotDuration = differenceInMinutes(
      new Date(slot.EndDateTime),
      new Date(slot.StartDateTime)
    )
    return slotDuration >= params.totalDuration
  })
}
```

---

## Admin Panel Updates

### Promotion Form Updates

Add Mindbody integration fields to promotion creation/edit form:

```typescript
interface PromotionFormData {
  // Existing fields
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  price: number
  valid_from: string
  valid_until: string
  image_url: string
  
  // NEW: Mindbody Integration
  mindbody_promotion_id: string | null
  mindbody_service_ids: string[]        // Selected from dropdown
  total_duration_minutes: number        // Auto-calculated
}
```

### Admin UI Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   PROMOTION EDITOR                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Title (ES): [Esencia de Paz                    ]               │
│  Title (EN): [Essence of Peace                  ]               │
│                                                                  │
│  ─────────────────────────────────────────────────              │
│  MINDBODY INTEGRATION                                           │
│  ─────────────────────────────────────────────────              │
│                                                                  │
│  Link to Mindbody: [ Select Mindbody Promotion ▼ ]             │
│                    ┌────────────────────────────┐               │
│                    │ Promo: Esencia de Paz     │               │
│                    │ Promo: Suspiro Serenidad  │               │
│                    │ Promo: Calma Total        │               │
│                    └────────────────────────────┘               │
│                                                                  │
│  Included Services:                                             │
│  ┌────────────────────────────────────────────┐                │
│  │ ☑ Masaje de Piernas Cansadas (30 min)     │                │
│  │ ☑ Masaje Craneo-Facial (35 min)           │                │
│  └────────────────────────────────────────────┘                │
│                                                                  │
│  Total Duration: 65 minutes (auto-calculated)                   │
│                                                                  │
│  Price: [$79.00        ]                                        │
│                                                                  │
│  [Cancel]                              [Save Promotion]         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Objective:** Set up API infrastructure and basic booking state

**Tasks:**
- [ ] Create Mindbody API proxy routes
- [ ] Implement token management and caching
- [ ] Create BookingProvider context
- [ ] Create Zustand booking store
- [ ] Build basic step navigation
- [ ] Create UI component shells

**Deliverables:**
- `/api/mindbody/*` routes working
- Booking state management
- Step-based navigation

### Phase 2: Core Booking Flow (Week 3-4)

**Objective:** Implement main booking steps

**Tasks:**
- [ ] AuthStep - Email/phone lookup
- [ ] RegisterStep - New client form
- [ ] LocationStep - Location cards
- [ ] ServiceStep - Category-grouped services (excluding ADICIONALES)
- [ ] AddonsStep - ADICIONALES category services
- [ ] StaffStep - Therapist selection

**Deliverables:**
- Complete service selection flow
- Multi-service cart functionality
- Add-on selection working

### Phase 3: Scheduling (Week 5-6)

**Objective:** Implement availability and booking

**Tasks:**
- [ ] Calendar component with availability
- [ ] Time slot generation with duration calculation
- [ ] Multi-service availability logic
- [ ] ConfirmStep - Summary and submission
- [ ] Booking submission to Mindbody
- [ ] Confirmation display

**Deliverables:**
- Working date/time selection
- Successful booking creation
- Confirmation emails

### Phase 4: Promotion Integration (Week 7)

**Objective:** Link promotions to Mindbody

**Tasks:**
- [ ] Update promotion database schema
- [ ] Admin UI for Mindbody promotion linking
- [ ] Service pre-selection from promotions
- [ ] "Book" button on promotion cards
- [ ] Skip-to-addons flow for promotions

**Deliverables:**
- Promotions linked to Mindbody
- One-click promotion booking

### Phase 5: Polish & Testing (Week 8)

**Objective:** Finalize and launch

**Tasks:**
- [ ] Error handling and edge cases
- [ ] Loading states and animations
- [ ] Mobile responsive testing
- [ ] Bilingual content (ES/EN)
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Documentation update

**Deliverables:**
- Production-ready booking system
- Updated documentation
- Deployed to Vercel

---

## Environment Variables (Vercel Configuration)

Configure these in **Vercel Dashboard → Project Settings → Environment Variables**

### Required Variables

| Variable | Type | Environment | Description |
|----------|------|-------------|-------------|
| `MINDBODY_API_KEY` | Secret | All | Mindbody API key from developer portal |
| `MINDBODY_SITE_ID` | Plain | All | Mindbody site/studio ID (negative number) |
| `MINDBODY_API_URL` | Plain | All | Mindbody API base URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Plain | All | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Plain | All | Supabase anonymous key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | All | Supabase service role key (server only) |
| `NEXT_PUBLIC_SITE_URL` | Plain | All | Production website URL |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Plain | All | WhatsApp Business number |
| `NEXT_PUBLIC_ITBM_RATE` | Plain | All | Panama tax rate (0.07) |

### Vercel Dashboard Setup

```
┌─────────────────────────────────────────────────────────────────┐
│  VERCEL → Project Settings → Environment Variables              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ MINDBODY_API_KEY                                         │    │
│  │ ┌─────────────────────────────────────────────────────┐ │    │
│  │ │ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●                    │ │    │
│  │ └─────────────────────────────────────────────────────┘ │    │
│  │ 🔒 Sensitive  ☑ Production  ☑ Preview  ☑ Development    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ MINDBODY_SITE_ID                                         │    │
│  │ ┌─────────────────────────────────────────────────────┐ │    │
│  │ │ -41931                                               │ │    │
│  │ └─────────────────────────────────────────────────────┘ │    │
│  │ ☐ Sensitive  ☑ Production  ☑ Preview  ☑ Development    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ MINDBODY_API_URL                                         │    │
│  │ ┌─────────────────────────────────────────────────────┐ │    │
│  │ │ https://api.mindbodyonline.com/public/v6            │ │    │
│  │ └─────────────────────────────────────────────────────┘ │    │
│  │ ☐ Sensitive  ☑ Production  ☑ Preview  ☑ Development    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ... (continue for all variables)                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Complete Variables List

```env
# ===========================================
# MINDBODY API (Server-side only)
# ===========================================
MINDBODY_API_KEY=e1acf5c4136e461991395b31edcb7cd7
MINDBODY_SITE_ID=-41931
MINDBODY_API_URL=https://api.mindbodyonline.com/public/v6

# ===========================================
# SUPABASE
# ===========================================
# Public (exposed to browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Private (server-side only - KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===========================================
# SITE CONFIGURATION
# ===========================================
NEXT_PUBLIC_SITE_URL=https://mimosaretreat.com
NEXT_PUBLIC_WHATSAPP_NUMBER=50760001234
NEXT_PUBLIC_ITBM_RATE=0.07

# ===========================================
# OPTIONAL - ANALYTICS
# ===========================================
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ===========================================
# FUTURE - PAYMENTS (Not yet implemented)
# ===========================================
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
# STRIPE_SECRET_KEY=sk_live_xxxxx

# ===========================================
# FUTURE - WHATSAPP NOTIFICATIONS
# ===========================================
# WATI_API_URL=https://live-server.wati.io
# WATI_API_KEY=your-wati-api-key
```

### Variable Security Notes

| Prefix | Exposure | Use For |
|--------|----------|---------|
| `NEXT_PUBLIC_` | Client + Server | Public config, URLs, non-sensitive data |
| No prefix | Server only | API keys, secrets, credentials |

**⚠️ IMPORTANT:** Variables WITHOUT `NEXT_PUBLIC_` prefix are:
- Only available in API routes and server components
- Never exposed to the browser
- Safe for storing secrets like API keys

### Environment-Specific Values

You can set different values per environment in Vercel:

| Variable | Production | Preview | Development |
|----------|------------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://mimosaretreat.com` | `https://preview.mimosaretreat.com` | `http://localhost:3000` |
| `MINDBODY_SITE_ID` | `-41931` | `-41931` | `-99` (sandbox) |

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Mindbody API rate limits | High | Medium | Implement caching, batch requests |
| Multi-treatment availability complex | Medium | High | Thorough testing, fallback options |
| Token expiration during booking | High | Low | Auto-refresh tokens, session handling |
| Service/promotion sync issues | Medium | Medium | Regular sync jobs, admin alerts |
| Mobile UX complexity | Medium | Medium | Mobile-first design, user testing |

---

## Success Metrics

1. **Booking Completion Rate:** >70% of started bookings completed
2. **Average Booking Time:** <3 minutes for single service
3. **Promotion Booking Rate:** >50% of promotion views lead to booking start
4. **Error Rate:** <2% of booking attempts fail
5. **Mobile Usage:** >60% of bookings from mobile devices

---

## Appendix: Mindbody API Reference

### Authentication
```
POST /usertoken/issue
Header: Api-Key: {MINDBODY_API_KEY}
Header: SiteId: {MINDBODY_SITE_ID}
```

### Key Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /client/clients?searchText={email}` | Client lookup |
| `POST /client/addclient` | Register client |
| `GET /site/locations` | Get locations |
| `GET /site/sessiontypes?locationIds={id}` | Get services |
| `GET /staff/staff?locationIds={id}` | Get therapists |
| `GET /appointment/bookableitems` | Check availability |
| `POST /appointment/addappointment` | Create booking |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 11, 2026 | Development Team | Initial brief |

---

**Next Steps:** Review this brief and approve to begin Phase 1 implementation.
