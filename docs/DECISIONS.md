# Admin Architecture and Product Decisions

## Decision Record Template

### DEC-ADMIN-XXX — Short title
- **Status:** Proposed / Accepted / Rejected / Superseded
- **Date:**
- **Context:**
- **Decision:**
- **Alternatives considered:**
- **Consequences:**

## Initial Decisions

### DEC-ADMIN-001 — Separate SPA for Admin Dashboard
- **Status:** Accepted
- **Date:** 2026-11-05
- **Context:** The public portfolio requires SEO, SSR/prerendering, and zero admin bundle overhead, whereas the admin dashboard is a private, form-heavy CRUD application behind authentication.
- **Decision:** Build and deploy `jobayer-portfolio-admin` as a standalone Client-Side Rendered (CSR) Angular SPA.
- **Consequences:** Smaller public bundle size, cleaner security boundary, and ability to host admin on a restricted subdomain (e.g., `admin.example.com`).

### DEC-ADMIN-002 — Client-Side Rendering (CSR) for Admin
- **Status:** Accepted
- **Date:** 2026-11-05
- **Context:** Admin routes must never be indexed by search engines and always require authentication.
- **Decision:** Use standard Angular CSR static build without SSR.
- **Consequences:** Simpler static hosting and zero server-side Node runtime needed for the admin frontend.

### DEC-ADMIN-003 — Structured Markdown for Case Studies and Articles
- **Status:** Proposed
- **Date:** 2026-11-05
- **Context:** Project case studies and blog posts require code snippets, headings, lists, and architecture notes without unsafe arbitrary HTML.
- **Decision:** Use structured fields for key project sections combined with sanitized Markdown for long-form prose.
- **Consequences:** Consistent public rendering and protection against XSS or broken layout markup.
