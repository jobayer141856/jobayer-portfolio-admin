# Admin Open Product Questions

Resolve these items with the portfolio owner before finalizing implementation:

## Authentication & Access
- [ ] Confirm whether single-user owner login is sufficient or if multiple admin roles are needed.
- [ ] Confirm whether Two-Factor Authentication (TOTP / Authenticator app) is desired for admin login.
- [ ] Confirm preferred session mechanism: `HttpOnly` cookie session vs. short-lived JWT + refresh token cookie.

## Editorial & Content Authoring
- [ ] Confirm whether project case studies and optional blog articles should use a Markdown editor, a block-based rich text editor, or structured form fields.
- [ ] Confirm whether a live draft preview on the public frontend (via a signed preview token) is required before clicking Publish.
- [ ] Confirm whether the Blog module should be visible in the v1 admin sidebar.

## Media & Notifications
- [ ] Confirm maximum allowed file sizes for project images and résumé PDFs.
- [ ] Confirm whether new visitor contact messages should also trigger an immediate email notification to the owner in addition to appearing in `/messages`.
