# Admin Frontend Deployment

## Deployment Model
- `jobayer-portfolio-admin` is compiled as a static Single-Page Application (`ng build --configuration production`).
- Can be hosted on any static hosting platform, CDN, or reverse proxy (e.g., Cloudflare Pages, Vercel, Azure Static Web Apps, AWS S3 + CloudFront, or Nginx container) under a dedicated subdomain such as `admin.<domain>`.

## Routing & Fallback
- Configure SPA fallback routing so all non-asset routes rewrite to `/index.html`.
- Ensure `/index.html` is served with `Cache-Control: no-cache, no-store, must-revalidate` so new deployments take effect immediately, while hashed JS/CSS bundles use immutable long-term caching.

## Security Headers
Configure the host to return:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Robots-Tag: noindex, nofollow`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `Content-Security-Policy` restricting `connect-src` to the production API origin.

## Release Checklist
1. Lint, unit tests, and E2E tests pass in CI.
2. Production environment points to the production HTTPS API URL.
3. Verify login, token refresh, CRUD operations, media upload, and logout in staging.
4. Deploy to production and verify `X-Robots-Tag` and HTTPS headers.
