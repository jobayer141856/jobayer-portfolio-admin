# Editorial and Content Workflows

## Publication Lifecycle
Every publishable entity (`Project`, `Experience`, `Publication`, `Certification`, `BlogArticle`) follows a controlled lifecycle:

1. **Draft (`Draft`):**
   - Saved in the database and visible only in the admin dashboard.
   - Incomplete optional fields are allowed while drafting, provided minimum schema constraints are met.
   - Never returned by public `/api/v1/*` endpoints.
2. **Published (`Published`):**
   - All required public fields (such as title, slug, summary, and required image `alt` text) are validated by the backend before transitioning to `Published`.
   - Immediately visible on the public portfolio (or triggers cache revalidation).
3. **Archived (`Archived`):**
   - Hidden from public listings without deleting historical data.

## Slug Management Rules
- Slugs are lowercase, alphanumeric, hyphen-separated strings (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).
- Auto-generated from the title while creating a new `Draft`.
- Once an item is `Published`, changing its slug displays a warning because external links may break unless a redirect is recorded.

## Featured Content Rules
- Projects and selected highlights can be marked `isFeatured = true`.
- Only items that are both `Published` and `isFeatured` appear on the public Home page.
- Admin allows reordering featured items explicitly.

## Media & Résumé Workflow
1. Admin uploads an image or PDF via the Media Picker or Résumé section.
2. Backend validates file signature, stores the file, and returns an asset record with ID and public URL.
3. For the active résumé, the owner can upload a new PDF version and switch the active résumé pointer without breaking the public download button.

## Contact Message Workflow
1. Visitor submits message on public site -> created with status `Unread`.
2. Admin opens message in `/messages/:id` -> automatically or manually marked `Read`.
3. Admin can reply via email client (`mailto:` prefilled with subject/body context) and mark the message `Replied`, `Archived`, or `Spam`.
