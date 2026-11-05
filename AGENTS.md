# Admin Frontend Agent Instructions

## Scope
This repository contains the private Angular administration dashboard (`jobayer-portfolio-admin`) only. The public Angular portfolio (`jobayer-portfolio-web`) and the ASP.NET Core backend (`jobayer-portfolio-api`) are separate applications.

## Before changing code
1. Read `ADMIN_PRD.md` and the relevant documents in `docs/`.
2. Inspect the existing Angular version, project structure, dependencies, and conventions.
3. Check existing components, guards, interceptors, and services before creating new ones.
4. Identify whether a requirement depends on an API contract or product decision that is not yet confirmed.

## Core rules
- Use the approved `ADMIN_PRD.md` as product guidance.
- Protect all administrative routes with authentication and authorization guards; backend authorization remains authoritative.
- Do not hardcode credentials, tokens, private API keys, or secrets in frontend source or environment files.
- Never bypass authentication flows in production builds.
- Keep admin CRUD workflows cleanly separated from public portfolio presentation concerns.
- Prevent accidental destructive actions (such as deleting records or unpublishing live content) by requiring explicit user confirmation.
- Handle unsaved form changes with route-deactivation guards or clear user warnings.
- Handle loading, empty, validation-error, conflict, unauthorized (`401`/`403`), and server-error states explicitly.
- Do not claim an action (create, update, publish, delete, upload) succeeded until the API confirms success.
- Sanitize or safely preview rich text / Markdown content to prevent XSS.
- Add `noindex, nofollow` metadata so the admin application is never indexed by search engines.

## API integration
- Use typed request and response models aligned with the backend `/api/v1/admin/*` and `/api/v1/auth/*` OpenAPI specification.
- Centralize API access in dedicated feature services.
- Attach authentication credentials/tokens via a centralized HTTP interceptor and handle token refresh or session expiration gracefully.
- Treat client-side validation as a usability aid; map backend `ProblemDetails` / validation errors to form fields.

## Quality checks
Before completing a change:
1. Run formatting and lint checks available in the repository.
2. Run relevant unit, component, and integration tests.
3. Run a production build.
4. Check keyboard accessibility, focus management in modals/drawers, and responsive table/form layouts.
5. Update documentation when routes, permissions, API contracts, or architectural decisions change.

## Handling ambiguity
If content rules, editorial workflows, authentication mechanisms, or API schemas are unclear, document the question in `docs/OPEN_QUESTIONS.md` and ask for clarification rather than inventing a consequential answer.
