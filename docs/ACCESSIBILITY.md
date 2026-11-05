# Admin Accessibility Requirements

**Target:** WCAG 2.2 AA across all administrative workflows.

## Semantic Structure & Landmarks
- Use `header`, `nav`, `main`, and `aside` landmarks for the admin shell.
- Maintain logical heading hierarchy (`h1` page title, `h2` form sections/cards).
- Use native `<button>` for actions and `<a>` for route navigation.

## Keyboard Navigation & Focus Management
- Every table action, filter, form control, tab, and modal must be operable via keyboard alone.
- Trap focus properly inside open modals (`ConfirmDialog`, `MediaPickerModal`) and restore focus to the triggering element on close.
- Support `Escape` to close modals, drawers, and dropdowns.
- Provide keyboard buttons (Move Up / Move Down) alongside drag-and-drop reordering for experiences, projects, and skills.

## Forms & Validation
- Every input, select, toggle, and rich-text area must have a programmatic label.
- Group related controls (such as date ranges or publication visibility radios) with `fieldset` and `legend`.
- Associate field hints and backend/client validation errors via `aria-describedby` and mark invalid fields with `aria-invalid="true"`.
- On failed form submission, move focus to a validation summary or the first invalid control.

## Tables, Statuses & Notifications
- Use semantic `<table>`, `<thead>`, `<tbody>`, and `<th scope="col">` for data listings.
- Never convey publication state (`Draft` vs `Published`) or message status (`Unread` vs `Read`) by color alone; always include text labels or accessible icons.
- Announce toast notifications and async upload completion using `aria-live="polite"` or `role="status"`.
