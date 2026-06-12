# Enterprise UI Specification — OctoTask Phase 2

**Palette:** Muted purple `#6b5ce7` (solid CTAs, no gradients)  
**Modes:** `auth-dark` | `app-light`

## Typography

- **Font:** IBM Plex Sans (400, 500, 600)
- **Page title:** 24px / 600
- **Section:** 16px / 600
- **Body:** 14px / 400
- **Caption:** 12px / 400, muted

## Shell

- Header height: `--shell-header-height: 48px`
- Rail width: `--shell-rail-width: 240px`
- Active nav: 3px left border `--color-primary`

## Auth (dark)

- Split 45% brand / 55% form
- Brand panel: product name, tagline, subtle grid
- Form: labels above fields, 40px input height, primary solid button

## App (light)

- Main bg: `#f4f5f7`
- Cards: white, 1px `#e1e3e8`, shadow-sm
- Kanban: sentence-case headers, 4px status accent on column top

## Modals

- Unified overlay + 12px radius + header/body/footer
- z-index: `--z-modal: 1000`
