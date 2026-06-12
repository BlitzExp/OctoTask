# ISO Pre-Audit — OctoTask Visual-Only Refresh

**Date:** 2026-06-01  
**Status:** PASS — safe to proceed with CSS/theme layer  
**Frontend root:** `MtdrSpring/backend/src/main/frontend/src`  
**Plan:** Isolated UI refresh (visual-only, Palette A: Octo Evolved)

---

## 1. Styling–logic coupling

| Check | Result |
|-------|--------|
| `querySelector` / `getElementById` | None in `src/` |
| `classList` / `getComputedStyle` | None |
| Layout reads (`offsetWidth`, etc.) | None |

**Conclusion:** Class names are presentation hooks only. Renaming classes in JSX would break CSS; changing CSS values does not break logic.

---

## 2. File classification

### Frozen (no edits in ISO pass)

| Path | Reason |
|------|--------|
| `App.js` | Auth routing, `currView`, handlers |
| `API.js` | API base URL |
| `setupProxy.js`, `setupTests.js` | Dev/test infra |
| `NewItem.js` | Legacy unused |
| `controller/*.js` | Business orchestration |
| `services/*.js` | `fetch` / API |
| `components/task/Task.js` | Domain model |
| `components/taskForm/taskForm.jsx` | Create modal logic |
| `components/taskUpdate/taskUpdate.jsx` | Edit modal logic |
| `components/filterHeader/filterHeader.jsx` | Filter state |
| `components/headerStart/headerStart.jsx` | Nav handlers |
| `components/background/Background.jsx` | Layout wrapper (dynamic class string frozen) |
| `*.test.tsx` | No edits unless tests fail for non-visual reason |

### Visual JSX (allowlisted touches only)

| Path | Allowed changes |
|------|-----------------|
| `index.js` | Import theme CSS only |
| `views/login/LoginView.jsx` | `className`, markup copy, logo import |
| `views/register/RegisterView.jsx` | `className`, markup copy, logo import |
| `views/analytics/AnalyticsView.jsx` | Import `theme/charts.js`; replace inline chart colors |
| `components/sideMenu/sideMenu.jsx` | Icon styling via `className` (optional) |
| `components/task/taskCard.jsx` | Icon `className`; drag affordance classes (post-ISO) |

### CSS-only (primary restyle target)

**Original 14 files:**

- `index.css`
- `views/login/LoginView.css`, `register/RegisterView.css`, `taskDashboard/taskDashboard.css`, `analytics/AnalyticsView.css`, `notifications/notifications.css`
- `components/background/Background.css`, `headerStart/headerStart.css`, `sideMenu/sideMenu.css`, `task/taskCard.css`, `taskForm/taskForm.css`, `taskUpdate/taskUpdate.css`, `filterHeader/filterHeader.css`

**Extended theme layer (same pass):**

- `src/theme/tokens.css`, `global.css`, `auth.css`, `components.css`, `charts.js`
- `src/theme/shell.css`, `modal.css` (enterprise shell — CSS only)

---

## 3. Class name contract (must remain identical after pass)

### Dynamic class expressions (do not alter logic branches)

| File | Pattern |
|------|---------|
| `Background.jsx` | `background-layer` + optional ` background-layer-authenticated` |
| `sideMenu.jsx` | `item-container` / `item-container-selected`, `item-text` / `item-text-selected` |
| `AnalyticsView.jsx` | `analytics-charts-row` + optional ` analytics-charts-row-allsprints` |
| `taskCard.jsx` | `card-container` + drag modifiers; `card-info-pill` + `priority-*` |
| `taskUpdate.jsx` | `card-info-pill-modal` + `priority-*-modal` |

### Kanban / dashboard

`task-dashboard-container`, `task-title`, `create-task-button`, `task-list`, `task-late`, `task-pending`, `task-progress`, `task-completed`, `task-list-header`, `task-header-text`, `task-list-body`, `task-list-body--drag-over`

### Modals

`modal-overlay`, `modal-content`, `tu-modal-overlay`, `tu-modal-content`, `tu-btn-save`, `tu-btn-close`, `tu-btn-delete`, etc.

---

## 4. Test surface

| Test | Mocks | Risk from CSS-only |
|------|-------|-------------------|
| `LoginView.test.tsx` | Real LoginView | Low; uses `getByRole('button')` |
| `TaskDashboard.test.tsx` | TaskCard, TaskForm, TaskUpdate | **Very low** — CSS not exercised |
| `AnalyticsView.test.tsx` | Partial render | Low |
| `Smoke.test.tsx` | HTTP | None |

---

## 5. Sign-off

| Gate | Status |
|------|--------|
| Frozen list documented | PASS |
| Class contract documented | PASS |
| No style/logic coupling | PASS |

**Approved to begin:** `UI_DESIGN_INVESTIGATION.md` → theme implementation.
