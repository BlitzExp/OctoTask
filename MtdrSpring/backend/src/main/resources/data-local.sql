-- =============================================================================
-- OctoBuddy local mock — full pod for UI / analytics / kanban testing
-- All passwords are plaintext (local H2 only). Data resets when backend stops.
-- =============================================================================
--
-- Manager / admin
--   localdev     / localdev123     local@octotask.dev
--   maya         / pod123456       maya@octotask.dev
--
-- Developers (password for all: dev123456)
--   developer    dev@octotask.dev
--   alex         alex@octotask.dev
--   jordan       jordan@octotask.dev
--   sam          sam@octotask.dev
--   riley        riley@octotask.dev
--   casey        casey@octotask.dev
-- =============================================================================

-- Auth
INSERT INTO AUTH (ID, EMAIL, PASSWORD) VALUES (1, 'local@octotask.dev', 'localdev123');
INSERT INTO AUTH (ID, EMAIL, PASSWORD) VALUES (2, 'dev@octotask.dev', 'dev123456');
INSERT INTO AUTH (ID, EMAIL, PASSWORD) VALUES (3, 'maya@octotask.dev', 'pod123456');
INSERT INTO AUTH (ID, EMAIL, PASSWORD) VALUES (4, 'alex@octotask.dev', 'dev123456');
INSERT INTO AUTH (ID, EMAIL, PASSWORD) VALUES (5, 'jordan@octotask.dev', 'dev123456');
INSERT INTO AUTH (ID, EMAIL, PASSWORD) VALUES (6, 'sam@octotask.dev', 'dev123456');
INSERT INTO AUTH (ID, EMAIL, PASSWORD) VALUES (7, 'riley@octotask.dev', 'dev123456');
INSERT INTO AUTH (ID, EMAIL, PASSWORD) VALUES (8, 'casey@octotask.dev', 'dev123456');

-- Team
INSERT INTO TEAMS (ID, NAME, MANAGER_ID) VALUES (1, 'Octo Pod', 3);

-- Pod members
INSERT INTO APP_USER (ID, NAME, ROLE, TEAM_ID) VALUES (1, 'localdev', 'admin', 1);
INSERT INTO APP_USER (ID, NAME, ROLE, TEAM_ID) VALUES (2, 'developer', 'user', 1);
INSERT INTO APP_USER (ID, NAME, ROLE, TEAM_ID) VALUES (3, 'maya', 'manager', 1);
INSERT INTO APP_USER (ID, NAME, ROLE, TEAM_ID) VALUES (4, 'alex', 'user', 1);
INSERT INTO APP_USER (ID, NAME, ROLE, TEAM_ID) VALUES (5, 'jordan', 'user', 1);
INSERT INTO APP_USER (ID, NAME, ROLE, TEAM_ID) VALUES (6, 'sam', 'user', 1);
INSERT INTO APP_USER (ID, NAME, ROLE, TEAM_ID) VALUES (7, 'riley', 'user', 1);
INSERT INTO APP_USER (ID, NAME, ROLE, TEAM_ID) VALUES (8, 'casey', 'user', 1);

-- Task states
INSERT INTO TASK_STATE (ID, NAME) VALUES (1, 'DONE');
INSERT INTO TASK_STATE (ID, NAME) VALUES (2, 'PENDING');
INSERT INTO TASK_STATE (ID, NAME) VALUES (3, 'ON GOING');
INSERT INTO TASK_STATE (ID, NAME) VALUES (4, 'LATE');

-- Sprints: 1 = past, 2 = current, 3 = upcoming
INSERT INTO SPRINT (ID, TEAM_ID, SPRINT_NUM, END_DATE)
VALUES (1, 1, 1, DATEADD('DAY', -7, CURRENT_TIMESTAMP));

INSERT INTO SPRINT (ID, TEAM_ID, SPRINT_NUM, END_DATE)
VALUES (2, 1, 2, DATEADD('DAY', 10, CURRENT_TIMESTAMP));

INSERT INTO SPRINT (ID, TEAM_ID, SPRINT_NUM, END_DATE)
VALUES (3, 1, 3, DATEADD('DAY', 24, CURRENT_TIMESTAMP));

-- Tasks — sprint 1 (mostly shipped)
INSERT INTO TASKS (USER_ID, NAME, DESCRIPTION, SPRINT_ID, STATE_ID, PRIORITY_ID, LINK_TO_FILE, COST, SPENT_HOURS, VISIBILITY, VISIBLE, CREATED_AT, UPDATED_AT) VALUES
(2, 'Auth split panel', 'Dark brand panel + light form for login', 1, 1, 2, 'https://github.com/octopod/frontend/pull/12', 8, 9, 1, 1, DATEADD('DAY', -28, CURRENT_TIMESTAMP), DATEADD('DAY', -20, CURRENT_TIMESTAMP)),
(4, 'Tokenize CSS variables', 'Move hard-coded colors into theme tokens', 1, 1, 2, NULL, 6, 7, 1, 1, DATEADD('DAY', -27, CURRENT_TIMESTAMP), DATEADD('DAY', -19, CURRENT_TIMESTAMP)),
(5, 'Kanban column headers', 'Status colors and counts on board', 1, 1, 1, NULL, 4, 4, 1, 1, DATEADD('DAY', -26, CURRENT_TIMESTAMP), DATEADD('DAY', -18, CURRENT_TIMESTAMP)),
(6, 'Task card hover states', 'Lift + shadow on drag/hover', 1, 1, 2, NULL, 5, 5, 1, 1, DATEADD('DAY', -25, CURRENT_TIMESTAMP), DATEADD('DAY', -17, CURRENT_TIMESTAMP)),
(1, 'Sprint 1 retro notes', 'Document wins and blockers for the pod', 1, 1, 1, NULL, 2, 2, 1, 1, DATEADD('DAY', -24, CURRENT_TIMESTAMP), DATEADD('DAY', -16, CURRENT_TIMESTAMP)),
(7, 'Analytics bar charts', 'Wire recharts to sprint endpoints', 1, 1, 3, NULL, 10, 11, 1, 1, DATEADD('DAY', -23, CURRENT_TIMESTAMP), DATEADD('DAY', -15, CURRENT_TIMESTAMP)),
(8, 'Empty state illustrations', 'OctoBuddy mascot on stub pages', 1, 1, 2, NULL, 6, 6, 1, 1, DATEADD('DAY', -22, CURRENT_TIMESTAMP), DATEADD('DAY', -14, CURRENT_TIMESTAMP)),
(3, 'Filter service tests', 'Cover sprint + member filter APIs', 1, 1, 2, NULL, 8, 8, 1, 1, DATEADD('DAY', -21, CURRENT_TIMESTAMP), DATEADD('DAY', -13, CURRENT_TIMESTAMP)),
(2, 'Proxy port fix', 'Point CRA proxy to 8080', 1, 1, 3, NULL, 3, 3, 1, 1, DATEADD('DAY', -20, CURRENT_TIMESTAMP), DATEADD('DAY', -12, CURRENT_TIMESTAMP)),
(4, 'Late task notifications', 'Placeholder alerts view copy', 1, 4, 2, NULL, 4, 2, 1, 1, DATEADD('DAY', -19, CURRENT_TIMESTAMP), DATEADD('DAY', -8, CURRENT_TIMESTAMP));

-- Tasks — sprint 2 (active board — mix of all columns)
INSERT INTO TASKS (USER_ID, NAME, DESCRIPTION, SPRINT_ID, STATE_ID, PRIORITY_ID, LINK_TO_FILE, COST, SPENT_HOURS, VISIBILITY, VISIBLE, CREATED_AT, UPDATED_AT) VALUES
(1, 'Set up CI pipeline', 'Configure build and deploy for the team repo', 2, 2, 2, NULL, 8, 0, 1, 1, DATEADD('DAY', -10, CURRENT_TIMESTAMP), DATEADD('DAY', -2, CURRENT_TIMESTAMP)),
(1, 'Review sprint backlog', 'Groom stories for sprint 2', 2, 3, 2, NULL, 4, 2, 1, 1, DATEADD('DAY', -9, CURRENT_TIMESTAMP), DATEADD('DAY', -1, CURRENT_TIMESTAMP)),
(1, 'Overdue design review', 'Blocked on stakeholder feedback', 2, 4, 3, NULL, 3, 1, 1, 1, DATEADD('DAY', -14, CURRENT_TIMESTAMP), DATEADD('DAY', -3, CURRENT_TIMESTAMP)),
(2, 'Fix login styling', 'Polish auth split panel and form card', 2, 2, 3, NULL, 6, 0, 1, 1, DATEADD('DAY', -8, CURRENT_TIMESTAMP), DATEADD('DAY', -1, CURRENT_TIMESTAMP)),
(2, 'API integration tests', 'Cover task CRUD endpoints', 2, 1, 2, 'https://github.com/octopod/backend/pull/44', 10, 10, 1, 1, DATEADD('DAY', -12, CURRENT_TIMESTAMP), DATEADD('DAY', -4, CURRENT_TIMESTAMP)),
(2, 'Drag-and-drop polish', 'Column highlight + toast on move', 2, 3, 2, NULL, 5, 3, 1, 1, DATEADD('DAY', -7, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP),
(3, 'Pod capacity planning', 'Balance workload across developers', 2, 3, 2, NULL, 4, 1, 1, 1, DATEADD('DAY', -6, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP),
(3, 'Manager dashboard KPIs', 'Validate analytics against seed data', 2, 2, 1, NULL, 6, 0, 1, 1, DATEADD('DAY', -5, CURRENT_TIMESTAMP), DATEADD('DAY', -1, CURRENT_TIMESTAMP)),
(4, 'Sidebar user chip', 'Avatar + role in shell rail', 2, 1, 2, NULL, 4, 4, 1, 1, DATEADD('DAY', -11, CURRENT_TIMESTAMP), DATEADD('DAY', -5, CURRENT_TIMESTAMP)),
(4, 'Edit task modal redesign', 'Two-panel layout for task update', 2, 3, 2, NULL, 8, 4, 1, 1, DATEADD('DAY', -4, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP),
(5, 'Performance score chart', 'KPI grades per member', 2, 2, 2, NULL, 6, 0, 1, 1, DATEADD('DAY', -8, CURRENT_TIMESTAMP), DATEADD('DAY', -2, CURRENT_TIMESTAMP)),
(5, 'Mobile rail collapse', 'Icon-only nav under 900px', 2, 3, 1, NULL, 5, 2, 1, 1, DATEADD('DAY', -3, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP),
(6, 'Developer filter analytics', 'Client-side member filter on charts', 2, 1, 2, NULL, 5, 5, 1, 1, DATEADD('DAY', -9, CURRENT_TIMESTAMP), DATEADD('DAY', -4, CURRENT_TIMESTAMP)),
(6, 'Chart card headers', 'Sprint badge + gradient head', 2, 2, 1, NULL, 4, 0, 1, 1, DATEADD('DAY', -2, CURRENT_TIMESTAMP), DATEADD('DAY', -1, CURRENT_TIMESTAMP)),
(7, 'H2 local seed expansion', 'Full mock pod for demos', 2, 3, 3, NULL, 6, 2, 1, 1, DATEADD('DAY', -1, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP),
(7, 'README local credentials', 'Document all test accounts', 2, 2, 1, NULL, 2, 0, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'PWA manifest titles', 'OctoBuddy branding in manifest', 2, 1, 1, NULL, 2, 2, 1, 1, DATEADD('DAY', -6, CURRENT_TIMESTAMP), DATEADD('DAY', -3, CURRENT_TIMESTAMP)),
(8, 'Notification empty state', 'Mascot copy for alerts tab', 2, 4, 2, NULL, 3, 1, 1, 1, DATEADD('DAY', -5, CURRENT_TIMESTAMP), DATEADD('DAY', -2, CURRENT_TIMESTAMP));

-- Tasks — sprint 3 (upcoming — mostly backlog)
INSERT INTO TASKS (USER_ID, NAME, DESCRIPTION, SPRINT_ID, STATE_ID, PRIORITY_ID, LINK_TO_FILE, COST, SPENT_HOURS, VISIBILITY, VISIBLE, CREATED_AT, UPDATED_AT) VALUES
(1, 'Dark mode exploration', 'Optional app-light / app-dark toggle', 3, 2, 2, NULL, 12, 0, 1, 1, DATEADD('DAY', -3, CURRENT_TIMESTAMP), DATEADD('DAY', -1, CURRENT_TIMESTAMP)),
(2, 'Onboarding tour', 'First-run tooltips with OctoBuddy voice', 3, 2, 2, NULL, 8, 0, 1, 1, DATEADD('DAY', -2, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP),
(4, 'Team page v1', 'Roster view for pod members', 3, 2, 1, NULL, 10, 0, 1, 1, DATEADD('DAY', -2, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP),
(5, 'Profile settings', 'User preferences and avatar', 3, 2, 1, NULL, 6, 0, 1, 1, DATEADD('DAY', -1, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP),
(6, 'Real-time activity feed', 'Populate recent activity from task events', 3, 2, 3, NULL, 14, 0, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Export sprint report', 'PDF summary of analytics KPIs', 3, 2, 2, NULL, 8, 0, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Custom octopus illustrations', 'SVG expressions for empty states', 3, 2, 2, NULL, 6, 0, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

ALTER TABLE AUTH ALTER COLUMN ID RESTART WITH 9;
ALTER TABLE TEAMS ALTER COLUMN ID RESTART WITH 2;
ALTER TABLE SPRINT ALTER COLUMN ID RESTART WITH 4;
ALTER TABLE TASKS ALTER COLUMN ID RESTART WITH 36;
