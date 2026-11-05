# Authentication and Security

## Security Principles
- The admin frontend is a privileged client, but **all security enforcement happens on the ASP.NET Core backend**.
- Never store plaintext passwords, private signing keys, or cloud storage master keys in the Angular admin app.
- Serve the application exclusively over HTTPS in staging and production.

## Authentication Flow
1. **Login:** User submits credentials to `POST /api/v1/auth/login`.
2. **Token Storage:**
   - **Preferred Option A (`HttpOnly` Cookie + CSRF protection):** Backend sets `HttpOnly`, `Secure`, `SameSite=Strict` cookies; Angular sends requests with `withCredentials: true`.
   - **Option B (In-Memory Access Token + `HttpOnly` Refresh Cookie):** Access token is held only in memory (Angular service/signal) and refreshed via `/api/v1/auth/refresh` on app initialization or `401`. Avoid storing long-lived tokens in `localStorage`.
3. **Route Guards:** Functional `authGuard` checks session state before activating any route under the authenticated shell.
4. **Logout:** Calls `POST /api/v1/auth/logout`, clears client memory/caches, and navigates to `/login`.

## Content & Asset Safety
- Sanitize HTML previews when editing Markdown or rich text.
- Validate file types and maximum file sizes on the client before upload (while relying on backend MIME/signature verification as authoritative).
- Require `alt` text when selecting or uploading meaningful content images.

## Search Engine & Framing Protection
- Include `<meta name="robots" content="noindex, nofollow">` in `index.html`.
- Configure HTTP response headers on the admin host:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: no-referrer`
  - Strict `Content-Security-Policy`
