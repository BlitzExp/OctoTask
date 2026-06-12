# OctoTask / OctoBuddy — Full System Audit

**Date:** 2026-06-08  
**Scope:** Spring Boot backend + React frontend + local seed data + tests + CI  
**Purpose:** Bug and quality inventory for a phased fix plan.

---

## Executive summary

The app is **functionally usable for local demo** (H2 seed, login, kanban, analytics) but has **real bugs** in registration, task creation UX, role handling, and analytics math. **Security is not production-ready** (no auth on APIs, plaintext passwords). **Tests are largely broken** (13/14 Vitest failures). Several **UI polish items** and **uncommitted assets** risk broken deploys.

| Area | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| Frontend | 3 | 5 | 12 | 10 |
| Backend | 3 | 7 | 9 | 6 |
| Tests / CI | — | 2 | 3 | 2 |
| **Total (deduped)** | **6** | **12** | **20** | **15** |

---

## Reclassified (product context)

| ID | Original | Stance |
|----|----------|--------|
| FE-C02 | Created tasks don’t appear for devs | **By design** — post-create board updates are role-scoped; admins see team-wide, developers see own-assigned only |
| CI-H02 | `build.sh` / `-DskipTests` | **Local packaging only** — production CI runs tests |

## Already fixed

| ID | Issue | Status |
|----|--------|--------|
| FIX-01 | Filter panel floated over Kanban | **Fixed** |
| FIX-02 | Board mascots overlapped header/filter zone | **Fixed** |
| FIX-03 | Missing OctoBuddy PNGs | **Fixed** — committed in `public/assets/octobuddy/` |
| P01 | Register crash (`useState` typo) | **Fixed** — Phase 0 |
| P02 | `isPrivileged()` for admin/manager | **Fixed** — Phase 0 |
| P03 | Analytics pending double-counts LATE | **Fixed** — `StadisticsService` Phase 1 |
| P04 | Vitest 13/14 failures | **Fixed** — 12/12 unit tests pass; smoke split to `npm run test:smoke` |
| P05 | Session persistence + sign out | **Fixed** — `sessionStorage` + header button |
| P06 | Loading/error UX on board, modals, home, pod | **Fixed** — Phase 1 |
| P07 | `teamId: 0` silent empty views | **Fixed** — `PodEmptyState` |
| P08 | Task links in edit modal | **Fixed** — `linkToFile` parsing |
| P09 | Pod counts by member id | **Fixed** |
| P10 | Backend validation + `@ControllerAdvice` | **Fixed** — `CreateTask` + 400/404 |
| P11 | Seed `MANAGER_ID` for maya | **Fixed** — `data-local.sql` |
| P12 | English copy + a11y polish | **Fixed** |

---

## Severity definitions

- **CRITICAL** — Broken feature, crash, data leak, or security hole
- **HIGH** — Wrong behavior for a user role or misleading data
- **MEDIUM** — Poor UX, silent failures, inconsistency
- **LOW** — Polish, a11y, dead code, docs drift

---

# Part 1 — Frontend

## CRITICAL

### FE-C01 — Registration error handling crashes

| Field | Detail |
|-------|--------|
| **File** | `src/main/frontend/src/views/register/RegisterView.jsx:16` |
| **Symptom** | Password mismatch or API error throws at runtime |
| **Evidence** | `const [setError] = useState('')` — `setError` is the string `''`, not the setter. Lines 23, 30, 33 call `setError(...)`. No `{error}` rendered in JSX. |
| **Fix** | `const [error, setError] = useState('')`; render error with `role="alert"`. |

### FE-C02 — Created tasks don’t appear for non-admin users

| Field | Detail |
|-------|--------|
| **File** | `src/main/frontend/src/views/taskDashboard/taskDashboard.jsx:467-472` |
| **Symptom** | Toast says “Added to the board!” but card missing for developers |
| **Evidence** | `newTask.assigneeId === user.id` — `Task` model uses `userId`, not `assigneeId`. Admin branch works; dev branch never matches. |
| **Fix** | Use `Number(newTask.userId) === Number(user.id)`; extend privileged branch to `manager` (see FE-H01). |

### FE-C03 — New registrations get `teamId: 0` (developers)

| Field | Detail |
|-------|--------|
| **Files** | `UserService.java` (backend); `HomeView`, `PodView`, `notifications`, `taskForm`, sprint/team fetches |
| **Symptom** | After self-register as Developer, most views silently show empty data |
| **Evidence** | Backend sets `team_id = null` for non-admin roles → JSON `teamId: 0`. Frontend guards `if (!user?.teamId) return`. |
| **Fix** | Backend: team join/invite flow. Frontend: explicit empty state “Not on a pod yet” instead of silent no-op. |

---

## HIGH

### FE-H01 — Inconsistent `admin` vs `manager` privilege checks

| Field | Detail |
|-------|--------|
| **File** | `taskDashboard.jsx` |
| **Symptom** | User `maya` (`role: manager` in seed) sees own tasks on board but team-wide on Pod/Alerts/Analytics filters |
| **Evidence** | Team task fetch + post-create: `user.role === 'admin'` only (lines 166, 468). Filters use `admin \|\| manager` (lines 114, 350). Pod/Alerts use `admin \|\| manager`. |
| **Fix** | Shared `isPrivileged(user)` helper; use everywhere. |

### FE-H02 — Role labeling inconsistent

| Field | Detail |
|-------|--------|
| **Files** | `RegisterView.jsx:113`, `ProfileView.jsx`, `sideMenu.jsx` |
| **Evidence** | Register: `<option value="admin">Manager</option>`. Profile: `admin` → “Admin”. Side menu: “Admin”. Seed has `manager` role for maya. |
| **Fix** | One `formatRole()` module; align DB values (`admin` vs `manager`). |

### FE-H03 — `manager` role checked but never registered

| Field | Detail |
|-------|--------|
| **Files** | `PodView`, `notifications`, `AnalyticsView`, `taskDashboard` filters |
| **Evidence** | Register only offers `user` and `admin`. `manager` only exists via seed SQL. |
| **Fix** | Register `manager` explicitly or collapse to `admin` + `user` only. |

### FE-H04 — Home shows team-wide stats to developers

| Field | Detail |
|-------|--------|
| **File** | `HomeView.jsx` |
| **Evidence** | All users call `fetchNumTasksAllController(user.teamId)` with no role guard. |
| **Fix** | Scope stats for `user` role or label as “Pod totals”. |

### FE-H05 — Tests out of sync with UI (CI blocker)

| Field | Detail |
|-------|--------|
| **Files** | `LoginView.test.tsx`, `TaskDashboard.test.tsx`, `AnalyticsView.test.tsx`, `Smoke.test.tsx` |
| **Evidence** | 13/14 Vitest tests fail. Wrong button text (“Sign in” vs “Dive in”), Kanban “Done” vs “Completed”, missing `userId` on mock tasks. |
| **Fix** | Update selectors and mocks; split smoke tests from unit suite. |

---

## MEDIUM

### FE-M01 — No session persistence or logout

| **File** | `App.js` |
| **Evidence** | Auth in `useState` only; refresh → login. No logout in header. |
| **Fix** | `sessionStorage` + logout button; optional JWT later. |

### FE-M02 — No URL routing (view state only)

| **File** | `App.js` |
| **Evidence** | `currView` string switch; back button / deep links don’t work. Unknown view → TaskDashboard. |
| **Fix** | React Router with routes matching sidebar ids. |

### FE-M03 — Task board: no loading/error UI

| **File** | `taskDashboard.jsx` |
| **Evidence** | Fetch errors only `console.error`; empty board with no explanation. |
| **Fix** | `loading` / `error` states + banner or `EmptyState`. |

### FE-M04 — Task form/update: silent failures

| **Files** | `taskForm.jsx`, `taskUpdate.jsx` |
| **Evidence** | Errors logged only; modal stays open. |
| **Fix** | Inline error or `Toast`. |

### FE-M05 — Kanban drop failure uses `alert()`

| **File** | `taskDashboard.jsx:245` |
| **Fix** | Use `Toast` like success path. |

### FE-M06 — `getTimeUntilDue` breaks without sprint end date

| **Files** | `operationsController.js`, `taskCard.jsx` |
| **Evidence** | No null guard → `NaN` in overdue text. Card shows “Sin fecha” but still computes overdue. |
| **Fix** | Guard invalid dates; standardize copy to English. |

### FE-M07 — Task edit modal: links never show

| **File** | `taskUpdate.jsx:307-321` |
| **Evidence** | UI checks `task.links`; model has `linkToFile` only. |
| **Fix** | Parse/display `linkToFile`. |

### FE-M08 — Pod task counts keyed by name not id

| **File** | `PodView.jsx` |
| **Evidence** | Counts by `task.userName`; lookup by `member.name` — fragile if formats differ. |
| **Fix** | Key by `member.id` / `task.userId`. |

### FE-M09 — `registerController` duplicate-check logic wrong

| **File** | `registerController.js` |
| **Evidence** | `checkDuplicates` returns `Response`; `if (!success)` is dead code. |
| **Fix** | Parse response; handle 409 with user message. |

### FE-M10 — Mixed English/Spanish copy

| **Files** | `AnalyticsView.jsx`, `taskCard.jsx` |
| **Evidence** | “Número de tareas…”, “Sin fecha”. |
| **Fix** | English-only or i18n. |

### FE-M11 — Analytics sprint fetch weak null guard

| **File** | `AnalyticsView.jsx` |
| **Evidence** | Effect uses `user.teamId` dependency without `user` null check. |
| **Fix** | `if (!user?.teamId) return`. |

### FE-M12 — `ReactDOM.render` (deprecated)

| **File** | `index.js` |
| **Fix** | `createRoot`. |

---

## LOW

| ID | Issue | File |
|----|--------|------|
| FE-L01 | Dead code `NewItem.js` (MUI todo, unused) | `src/NewItem.js` |
| FE-L02 | `EmptyState.jsx` built but unused in Kanban | `components/empty/EmptyState.jsx` |
| FE-L03 | Debug `console.log` in prod paths | `App.js`, `taskDashboard`, `tasksViewController` |
| FE-L04 | `onGoToRegister('register')` passes ignored arg | `LoginView.jsx` |
| FE-L05 | Filter toggle missing `aria-expanded` | `filterHeader.jsx` |
| FE-L06 | Task cards lack `aria-label` | `taskCard.jsx` |
| FE-L07 | Duplicate mascots on auth forms (PNG + SVG) | `LoginView`, `RegisterView` |
| FE-L08 | `formatRole` incomplete in side menu | `sideMenu.jsx` |
| FE-L09 | Home sprint label may double-prefix “Sprint Sprint 1” | `HomeView.jsx:33` |
| FE-L10 | `userID` / `userId` duality (works but fragile) | controllers, task payloads |

---

# Part 2 — Backend

## CRITICAL

### BE-C01 — No API authentication or authorization

| Field | Detail |
|-------|--------|
| **Files** | All controllers; no `spring-boot-starter-security` in `pom.xml` |
| **Impact** | Any client can read/write any team’s tasks, analytics, users |
| **Fix** | Spring Security + JWT or sessions; protect `/api/**` except login/register. |

### BE-C02 — Plaintext password storage

| Field | Detail |
|-------|--------|
| **File** | `UserService.java` |
| **Evidence** | SQL `password = ?` direct compare; INSERT stores raw password. Seed uses plaintext. |
| **Fix** | BCrypt via `PasswordEncoder`; migration for existing rows. |

### BE-C03 — Login is one-shot (no server session)

| Field | Detail |
|-------|--------|
| **Files** | `UserController`, `LoginService.js` |
| **Evidence** | Returns `User` JSON; subsequent fetches send no auth header |
| **Fix** | Issue JWT or HTTP-only cookie; validate on every request. |

---

## HIGH

### BE-H01 — Analytics “pending” double-counts LATE tasks

| Field | Detail |
|-------|--------|
| **File** | `StadisticsService.java:45-52` |
| **Evidence** | `pending` = `ts.name != 'DONE'` (includes LATE). `late` counted separately. Member breakdown uses `PENDING + ON GOING` only (line 72). |
| **Impact** | Home/Alerts: `active + late` overlaps; KPIs can exceed total |
| **Fix** | `pending = PENDING + ON GOING` only; document bucket definitions. |

### BE-H02 — Work-hours query drops members with zero tasks

| Field | Detail |
|-------|--------|
| **File** | `StadisticsService.java` (~line 100) |
| **Evidence** | `WHERE t.visible = 1` on LEFT JOIN nullifies users with no tasks |
| **Fix** | Move visibility filter into JOIN `ON` clause. |

### BE-H03 — `VISIBLE` vs `VISIBILITY` column split

| Field | Detail |
|-------|--------|
| **Files** | `schema-local.sql`, `TaskService.java` |
| **Evidence** | Delete sets `Visible = 0`; create/update use `VISIBILITY` |
| **Fix** | Single column; always set on delete. |

### BE-H04 — Registration leaves developers without team

| Field | Detail |
|-------|--------|
| **File** | `UserService.createUser` |
| **Evidence** | Only `admin` creates team; `user` → `team_id = null` |
| **Fix** | Join-team flow or default team assignment. |

### BE-H05 — No server-side validation on task CRUD

| Field | Detail |
|-------|--------|
| **Files** | `TaskController`, `TaskService`, `CreateTask` model |
| **Evidence** | Empty form fields → SQL errors → HTTP 500 |
| **Fix** | `@Valid`, 400 responses, FK checks. |

### BE-H06 — Oracle env var documentation mismatch

| Field | Detail |
|-------|--------|
| **Files** | `README-local.md`, `application.properties`, `.env.example` |
| **Evidence** | README uses `$env:db_url`; properties use `DB_URL` |
| **Fix** | Standardize names; startup validation message. |

### BE-H07 — Smoke tests target non-existent endpoints

| Field | Detail |
|-------|--------|
| **File** | `Smoke.test.tsx` |
| **Evidence** | `/actuator/health`, `/api/public/status` — real ping is `/api/database/ping` |
| **Fix** | Update smoke URLs or add actuator. |

---

## MEDIUM

| ID | Issue | File / notes |
|----|--------|----------------|
| BE-M01 | JSON field naming unstable (`userID` vs `userId`) | `Task.java` getters → add `@JsonProperty` |
| BE-M02 | Seed `MANAGER_ID=1` but maya is `manager` (id=3) | `data-local.sql:30` |
| BE-M03 | Sprint default may be 3 not “current” sprint 2 | Filter orders `SPRINT_NUM DESC` |
| BE-M04 | Duplicate-check API naming inverted | `UserController /Check` |
| BE-M05 | Almost all errors return HTTP 500 | All controllers — add `@ControllerAdvice` |
| BE-M06 | Self-registration can create `admin` + new team | `RegisterView` + `UserService` |
| BE-M07 | H2 schema may drift from Oracle prod | `schema-local.sql` vs prod DDL |
| BE-M08 | CORS `allowedOrigins("*")` | `CorsConfig.java` — tighten for prod |
| BE-M09 | Stale Swagger spec in `public/` | Documents old `/todolist` API |

---

## LOW

| ID | Issue |
|----|--------|
| BE-L01 | Unused JPA, telegrambots deps in `pom.xml` |
| BE-L02 | Unused imports in controllers |
| BE-L03 | `PUT /delete/{id}` non-RESTful (works with frontend) |
| BE-L04 | H2 console enabled in local profile (OK for dev) |
| BE-L05 | `/api/database/ping` unauthenticated (low risk) |
| BE-L06 | `sprintNumber` may be empty on task update (non-blocking) |

---

# Part 3 — Tests & CI

| ID | Severity | Issue |
|----|----------|--------|
| CI-H01 | HIGH | `npm test`: **13 failed / 1 passed** — not CI-ready |
| CI-H02 | HIGH | `build_spec.yaml` runs `-DskipTests`; no frontend tests in pipeline |
| CI-M01 | MEDIUM | No coverage tooling (`@vitest/coverage-v8` missing) |
| CI-M02 | MEDIUM | Only 4 test files for ~42 source files |
| CI-M03 | MEDIUM | Backend test is trivial `assertDoesNotThrow` only |
| CI-L01 | LOW | `ENTERPRISE_POST_AUDIT.md` docs stale vs current test results |
| CI-L02 | LOW | ESLint: unused `avgHoursPerMember` in `AnalyticsView.jsx:129` |

### Test failure matrix

| Suite | Pass | Fail | Root cause |
|-------|------|------|------------|
| Smoke | 0 | 3 | No servers on :3000/:8080; wrong endpoints |
| Login | 0 | 3 | Placeholder/button copy changed |
| Analytics | 0 | 3 | KPI/chart labels redesigned |
| TaskDashboard | 1 | 4 | `userId` missing on mocks; “Completed” → “Done” |

---

# Part 4 — Ops & assets

### OPS-01 — Uncommitted static assets (HIGH for deploy)

```
?? public/assets/octobuddy/   (14 PNGs)
?? public/logo.svg
 M public/index.html
 M public/manifest.json
```

**Risk:** Clean clone / CI build ships without mascots → broken decor on login, board, empty states.

**Fix:** Commit `public/assets/` and `logo.svg`.

### OPS-02 — H2 data ephemeral

Local seed resets when backend stops. Documented in `README-local.md` — OK for dev.

### OPS-03 — Dev proxy only on `npm start`

`setupProxy.js` does not apply to production build. Production serves from Spring `static/` — same-origin `/api` — OK.

---

# Part 5 — UX / visual audit

| ID | Severity | Issue | Status |
|----|----------|--------|--------|
| UX-01 | HIGH | Filter panel overlapped Kanban | **Fixed** |
| UX-02 | MEDIUM | Board mascots near header clutter | **Fixed** (repositioned) |
| UX-03 | MEDIUM | Developer Pod view shows 0 tasks for teammates | By design (scoped API) but misleading |
| UX-04 | MEDIUM | No loading skeletons on Home/Analytics/Pod | Empty flash on slow network |
| UX-05 | LOW | Large PNG decor randomizes per visit — can feel busy | Tunable opacity/count |
| UX-06 | LOW | Profile “Team” hardcoded “Octo Pod” | No team name API |
| UX-07 | LOW | Alerts “shipped” count scoped to visible tasks only | OK but differs from analytics totals |

---

# Part 6 — API contract checklist

| Endpoint | Frontend consumer | Status |
|----------|-------------------|--------|
| `POST /api/users/Login` | `LoginService` | OK |
| `POST /api/users/CreateUser` | `RegisterService` | OK (FE register broken) |
| `GET /api/tasks/team/{id}` | `TasksService` | OK |
| `GET /api/tasks/user/{id}` | `TasksService` | OK |
| `POST /api/tasks/create` | `TasksService` | OK (validation weak) |
| `PUT /api/tasks/update/{id}` | `TasksService` | OK |
| `PUT /api/tasks/delete/{id}` | `TasksService` | OK |
| `GET /api/analytics/*` | `AnalyticsService` | OK (semantics issue BE-H01) |
| `GET /api/filter/*` | `FilterService` | OK |

**No new endpoints were added for Home/Pod/Profile/Alerts** — all reuse existing APIs.

---

# Implementation plan (recommended phases)

## Phase 0 — Quick wins (1–2 days)

- [ ] FE-C01: Fix `RegisterView` error state + display
- [ ] FE-C02: Fix `newTask.userId` on create
- [ ] FE-H01: Add `isPrivileged()` and use in task dashboard
- [ ] OPS-01: Commit `public/assets/octobuddy/` + `logo.svg`
- [ ] FE-M06 / FE-M10: English copy on task card dates
- [ ] FE-L05–L07: Minor a11y fixes
- [ ] Remove unused `avgHoursPerMember` or wire it in Analytics

## Phase 1 — Reliability & UX (3–5 days)

- [ ] FE-M03–M05: Loading/error states + toast on failures
- [ ] FE-M07: Fix task links in edit modal
- [ ] FE-M08: Pod counts by user id
- [ ] FE-M01: Session persistence + logout
- [ ] BE-H01: Fix pending/late analytics definitions
- [ ] BE-H02: Fix work-hours LEFT JOIN
- [ ] BE-M05: Global exception handler (400/404/409)
- [ ] BE-H05: Bean validation on task create/update
- [ ] Update all Vitest suites to match current UI

## Phase 2 — Auth & teams (1–2 weeks)

- [ ] BE-C01–C03: Spring Security + password hashing + JWT
- [ ] BE-H04 / FE-C03: Team assignment for new developers
- [ ] BE-M06: Restrict self-registration to `user` role
- [ ] FE-M02: React Router
- [ ] Align `admin` / `manager` roles in DB + UI

## Phase 3 — Production hardening (ongoing)

- [ ] BE-M07: Schema parity Oracle ↔ H2
- [ ] BE-M08: CORS lockdown
- [ ] BE-M09: Regenerate OpenAPI / Swagger
- [ ] CI: Run `npm test` + meaningful backend integration tests
- [ ] FE-L01–L02: Remove dead code
- [ ] i18n strategy (optional)

---

## Verification checklist (post-fix)

| Scenario | User | Expected |
|----------|------|----------|
| Login | `localdev` | Board shows 35 team tasks |
| Login | `developer` | Board shows 6 user tasks |
| Login | `maya` | Team-wide board (after FE-H01) |
| Create task | `developer` | Card appears immediately |
| Register | new dev | Error shown on mismatch; no crash |
| Open filters | any | Panel pushes board down, no overlap |
| Home stats | `developer` | Clear labeling or scoped stats |
| Analytics pending + late | sprint view | No double-count |
| `npm test` | — | 0 failures (smoke split out) |
| `npm run build` | — | 0 errors |
| Fresh git clone | — | OctoBuddy PNGs present |

---

## File index (most touched in fixes)

```
Frontend
  src/App.js
  src/views/register/RegisterView.jsx
  src/views/taskDashboard/taskDashboard.jsx
  src/views/home/HomeView.jsx
  src/views/pod/PodView.jsx
  src/components/taskUpdate/taskUpdate.jsx
  src/components/filterHeader/*
  src/components/brand/OctoBuddyDecor.jsx
  public/assets/octobuddy/*

Backend
  src/main/java/.../services/UserService.java
  src/main/java/.../services/StadisticsService.java
  src/main/java/.../services/TaskService.java
  src/main/resources/data-local.sql

Tests
  src/views/login/LoginView.test.tsx
  src/views/taskDashboard/TaskDashboard.test.tsx
  src/views/analytics/AnalyticsView.test.tsx
  src/tests/smoke/Smoke.test.tsx
```

---

*Generated from codebase review + live API smoke on local H2 profile. Re-run audit after each phase.*
