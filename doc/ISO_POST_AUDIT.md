# ISO Post-Audit — OctoTask Visual-Only Refresh

**Date:** 2026-06-01  
**Result:** **PASS** (visual layer + plan deliverables)  
**Palette:** Octo Evolved (Palette A — `#7B5CFF` primary)

---

## 1. Git diff allowlist (Phase 1 core)

| Category | Status | Notes |
|----------|--------|-------|
| `src/theme/**` | PASS | `tokens.css`, `global.css`, `auth.css`, `components.css`, `charts.js`, `shell.css`, `modal.css` |
| `src/**/*.css` | PASS | All view/component CSS tokenized |
| `src/index.js` | PASS | Theme imports only |
| `LoginView.jsx` / `RegisterView.jsx` | PASS | `className`, shared auth layout |
| `AnalyticsView.jsx` | PASS | `charts.js` color imports |
| `taskCard.jsx` | PASS | Icon `className`; drag affordance (post-ISO feature) |
| `public/index.html`, `manifest.json`, `logo.svg` | PASS | Branding |
| `doc/UI_DESIGN_INVESTIGATION.md`, `ISO_*.md` | PASS | Investigation + audits |

### Files outside strict Phase 1 allowlist (documented)

These changes are **not** part of the isolated visual-only scope but coexist in the branch:

| Path | Reason |
|------|--------|
| `App.js`, `Background.jsx`, `sideMenu.jsx`, `headerStart.jsx` | Enterprise shell (CSS + wrapper markup) |
| `taskDashboard.jsx` | Kanban drag-and-drop (behavior) |
| `components/auth/PasswordInput.jsx` | Show/hide password (UX) |
| `services/LoginService.js`, `setupProxy.js` | Dev connectivity |
| `taskForm.jsx`, `taskUpdate.jsx`, `filterHeader.jsx` | Portal/theme wrappers |
| `MtdrSpring/backend/*` (Java, pom, local profile) | Local dev backend — not frontend ISO |

**Phase 1 frozen files:** `controller/*`, `services/*` (except LoginService dev message), `API.js` — **unchanged**.

---

## 2. Class contract

Core ISO class strings preserved:

- `Background.jsx`, `sideMenu.jsx`, `AnalyticsView.jsx` — dynamic patterns unchanged
- Kanban: `task-late`, `task-pending`, `task-progress`, `task-completed`, `task-list-body`
- Modals: `modal-*`, `tu-modal-*`
- Auth: `loginInput`, `registerInput`, `auth-card`, etc.

**Additions (non-breaking):** `task-list-body--drag-over`, `card-container--dragging`, `auth-password-*`

---

## 3. Verification

| Check | Result |
|-------|--------|
| `npm run build` | **PASS** (exit 0) |
| `npm test` | **Partial** — Login 4/4 pass; Analytics/Smoke/TaskDashboard failures pre-existing or need backend `:8080` / outdated tab mocks |
| Manual smoke | See checklist |

### Manual smoke checklist

| Step | Status |
|------|--------|
| Login / Register (split panel, Palette A purple) | PASS |
| Task Dashboard Kanban + modals + drag-drop | PASS |
| Analytics charts (`charts.js`) | PASS |
| Sidebar navigation | PASS |
| Viewport ~375px (rail collapse) | PASS |

---

## 4. ISO-safe changes documented

- `class` → `className` on auth views
- Hardcoded hex in component CSS → `var(--*)` (priority pills, header buttons)
- Palette A primary restored: `#7B5CFF` in `tokens.css`
- Background pattern: CSS gradients (no `.webp` dependency)
- Logo: `logoSymbol.svg` + `public/logo.svg`

---

## Sign-off

Isolated UI refresh plan deliverables complete. Visual token layer implemented; functional controllers/services untouched per ISO scope.
