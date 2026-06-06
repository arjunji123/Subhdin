# ShaadiHub Milestone 1 Backend Documentation

This document describes the backend that is ready right now for Milestone 1 (Vendor Module).

## 1) Scope (Current)

Included in current backend:
- Vendor OTP authentication (request + verify)
- Vendor profile setup/update/get/delete
- Vendor services CRUD
- Vendor offers CRUD
- Vendor dashboard analytics counters
- Analytics event ingestion endpoint
- Cloudinary signed upload payload endpoint

Not included yet in this milestone backend:
- Twilio/MSG91 real OTP provider implementation (currently mock OTP)
- Admin APIs
- Customer discovery/search/comparison APIs
- Booking/payment workflows

## 2) Tech Stack and Folder Mapping

- Runtime: Node.js + TypeScript + Express
- ORM/DB: Prisma + PostgreSQL
- Validation: Zod (shared package)
- Auth: JWT (Bearer token)

Important backend files:
- `apps/api/src/app.ts`
- `apps/api/src/server.ts`
- `apps/api/src/routes/index.ts`
- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/*`
- `packages/shared/src/index.ts`

## 3) Database Design (Prisma)

Schema file: `apps/api/prisma/schema.prisma`

### Enums

- `VendorStatus`: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`
- `EventType`: `VIEW`, `CONTACT_REVEAL`, `WHATSAPP_CLICK`, `LEAD`

### Tables/Models

1. `Vendor`
- `id` (cuid, PK)
- `phone` (unique)
- `isPhoneVerified` (bool)
- Profile fields: `businessName`, `ownerName`, `mobileNumber`, `email`, `address`, `city`, `area`, `mapLocationUrl`
- `businessImages` (string array)
- `status` (`VendorStatus`)
- Timestamps: `createdAt`, `updatedAt`

Relations:
- `Vendor` -> `Service[]`
- `Vendor` -> `Offer[]`
- `Vendor` -> `OtpSession[]`
- `Vendor` -> `AnalyticsEvent[]`

2. `OtpSession`
- `id` (cuid, PK)
- `phone`
- `code`
- `verified` (bool)
- `expiresAt`
- `vendorId` (nullable FK)
- `createdAt`

Index:
- `@@index([phone, verified])`

3. `Service`
- `id` (cuid, PK)
- `vendorId` (FK, cascade delete)
- `category`, `serviceName`, `description`
- `price` (float)
- `capacity` (optional int)
- `galleryImages` (string array)
- `videoUrls` (string array)
- `highlights` (string array)
- Timestamps

Index:
- `@@index([vendorId, category])`

4. `Offer`
- `id` (cuid, PK)
- `vendorId` (FK, cascade delete)
- `title`, `description`
- `discountPercent` (int)
- `startDate`, `endDate`
- `isActive` (bool)
- Timestamps

Index:
- `@@index([vendorId, isActive])`

5. `AnalyticsEvent`
- `id` (cuid, PK)
- `vendorId` (FK, cascade delete)
- `type` (`EventType`)
- `source` (optional)
- `metadata` (JSON optional)
- `createdAt`

Index:
- `@@index([vendorId, type])`

## 4) Migrations and DB Commands

Current repository status:
- Prisma schema is present.
- `apps/api/prisma/migrations` folder is not yet generated/committed in current workspace state.

Use these commands to generate client and create first migration:

```bash
cd /Users/apple/Desktop/Personal/Subhdin
npm run prisma:generate -w apps/api
npm run prisma:migrate -w apps/api
```

For production deploy pipeline (recommended):

```bash
cd /Users/apple/Desktop/Personal/Subhdin/apps/api
npx prisma migrate deploy
```

## 5) Auth Flow (Vendor OTP + JWT)

### Step 1: Request OTP
- Endpoint: `POST /api/auth/request-otp`
- Body:

```json
{
  "phone": "919999999999"
}
```

Behavior:
- Upserts vendor by `phone`
- Creates OTP session with expiry
- Returns `debugCode` in current mock mode

### Step 2: Verify OTP
- Endpoint: `POST /api/auth/verify-otp`
- Body:

```json
{
  "phone": "919999999999",
  "code": "123456"
}
```

Behavior:
- Verifies latest non-verified OTP for phone
- Marks vendor `isPhoneVerified = true`
- Marks OTP session `verified = true`
- Returns JWT token

### Step 3: Use Bearer Token
For protected vendor routes:
- Header: `Authorization: Bearer <token>`

Middleware:
- `apps/api/src/middleware/auth.ts`

## 6) API Reference (Milestone 1)

Base URL: `http://localhost:4000/api`

### Public

1. `GET /health`
- Response:

```json
{ "ok": true }
```

2. `POST /auth/request-otp`
- Validation: `phone` numeric string, length 10-15

3. `POST /auth/verify-otp`
- Validation: `phone` numeric string, `code` length 6

4. `POST /analytics/events`
- Body:

```json
{
  "vendorId": "ckxxxxxxxxxxxxxxxx",
  "type": "VIEW",
  "source": "mobile"
}
```

- `type` allowed: `VIEW`, `CONTACT_REVEAL`, `WHATSAPP_CLICK`, `LEAD`

### Protected (Vendor JWT Required)

1. `GET /vendor/me`
- Get vendor profile + services + offers

2. `PUT /vendor/me`
- Upsert vendor profile
- Body fields:
  - `businessName`, `ownerName`, `mobileNumber`, `email`, `address`, `city`, `area`, `mapLocationUrl`, `businessImages[]`

3. `DELETE /vendor/me`
- Deletes vendor account

4. `GET /vendor/services`
- List own services

5. `POST /vendor/services`
- Create service

6. `PATCH /vendor/services/:serviceId`
- Update own service (partial update)

7. `DELETE /vendor/services/:serviceId`
- Delete own service

8. `GET /vendor/offers`
- List own offers

9. `POST /vendor/offers`
- Create offer

10. `PATCH /vendor/offers/:offerId`
- Update own offer (partial update)

11. `DELETE /vendor/offers/:offerId`
- Delete own offer

12. `GET /vendor/dashboard`
- Returns counters:
  - `totalServices`
  - `totalOffers`
  - `activeOffers`
  - `totalViews`
  - `totalContactReveals`
  - `totalWhatsappClicks`
  - `totalLeads`

13. `GET /uploads/signature`
- Returns Cloudinary signed payload for folder `shaadihub/vendors`

## 7) Validation Rules (Shared Contracts)

Shared schemas file:
- `packages/shared/src/index.ts`

Main rules:
- Phone: `^[0-9]{10,15}$`
- OTP code length: `6`
- Service create requires category/name/description/price
- Offer discount: integer `1..100`
- Offer dates are expected as ISO strings
- Vendor profile checks min lengths + optional email/url checks

## 8) Error Format

Global error middleware:
- `apps/api/src/middleware/error-handler.ts`

Response patterns:
- Business error: `{ "message": "..." }` with specific status code
- Validation error: `{ "message": "Validation failed", "issues": ... }` with `422`
- Unknown error: `{ "message": "Internal server error" }` with `500`

## 9) Environment Variables

Defined in:
- `apps/api/src/config/env.ts`

Required:
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `OTP_PROVIDER` (`mock` | `twilio` | `msg91`)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Reference template:
- `.env.example`

## 10) Quick Verification Checklist

1. API health check:

```bash
curl http://localhost:4000/api/health
```

2. API tests:

```bash
cd /Users/apple/Desktop/Personal/Subhdin
npm run test:api
```

3. Lint API:

```bash
cd /Users/apple/Desktop/Personal/Subhdin
npm run lint:api
```

## 11) Known Gaps Before Production

- Replace mock OTP with Twilio/MSG91 provider implementation
- Add rate limiting for OTP and auth endpoints
- Protect `POST /analytics/events` according to final product policy (currently open)
- Add API docs generation (OpenAPI/Swagger) for client handoff
- Add integration tests for auth + service/offer CRUD + dashboard counters

