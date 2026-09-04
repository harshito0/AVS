# AURA VITAL STAR — Rejuvenation Centre CRM

A luxury, frontend-only Customer Relationship Management (CRM) and Admin Dashboard for **Aura Vital Star Rejuvenation Centre**.

---

## 🏛️ Project Architecture

```
/CRM
  /frontend     <-- React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts (Port 5174)
  /backend      <-- Node.js, Express, TypeScript, Prisma ORM, SQLite, JWT Auth (Port 4000)
```

## 🎨 Design Language & Visual System
- **Brand Palette**: Deep Forest Green (`#0F291E`), Dark Emerald (`#133828`), Gold Accents (`#C5A880`, `#D4AF37`), Soft Off-White (`#F9FAF8`), Subtle Warm Beige (`#F3EFEA`).
- **Typography**: Clean, modern, luxury sans-serif hierarchy.
- **Components**: High-end stat cards, right-side sliding drawers, animated modal overlays, rich data tables with sorting/filtering/pagination, and interactive Recharts visualizations.

## 🚀 Running the CRM

### From the Root Directory:
```bash
# Run both CRM Backend and CRM Frontend concurrently
npm run crm

# Or individually:
npm run crm:backend
npm run crm:frontend
```

### Or from individual directories:

**Backend:**
```bash
cd CRM/backend
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```
Backend runs on `http://localhost:4000/api`

**Frontend:**
```bash
cd CRM/frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5174/`

### 🔑 Default Admin Credentials
- **Email:** `admin@auravitalstar.ca`
- **Password:** `Admin@AVS2025`

