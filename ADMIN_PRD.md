# Admin Dashboard Product Requirements Document (PRD)

**Project:** Personal Professional Portfolio\
**Application:** Private Admin Dashboard (`jobayer-portfolio-admin`)\
**Frontend Framework:** Angular\
**Status:** Draft --- pending product-owner confirmation\
**Document Version:** 0.1\
**Last Updated:** 5 November 2026

------------------------------------------------------------------------

## 1. Product Overview

### 1.1 Product Vision

Build a secure, fast, and ergonomic private content-management and operational dashboard that enables the portfolio owner to manage all professional portfolio content, media assets, publication states, and visitor contact inquiries without modifying code or redeploying the public website.

### 1.2 Product Scope

This PRD covers only the **private Angular admin dashboard** (`jobayer-portfolio-admin`).

The overall solution consists of three separately deployed applications:

1.  `jobayer-portfolio-web` --- public portfolio website (covered in `FRONTEND_PRD.md`).
2.  `jobayer-portfolio-admin` --- private content-management dashboard (covered by this PRD).
3.  `jobayer-portfolio-api` --- ASP.NET Core REST API and business logic (covered in `API_PRD.md`).

The admin application authenticates against the backend API and performs privileged CRUD, publication workflow, media management, and message review operations.

### 1.3 Product Goals

-   Allow effortless creation, editing, reordering, publishing, and archiving of portfolio content.
-   Prevent accidental publication of incomplete drafts or unverified claims.
-   Provide a centralized media and document manager for project screenshots, organization logos, and résumé PDFs.
-   Enable timely review and status tracking of visitor messages submitted through the public contact form.
-   Enforce strict authentication and session security.
-   Provide clear validation feedback, audit visibility, and safe confirmation flows for destructive actions.

### 1.4 Success Measures

-   The owner can update profile details, add a new project case study, or replace the active résumé in under 5 minutes.
-   Draft content remains strictly hidden from public endpoints until explicitly published.
-   Zero unauthorized access to administrative views or data.
-   Form validation errors from both client and backend are clearly surfaced next to relevant fields.
-   Unsaved changes are protected against accidental tab closure or route navigation.

------------------------------------------------------------------------

## 2. Target Users & Roles

### 2.1 Primary User

**Portfolio Owner / Super Admin**
- Full access to all content modules, media uploads, contact inbox, SEO defaults, and account security settings.

### 2.2 Future / Optional Roles

**Editor / Reviewer (Optional)**
- Can draft and edit content items if multi-user support is ever enabled, but cannot alter system settings or delete core records. (Single-owner mode is assumed for initial release unless specified otherwise.)

------------------------------------------------------------------------

## 3. UX and Visual Direction

### 3.1 Functional UX Principles

-   **Clarity and Density:** Prioritize scannable data tables, clear status badges (`Draft`, `Published`, `Archived`, `Featured`), and structured multi-section forms.
-   **Safety by Default:** Require confirmation dialogs for delete, unpublish, and overwrite actions. Warn on unsaved form changes.
-   **Immediate Feedback:** Show explicit saving spinners, upload progress bars, toast notifications on confirmed API success, and inline field errors on validation failure.
-   **Desktop-First, Tablet/Mobile-Capable:** Optimized for desktop/laptop authoring while allowing urgent edits or message checks on mobile devices.

------------------------------------------------------------------------

## 4. Information Architecture

### 4.1 Proposed Admin Sitemap

```text
/
├── /login
├── /forgot-password (if applicable)
├── /dashboard
├── /profile
├── /experiences
│   ├── /experiences/new
│   └── /experiences/:id/edit
├── /projects
│   ├── /projects/new
│   └── /projects/:id/edit
├── /skills
├── /educations
│   ├── /educations/new
│   └── /educations/:id/edit
├── /publications
│   ├── /publications/new
│   └── /publications/:id/edit
├── /certifications
│   ├── /certifications/new
│   └── /certifications/:id/edit
├── /blog (optional; pending confirmation)
│   ├── /blog/new
│   └── /blog/:id/edit
├── /messages
│   └── /messages/:id
├── /media
└── /settings
```

------------------------------------------------------------------------

## 5. Module and Page Requirements

### 5.1 Authentication & Session Management

-   **Login Page:** Email/username and password input, optional MFA code step (if enabled on backend), clear error feedback, and brute-force lockout messaging.
-   **Session Handling:** Automatic token refresh, session expiry notice, and immediate state cleanup on logout.
-   **Route Protection:** Unauthenticated users attempting to visit any admin route are redirected to `/login` with a `returnUrl` parameter.

### 5.2 Dashboard Overview (`/dashboard`)

-   **Content Summary Cards:** Counts of published vs. draft projects, experiences, publications, certifications, and blog articles.
-   **Unread Messages Widget:** Count and preview of latest unread visitor contact messages with quick links to `/messages`.
-   **Quick Actions:** Shortcuts to "Add Project", "Update Résumé", "Edit Profile", and "View Public Site".
-   **Recent Activity / Last Updated:** List of recently modified records and their publication status.

### 5.3 Profile & Résumé Manager (`/profile`)

-   Edit display name, professional headline, short hero introduction, full biography, and working approach.
-   Manage profile photo and mandatory accessible `alt` text.
-   Manage active résumé document (upload new PDF or select from Media Library, toggle public résumé download availability).
-   Configure public email visibility and social profile links (GitHub, LinkedIn, Google Scholar, Codeforces, LeetCode, etc.).
-   Edit global default SEO title, meta description, and Open Graph image.

### 5.4 Experience Manager (`/experiences`)

-   List all experience entries ordered by display order or chronology.
-   Create and edit entries: organization name, logo, job title, employment type, start/end dates, `isCurrent` toggle, location/work arrangement, summary, bulleted responsibilities, measurable outcomes, and technology tags.
-   Toggle `Draft` / `Published` status and adjust display order.

### 5.5 Projects Case-Study Manager (`/projects`)

-   Table/grid view with filters by status (`All`, `Published`, `Draft`, `Archived`), category, and `Featured` flag.
-   Create and edit full project case studies:
    -   Title and auto-generated/editable URL `slug`.
    -   Short summary and full case-study sections (problem/context, goals, role & contributions, architecture overview, challenges & decisions, verified outcomes).
    -   Cover image, gallery screenshots (with mandatory `alt` text and ordering), and technology tags.
    -   Live demo URL and repository URL with format validation.
    -   `isFeatured` toggle, display order, publication status, and route-level SEO metadata.

### 5.6 Skills Manager (`/skills`)

-   Manage skill categories (e.g., Backend Development, Frontend Development, Databases, Programming Languages, Tools & Platforms, Engineering Practices) and their display order.
-   Create, edit, reorder, and toggle visibility of individual skills within each category, including optional context descriptions.

### 5.7 Education Manager (`/educations`)

-   Manage academic records: institution, degree/qualification, department/major, start/end dates, optional result/CGPA + `showResultPublicly` toggle, academic highlights, and institution URL.

### 5.8 Publications Manager (`/publications`)

-   Manage research papers and articles: paper title, ordered author list, conference/journal/venue, publication date/year, DOI or official URL, abstract/summary, optional permitted PDF asset link, and publication status.

### 5.9 Certifications & Achievements Manager (`/certifications`)

-   Manage credentials and competitive programming / professional honors: title, issuer, issue date, optional credential ID, verification URL, badge/image, and display order.

### 5.10 Blog Manager (`/blog` --- Optional)

-   If enabled for release: rich text or Markdown article editor with live preview, slug management, categories/tags, cover image, reading time preview, SEO metadata, and `Draft` / `Published` / `Scheduled` workflow.

### 5.11 Contact Inbox (`/messages`)

-   Paginated list of visitor contact submissions with filters (`Unread`, `Read`, `Archived`, `Spam`).
-   Search by sender name, email, or subject.
-   Message detail view displaying sender name, email, subject, timestamp, message body, and quick `mailto:` reply action or status update (`Mark as Read/Unread`, `Archive`, `Delete`).

### 5.12 Media & Asset Library (`/media`)

-   Upload, browse, search, and delete images and PDF documents stored via the backend storage service.
-   Inspect file dimensions, file size, MIME type, public URL, and `alt` text.
-   Prevent deletion of assets currently referenced by published records (or warn explicitly before removal).

### 5.13 Settings & Security (`/settings`)

-   Change admin password and manage active sessions.
-   Trigger public frontend cache revalidation / webhook (if SSR/ISR caching is configured).

------------------------------------------------------------------------

## 6. Global Admin UI Components

-   `AdminShell` (sidebar navigation, top bar, user menu, environment badge).
-   `DataTable` (sorting, filtering, pagination, row actions, bulk selection where useful).
-   `StatusBadge` (`Published`, `Draft`, `Archived`, `Featured`, `Unread`).
-   `ConfirmDialog` (reusable modal for delete/unpublish/discard confirmation).
-   `UnsavedChangesBar` / guard prompt.
-   `SlugInput` (auto-generates kebab-case slug from title with manual override and uniqueness check).
-   `RichTextOrMarkdownEditor` (safe structured content authoring with preview).
-   `MediaPickerModal` (upload new asset or select existing image/PDF with `alt` text input).
-   `TagInput` (select or add technology tags).
-   `ReorderList` (accessible drag-and-drop or up/down keyboard reordering).
-   `ToastNotification` and `InlineValidationAlert`.

------------------------------------------------------------------------

## 7. Technical Requirements

-   **Framework:** Supported stable Angular release using standalone components, strict TypeScript, Reactive Forms, and Angular Signals.
-   **Routing:** Lazy-loaded feature routes protected by functional `canActivate` auth guards and `canDeactivate` unsaved-changes guards.
-   **Indexing Protection:** Serve `<meta name="robots" content="noindex, nofollow">` across all admin routes.
-   **API Integration:** Consume `/api/v1/auth/*` and `/api/v1/admin/*` endpoints with typed DTOs and centralized `HttpInterceptor` for auth headers and error normalization.

------------------------------------------------------------------------

## 8. Security and Privacy Requirements

-   Enforce authentication on every admin view and API call.
-   Use short-lived access tokens (`HttpOnly` cookies or memory-stored JWT with secure refresh rotation, aligned with backend specification).
-   Sanitize any HTML/Markdown previews.
-   Protect visitor PII in the Contact Inbox; never log message bodies or credentials to browser consoles or third-party scripts.
-   Do not include third-party marketing trackers in the admin app.

------------------------------------------------------------------------

## 9. Testing and Release Quality Gate

-   Unit tests for form validators, slug generators, auth guards, and HTTP interceptors.
-   Component tests for CRUD forms, confirmation modals, and table states.
-   E2E tests (Playwright) for login, creating/publishing a project, uploading a résumé, and reviewing a contact message.
-   Zero critical accessibility or security defects before release.

------------------------------------------------------------------------

## 10. Open Product Decisions

| Decision | Current Proposal | Status |
|---|---|---|
| Admin user model | Single owner account (`SuperAdmin`) | Proposed |
| Authentication storage | `HttpOnly` secure cookies or in-memory JWT + refresh cookie | Needs confirmation |
| Rich content authoring | Markdown editor with structured sections | Proposed |
| Blog module in v1 | Optional; toggleable via feature flag | Open |
| Public site preview | Preview drawer or signed preview token link | Open |
