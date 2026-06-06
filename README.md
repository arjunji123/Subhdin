# ShaadiHub - Milestone 1 Delivery

Milestone 1 vendor module for Event & Wedding Services Marketplace:
- Vendor OTP authentication
- Vendor profile setup and account management
- Vendor services CRUD
- Vendor offers CRUD
- Vendor dashboard analytics (views, leads, reveal, WhatsApp clicks)
- PostgreSQL schema with Prisma
- Cloudinary signed upload hook
- React Native (Expo) vendor app UI

## Monorepo Structure

- `apps/api` - Node.js + Express + Prisma backend
- `apps/mobile` - React Native (Expo) vendor app
- `packages/shared` - Shared Zod schemas and TypeScript contracts
- `docs/standards.md` - Coding/architecture standards
- `docs/milestone-1-backend.md` - Detailed backend documentation (DB, migrations, APIs)

## Quick Start

1) Install dependencies

```bash
cd /Users/apple/Desktop/Personal/Subhdin
npm install
```

2) Start PostgreSQL

```bash
docker compose up -d
```

3) Configure env

```bash
cp .env.example .env
```

4) Run Prisma generate + migration

```bash
npm run prisma:generate -w apps/api
npm run prisma:migrate -w apps/api
```

5) Start backend API

```bash
npm run dev:api
```

API base URL: `http://localhost:4000/api`

## Run Mobile App

```bash
npm run start -w apps/mobile
```

Use Expo QR for Android/iOS.

## Demo OTP Flow

Current OTP provider mode is `mock`.
- Request OTP endpoint returns `debugCode`.
- Use that OTP for verification.

Endpoints:
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`

## Milestone 1 API Snapshot

Protected vendor routes need `Authorization: Bearer <token>`.

- `GET /api/vendor/me`
- `PUT /api/vendor/me`
- `DELETE /api/vendor/me`
- `GET /api/vendor/services`
- `POST /api/vendor/services`
- `PATCH /api/vendor/services/:serviceId`
- `DELETE /api/vendor/services/:serviceId`
- `GET /api/vendor/offers`
- `POST /api/vendor/offers`
- `PATCH /api/vendor/offers/:offerId`
- `DELETE /api/vendor/offers/:offerId`
- `GET /api/vendor/dashboard`
- `POST /api/analytics/events`
- `GET /api/uploads/signature`

## Testing

```bash
npm run test:api
```

## Notes

- Twilio/MSG91 OTP integration can be plugged into `apps/api/src/modules/auth/auth.service.ts`.
- Cloudinary upload signature route is implemented for secure client-side media upload.
- Deployment targets supported by this structure: Render, Railway, AWS.

