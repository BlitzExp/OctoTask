# Enterprise UI Redesign Plan (Phase 2)

**Status:** Approved direction — ready for implementation  
**Date:** 2026-06-01  
**Supersedes:** Phase 1 “Octo Evolved” (token swap only — insufficient for enterprise look)

---

## Decisions (user-confirmed)

| Choice | Selection |
|--------|-----------|
| **Accent** | Muted purple (`#6b5ce7` solid CTAs — Octo identity, no loud gradients) |
| **Mode** | **Dark auth** (split marketing + sign-in) + **light authenticated workspace** |

---

## Goal

Make OctoTask feel like an **enterprise Oracle-adjacent** product: structured shell, light data workspace, professional auth — **zero behavior change** (same navigation, API, filters, modals, roles).

---

## Architecture

```text
UNAUTHENTICATED (data-theme="auth-dark")
┌─────────────────────────────────────────────────────────┐
│  [logo] OctoTask                    [Create account]    │  shell-header 48px
├──────────────────────┬──────────────────────────────────┤
│  Brand panel         │  Sign in / Register form         │
│  (value prop, grid)  │  (enterprise fields)           │
└──────────────────────┴──────────────────────────────────┘

AUTHENTICATED (data-theme="app-light")
┌─────────────────────────────────────────────────────────┐
│  [logo] OctoTask                                         │  shell-header
├──────────┬──────────────────────────────────────────────┤
│ Nav rail │  Light main (Kanban / Analytics / stubs)     │
│ 240px    │  Page title + actions row                    │
└──────────┴──────────────────────────────────────────────┘
```

---

## Frozen vs editable

### Frozen (no logic edits)

- `App.js` — `useState`, `handleNavigate`, `handleUserAfter`, `currView` values
- `controller/*`, `services/*`, `API.js`, `Task.js`
- `taskDashboard.jsx` — filter state, handlers, modal state, API wiring
- `filterHeader.jsx` — filter logic and `onFilterChange`
- All `onClick` / `onSubmit` handler bodies
- Form field `id` / `name` attributes

### Editable

| Area | Files |
|------|-------|
| Shell | `App.js` wrappers, `Background.jsx`, `headerStart.jsx`, `sideMenu.jsx` |
| Auth layout | `LoginView.jsx`, `RegisterView.jsx` (markup + label copy) |
| Theme | `src/theme/*`, all `*.css`, `index.js` imports |
| Dashboard | `*.css`, optional empty-state markup in `taskDashboard.jsx` |
| Modals | `modal.css`, `taskForm.css`, `taskUpdate.css`, portal in `taskUpdate.jsx` |
| Cards | `taskCard.css`, `taskCard.jsx` (labels + icon class) |
| Analytics | `AnalyticsView.css`, `charts.js`, cosmetic lines in `AnalyticsView.jsx` |
| Public | `index.html`, `manifest.json` |

**Preserve class names:** `item-container-selected`, `task-late`, `priority-high`, `fh-*`, `modal-*`, `tu-*`, etc.

---

## Subagent protocol

| Step | Agent | Deliverable | Blocks |
|------|-------|-------------|--------|
| 0 | explore | `ENTERPRISE_UI_SPEC.md` | Implementation |
| 1 | explore | `ENTERPRISE_PRE_AUDIT.md` | Phase 2B+ |
| 2 | explore (optional) | Shell review notes after 2B | Phase 2C |
| 3 | explore + git diff | `ENTERPRISE_POST_AUDIT.md` | Release |

### Post-audit allowlist

- `src/theme/**`, `src/**/*.css`, `src/index.js`
- `App.js`, `Background.jsx`, `headerStart.jsx`, `sideMenu.jsx`
- `LoginView.jsx`, `RegisterView.jsx`
- `AnalyticsView.jsx` (cosmetic), `taskCard.jsx`, `taskUpdate.jsx` (portal)
- `doc/ENTERPRISE_*.md`, `public/*`

---

## Phase 2A — Design system

**Files:** `tokens.css` (dual theme), `enterprise.css`, `shell.css`, `modal.css`, `auth.css`, `global.css` (IBM Plex Sans)

**Auth-dark tokens:** `#12141a` bg, `#22262f` surfaces, `#f0f1f3` text  
**App-light tokens:** `#f4f5f7` bg, `#ffffff` surfaces, `#161513` text, `#e1e3e8` borders  
**Primary:** `#6b5ce7` — solid buttons, no gradient pills  
**Remove:** `bgFloat`, 3px white outlines, purple app gradients, Poppins

---

## Phase 2B — Shell + auth (subagent: shell audit `0fba8725`)

1. **App.js** — `app-shell--unauth` / `app-shell--app`; mount `HeaderStart` when authenticated
2. **Background.jsx** — `data-theme` on `shell-stage`; flat backgrounds
3. **headerStart.jsx** — `shell-header__start` / `__end`; 48px banner
4. **sideMenu.jsx** — Remove rail header + 15vh spacer; `shell-layout` + `<nav>` + `<main>`
5. **Login/Register** — Split panel; drop in-card brand hero; shared `auth-card`

**Done when:** Login looks clearly different; app main area is light gray/white.

---

## Phase 2C — Workspace (subagent: dashboard audit `55261eed`)

1. **taskDashboard.css** — Light columns, no glow, sentence-case headers, spacing tokens
2. **taskCard.css** — White cards, subtle shadow; Priority / Est. hours labels
3. **filterHeader.css** — Align with Create button; `data-active` on filter btn
4. **modal.css** — Unify `.modal-*` + `.tu-modal-*`
5. **taskUpdate.jsx** — Portal to `document.body` only

**Done when:** Kanban reads like a product board, not neon demo; one modal visual language.

---

## Phase 2D — Analytics (subagent: analytics audit `80acffcb`)

1. **AnalyticsView.css** — Light panels, compact title/filter, KPI metric-first
2. **charts.js** — Light grid, white tooltip, muted series
3. **AnalyticsView.jsx** — Theme props only (~lines 206–485); no fetch/memo changes

---

## Phase 2E — Polish

- Stub views: enterprise empty-state panels (Home, Team, Profile, Notifications)
- Update `FRONTEND_UI_UX_REFERENCE.md`, `UI_DESIGN_INVESTIGATION.md`

---

## Verification

```bash
cd MtdrSpring/backend/src/main/frontend
npm run build   # PASS required
npm test        # Login + Analytics PASS; smoke needs backend :8080
npm start       # http://localhost:3000
```

**Manual:** auth split panel → light app → Kanban → modals → analytics → 375px width

---

## Out of scope

- react-router, logout, session persistence
- Register error logic
- MUI/Tailwind (unless required)
- Backend/API changes
- Filter/task business logic changes

---

## Implementation order

```text
ENTERPRISE_UI_SPEC → ENTERPRISE_PRE_AUDIT
  → 2A tokens
  → 2B shell + auth
  → 2C workspace
  → 2D analytics
  → 2E stubs + docs
  → verify → ENTERPRISE_POST_AUDIT
```

---

## Subagent findings (summary)

- **Shell:** Two incompatible shells today; need global header + rail under header + light main ([full report in plan session](agent-transcript)).
- **Dashboard:** TaskForm vs TaskUpdate dual modals + cream cards + column glow = school project feel.
- **Analytics:** Should follow light workspace; KPI/chart chrome in CSS, series in `charts.js`.
