# OctoTask UI Design Investigation

**Date:** 2026-06-01  
**Companion:** [FRONTEND_UI_UX_REFERENCE.md](./FRONTEND_UI_UX_REFERENCE.md)

---

## Selected palette

**Palette A: Octo Evolved** (default — implemented in this pass)

Rationale: Lowest visual shock; aligns with existing purple brand and user familiarity.

---

## 1. UX matrix (task-app benchmarks)

| Screen | Pattern (Linear/Jira/Asana) | OctoTask target |
|--------|----------------------------|-----------------|
| Kanban | Status color = meaning; readable cards | Tokenized column tints; card hierarchy title → meta → assignee |
| Filters | Active filters visible | Keep summary line; ghost/chip button styles |
| Modals | One overlay system | Unified radius, shadow, primary/destructive buttons |
| Analytics | Semantic chart colors | Late=pink, pending=orange, complete=green on charts |
| Auth | Single focal card | Centered card, gradient CTA, shared brand block |
| Nav | Clear active state | Selected item: elevated bg + border (existing classes) |

---

## 2. Three palette proposals

### A. Octo Evolved (SELECTED)

| Token | Hex | WCAG on `#1a1228` |
|-------|-----|-------------------|
| Primary | `#7B5CFF` | Large text OK |
| Primary dark | `#5A3DDB` | — |
| Text primary | `#F4F2F8` | ~15:1 |
| Text muted | `#B8B0C8` | ~7:1 |
| Surface card | `#2b2640` | — |
| Surface elevated | `#37343D` | — |
| Success | `#31B340` | Semantic |
| Warning | `#F1BF4F` | Semantic |
| Danger | `#C24648` | Semantic |
| Late column | `rgba(194,70,72,0.35)` | — |

### B. Midnight Teal

| Token | Hex |
|-------|-----|
| Primary | `#2DD4BF` |
| BG base | `#0B1220` → `#0F2847` |
| Accent | `#38BDF8` |

Contrast: teal on navy passes AA for large UI; body pairs validated ≥4.5:1 with `#E2E8F0` text.

### C. Slate Coral

| Token | Hex |
|-------|-----|
| Primary CTA | `#FF6B6B` |
| BG | `#1E293B` |
| Muted | `#94A3B8` |

High CTA contrast; calmer boards with desaturated column fills.

---

## 3. Typography & spacing (implemented)

| Token | Value |
|-------|-------|
| Font | IBM Plex Sans (`theme/global.css`) |
| Scale | 12 / 14 / 16 / 18 / 24 / 28 px (`--font-size-*`) |
| Space unit | 4px base (`--space-1` … `--space-8`) |
| Radius sm/md/lg/xl | 4 / 8 / 12 / 16 px |
| Shadow modal | `0 24px 48px rgba(0,0,0,0.35)` (auth card) |

Dual theme extension: `data-theme="auth-dark"` | `data-theme="app-light"` in `tokens.css` (enterprise shell pass — CSS only).

---

## 4. Token spec (see `src/theme/tokens.css`)

All implementation tokens live in CSS `:root` for Palette A.

---

## 5. Out of scope (this pass)

- Logout, session persistence, URL routing
- Register error UI logic fix
- New npm dependencies (Tailwind/MUI)
- Backend/API changes (except optional local H2 dev profile)
- Hamburger menu with new React state
- Recent Activity data wiring
- Kanban drag-and-drop (separate feature pass)

---

## 6. Implementation sign-off

| Deliverable | Path | Status |
|-------------|------|--------|
| Tokens (Palette A) | `src/theme/tokens.css` | Done — `#7B5CFF` primary |
| Global + auth + charts | `src/theme/global.css`, `auth.css`, `charts.js` | Done |
| 14+ CSS files | `src/**/*.css` | Done — `var(--*)` throughout |
| Auth `className` | `LoginView.jsx`, `RegisterView.jsx` | Done |
| Analytics colors | `AnalyticsView.jsx` → `charts.js` | Done |
| Assets | `logoSymbol.svg`, `public/logo.svg` | Done |
