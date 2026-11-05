# Admin Component Catalog

## Layout & Navigation Shell
- `AdminShell`: Main authenticated frame containing sidebar navigation, top header, breadcrumbs, and router outlet.
- `AdminSidebar`: Collapsible navigation menu with unread message badge.
- `AdminHeader`: Current page title, quick link to public website, user profile dropdown, and logout button.

## Data Display & Listing Components
- `AdminDataTable`: Reusable accessible table supporting pagination, column sorting, status filter tabs, and action menus.
- `StatusBadge`: Semantic pill displaying `Published`, `Draft`, `Archived`, `Featured`, or `Unread`.
- `StatCard`: Dashboard metric card showing count, label, and quick-navigation link.
- `ReorderHandle`: Drag handle paired with accessible Move Up / Move Down buttons.

## Form & Authoring Components
- `FormSectionCard`: Grouped form container with heading, helper description, and control area.
- `FormField`: Wrapper providing label, required indicator, input slot, hint text, and validation error message.
- `SlugField`: Input coupled to a title field that auto-formats URL slugs and allows manual lock/unlock.
- `MarkdownEditor`: Split-pane or tabbed Markdown editor with sanitized preview and toolbar shortcuts.
- `TagSelector`: Multi-select chip input for technology stacks and categories.
- `DateRangeInput`: Start date, end date, and `Currently active / ongoing` checkbox toggle.
- `MediaPicker`: Modal and inline field control for uploading files or choosing from existing media assets, including `alt` text editing.

## Feedback & Protection Components
- `ConfirmDialog`: Modal dialog requiring explicit confirmation for delete, unpublish, or discard operations.
- `UnsavedChangesPrompt`: Sticky bottom bar or modal warning when form state is dirty.
- `ToastContainer`: Non-blocking notification stack for save/publish confirmations.
- `LoadingSkeleton` / `SpinnerOverlay`: Visual indicators for table fetches and form submissions.
- `EmptyState`: Actionable placeholder when a module has no records yet.
