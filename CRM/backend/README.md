# AURA VITAL STAR CRM — Backend Integration Specification

> **NOTICE**: This repository is strictly **FRONTEND-ONLY**.
> No backend, database, API server, or server-side routes have been built here.

---

## 🔌 Future Backend Integration Architecture

The frontend application in `../frontend` is architected with an isolated service layer (`frontend/src/services/`):

- `clientService.ts` ➔ Connects to future `/api/v1/clients`
- `leadService.ts` ➔ Connects to future `/api/v1/leads`
- `invoiceService.ts` ➔ Connects to future `/api/v1/invoices`
- `giftCardService.ts` ➔ Connects to future `/api/v1/gift-cards`
- `appointmentService.ts` ➔ Connects to future `/api/v1/appointments`
- `websiteService.ts` ➔ Connects to future `/api/v1/website` (gallery, services, packages)

### Replacing Mock Data with Real APIs:
1. In `frontend/src/services/`, replace the mock localStorage/memory implementation with `fetch()` or `axios` HTTP calls to your target backend API endpoint.
2. The TypeScript interfaces in `frontend/src/types/index.ts` serve as the official API contract matching the expected request/response payloads.
3. No redesign or restructuring of the UI components is required when connecting the live backend.
