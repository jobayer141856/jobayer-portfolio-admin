# Admin Testing and QA

## Testing Goals
Ensure that authentication boundaries hold, CRUD forms never corrupt or silently lose content, server validation errors are accurately displayed, and destructive actions require confirmation.

## Test Layers

### Unit Tests
- `authGuard` and `unsavedChangesGuard` behavior.
- `authInterceptor` token attachment and `401` refresh queue logic.
- `form-error-mapper` mapping ASP.NET Core `ValidationProblemDetails` to `FormControl` errors.
- Slug generation and formatting utilities.

### Component Tests
- Login form submission, loading state, and invalid-credential alert.
- Project and Experience forms (dirty tracking, required field validation, date range toggles).
- `ConfirmDialog` focus trapping and cancel/confirm emission.
- `MediaPicker` file type/size validation and `alt` text requirement.

### End-to-End Tests (Playwright)
1. Unauthenticated visit to `/projects` redirects to `/login?returnUrl=%2Fprojects`.
2. Valid login redirects to requested route; invalid login shows error.
3. Create a new project as `Draft`, verify it saves, then toggle to `Published`.
4. Attempt to navigate away from a modified form and verify unsaved-changes prompt blocks navigation until confirmed.
5. Upload a new résumé PDF and verify active résumé reference updates.
6. Open an unread visitor contact message, verify status transitions to `Read`, and archive it.

## Release Checklist
- [ ] Lint and type-check (`ng build`) pass with zero errors.
- [ ] Unit, component, and E2E tests pass.
- [ ] `<meta name="robots" content="noindex, nofollow">` verified in build output.
- [ ] Keyboard navigation and modal focus traps verified.
- [ ] No credentials or secrets present in environment files.
