# Engineering Standards

## Architecture
- Monorepo with isolated apps (`apps/api`, `apps/mobile`) and shared contracts (`packages/shared`).
- Domain modules per feature: auth, vendor profile, services, offers, analytics.
- Stateless API with JWT auth and PostgreSQL as source of truth.

## Coding Rules
- TypeScript strict mode for API and mobile.
- Request validation through shared Zod schemas.
- No business logic in route files; keep logic in services.
- Central error middleware for predictable error payloads.

## Quality Gates
- Health endpoint and smoke tests for API availability.
- Lint + test before each release build.
- Versioned schema via Prisma migrations.

## Security Baseline
- Helmet + CORS middleware enabled.
- JWT required for vendor protected routes.
- OTP sessions with expiry and one-time verification.
- Contact details controlled through authenticated reveal logic (Milestone 2 integration).

