# Admin API Integration

**Status:** Contract proposal aligned with `jobayer-portfolio-api`. Confirm final paths and schemas against the backend OpenAPI specification.

## Responsibilities
The Angular admin dashboard:
- Authenticates the portfolio owner via `/api/v1/auth/*`.
- Reads both published and unpublished (`Draft`, `Archived`) records via `/api/v1/admin/*`.
- Performs create, update, reorder, publish/unpublish, and delete operations.
- Uploads and manages media/documents via `/api/v1/admin/media`.
- Reviews and manages visitor contact messages via `/api/v1/admin/messages`.

## Proposed Endpoint Groups

| Resource Group | Base Path | Key Operations |
|---|---|---|
| Auth | `/api/v1/auth` | `POST /login`, `POST /refresh`, `POST /logout`, `GET /me`, `POST /change-password` |
| Dashboard | `/api/v1/admin/dashboard` | `GET /summary` (counts, unread messages, recent edits) |
| Profile | `/api/v1/admin/profile` | `GET`, `PUT` profile, résumé asset reference, social links |
| Experiences | `/api/v1/admin/experiences` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `PATCH /:id/status`, `PUT /reorder`, `DELETE /:id` |
| Projects | `/api/v1/admin/projects` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `PATCH /:id/status`, `PUT /reorder`, `DELETE /:id` |
| Skills | `/api/v1/admin/skills` | Category & skill CRUD, `PUT /reorder` |
| Educations | `/api/v1/admin/educations` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| Publications | `/api/v1/admin/publications` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `PATCH /:id/status`, `DELETE /:id` |
| Certifications | `/api/v1/admin/certifications` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| Blog | `/api/v1/admin/blog` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `PATCH /:id/status`, `DELETE /:id` |
| Messages | `/api/v1/admin/messages` | `GET`, `GET /:id`, `PATCH /:id/status`, `DELETE /:id` |
| Media | `/api/v1/admin/media` | `GET`, `POST /upload`, `PATCH /:id`, `DELETE /:id` |

## Authentication & Interceptors
- Attach auth credentials automatically in an Angular `HttpInterceptor`.
- Intercept `401 Unauthorized` responses to attempt a single silent token refresh; if refresh fails, clear auth state and redirect to `/login?returnUrl=...`.
- Intercept `403 Forbidden` and display an explicit permission error.

## Validation & Error Mapping
- Backend returns RFC 9457 / RFC 7807 `ProblemDetails` and `ValidationProblemDetails`.
- Create a shared form error mapper utility that maps `errors[fieldName]` from the API response directly onto the corresponding Angular `FormControl` errors.
- Handle `409 Conflict` (e.g., duplicate project slug or concurrent update) with a clear user-facing resolution prompt.
