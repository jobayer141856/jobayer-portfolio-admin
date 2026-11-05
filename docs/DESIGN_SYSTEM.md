# Admin Design System

## Design Principles
- **High Ergonomics & Clarity:** Prioritize clear form labels, generous input targets, scannable tables, and unmistakable status indicators.
- **Visual Consistency:** Share foundational typography and neutral/semantic color tokens with the public design system while optimizing spacing for data density and long authoring sessions.
- **Accessible Contrast:** Meet WCAG 2.2 AA contrast ratios across all surfaces, badges, and validation messages.

## Color & Semantic Tokens
Define CSS custom properties for:
- **Surfaces:** App background, sidebar surface, card surface, modal surface, elevated/hover surface.
- **Text:** Primary, secondary/muted, disabled, inverse.
- **Brand Primary:** Used for primary save/publish buttons and active navigation indicators.
- **Semantic Statuses:**
  - `Success` (Green): `Published` badge, save confirmation toast.
  - `Warning` (Amber): `Draft` badge, unsaved changes banner.
  - `Neutral` (Slate/Gray): `Archived` badge, secondary actions.
  - `Info` (Blue): `Featured` indicator, `Unread` message badge.
  - `Danger` (Red): Delete actions, validation error borders and messages.

## Typography & Layout
- **Font Stack:** Clean sans-serif for UI/tables (e.g., Inter or system-ui) and monospace font (e.g., JetBrains Mono) for slugs, IDs, code blocks, and Markdown editing.
- **Shell Layout:** Fixed or collapsible left sidebar (`260px` desktop, drawer on mobile/tablet) with a scrollable main content container (`max-width: 1280px`).
- **Forms:** Single-column or 2-column responsive layout (`main content` + `sidebar metadata/status card`) so publication controls and save buttons remain easily reachable.
