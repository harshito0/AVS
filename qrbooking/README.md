# AURA VITAL STAR — QR Appointment Booking Module (`/qebooking`)

A lightweight, luxury, mobile-first appointment booking portal and QR code generation utility designed specifically for **Aura Vital Star Rejuvenation Centre**.

---

## Key Features

1. **Mobile-First Customer Booking Form (`/book`)**:
   - Primary target for QR scans on iPhone, Android, Safari, and Chrome.
   - Luxury wellness aesthetic: Forest Green (`#0F5B47`), Emerald, Off-White, and Gold accents.
   - Large touch targets, generous spacing, and no horizontal scrolling.
   - Required Fields: Full Name, Phone Number, Email Address, Service, Preferred Location, Preferred Date (past dates disabled), Preferred Time.
   - Optional Field: Message / Notes.
   - Instant inline validation.
   - Submit loading state (`Submitting...`) preventing duplicate clicks.
   - Success screen displaying all booking details with reference ID.
   - **No footer on booking form** (strictly adhering to project directive).

2. **Admin QR Generator Utility (`/qr-booking`)**:
   - Generates high-resolution scannable QR codes for `https://auravitalstar.ca/book`.
   - Luxury AVS card branding around the QR:
     - Header: *AURA VITAL STAR Rejuvenation Centre*
     - Title: *SCAN TO BOOK YOUR APPOINTMENT*
     - Center: High-contrast, scannable QR code
     - Footer: *auravitalstar.ca/book*
   - Export Options:
     - **Download High-Res PNG (1200px)**: Perfect for flyers and digital assets.
     - **Download Vector SVG**: Infinitely scalable for print shops.
     - **Download Standee / Poster Card (300 DPI Canvas)**: Ready-to-print acrylic counter standee.
     - **Copy Booking Link**: Instant clipboard copy with feedback.

3. **Clean Service Abstraction**:
   - `src/services/bookingService.ts`: Decoupled service layer ready to forward to `POST /api/appointments` when live CRM backend is connected, with resilient client-side mock simulation for standalone use.

---

## Directory Structure

```
/qebooking
  ├── package.json
  ├── tsconfig.json
  ├── vite.config.ts
  ├── tailwind.config.js
  ├── postcss.config.js
  ├── index.html
  ├── public/
  │   └── avs_logo.png
  └── src/
      ├── components/
      │   ├── BookingHeader.tsx
      │   ├── BookingForm.tsx
      │   └── BookingSuccess.tsx
      ├── qr/
      │   └── QRGenerator.tsx
      ├── services/
      │   └── bookingService.ts
      ├── utils/
      │   └── validation.ts
      ├── types/
      │   └── index.ts
      ├── styles/
      │   └── index.css
      ├── App.tsx
      └── main.tsx
```

---

## Running Locally

1. Navigate to the `qebooking` folder:
   ```bash
   cd qebooking
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open in your browser:
   - **Mobile Booking Form**: `http://localhost:5175/book`
   - **QR Code Generator**: `http://localhost:5175/qr-booking`