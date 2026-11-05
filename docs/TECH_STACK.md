# Admin Frontend Technology Stack

**Application:** Private Portfolio Admin Dashboard (`jobayer-portfolio-admin`)  
**Status:** Proposed baseline

## Stack Overview

| Area | Technology | Purpose |
|---|---|---|
| Framework | Angular (stable release, standalone APIs) | Admin SPA |
| Rendering | Client-Side Rendering (CSR) | Authenticated private dashboard |
| Language | TypeScript (strict mode) | Typed forms, models, and services |
| Styling | Tailwind CSS or SCSS (matching public web choice) | Consistent tokens and admin layout |
| Forms | Typed Angular Reactive Forms | Complex CRUD authoring and validation |
| State | Angular Signals + Feature Services | Auth state, table filters, upload progress |
| HTTP | Angular `HttpClient` + Functional Interceptors | Auth headers, refresh handling, error mapping |
| Rich Text / Markdown | Lightweight Markdown editor + DOMPurify sanitizer | Case study and blog authoring |
| Drag & Drop | Angular CDK DragDrop (`@angular/cdk/drag-drop`) | Accessible list and gallery reordering |
| Dialogs / Overlays | Angular CDK Dialog / Overlay (or native `<dialog>`) | Accessible modals and media picker |
| E2E Testing | Playwright | Login and CRUD journey verification |
| Linting & Formatting | ESLint + Prettier | Code quality consistency |

## Dependency Guidelines
- Use `@angular/cdk` for low-level primitives (modals, focus trap, drag-and-drop, clipboard) rather than heavy third-party UI kits where practical.
- Never include unmaintained WYSIWYG editors that inject unsafe inline HTML or bloat bundle size.
