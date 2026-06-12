# Backend Local Run Guide

## Quick start (no Oracle) — `local` profile

Uses in-memory H2 with a seeded **Octo Pod** team. Best for UI work on your machine.

```bash
cd MtdrSpring/backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

Backend: **http://localhost:8080**  
Frontend (separate terminal): `cd src/main/frontend && npm start` → **http://localhost:3000** (or **3001** if 3000 is taken)

### Seeded team — Octo Pod

| Role | Username | Email | Password |
|------|----------|-------|----------|
| Admin | `localdev` | `local@octotask.dev` | `localdev123` |
| Manager | `maya` | `maya@octotask.dev` | `pod123456` |
| Developer | `developer` | `dev@octotask.dev` | `dev123456` |
| Developer | `alex` | `alex@octotask.dev` | `dev123456` |
| Developer | `jordan` | `jordan@octotask.dev` | `dev123456` |
| Developer | `sam` | `sam@octotask.dev` | `dev123456` |
| Developer | `riley` | `riley@octotask.dev` | `dev123456` |
| Developer | `casey` | `casey@octotask.dev` | `dev123456` |

Sign in with **username or email** and the password above.

### Mock data snapshot

- **3 sprints** — sprint 1 (past), sprint 2 (current), sprint 3 (upcoming)
- **35 tasks** across all kanban columns and assignees
- **Analytics** — use sprint **2** or **All Sprints**; filter by developer as `localdev` or `maya`

Data resets when the backend stops (in-memory H2).

---

## Oracle setup (production-like)

This backend uses Oracle DB (wallet/TNS) and can run locally with either:

- Environment variables (`db_url`, `db_user`, `dbpassword`, `driver_class_name`)
- Spring properties (`spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`)

Telegram bot startup is disabled by default (`telegram.bot.enabled=false`) for local development.

## 1) Prerequisites

- Java installed (JDK 17+ recommended)
- Node/npm available (frontend is built during Maven lifecycle)
- Oracle wallet files available under `wallet/Wallet_MGQBA7APPQLIZL1D`

## 2) Open backend folder

```powershell
Set-Location "MtdrSpring/backend"
```

## 3) Set runtime variables (PowerShell)

Use your real DB password. Keep `TNS_ADMIN` pointing to the wallet directory.

```powershell
$env:TNS_ADMIN = "$PWD\wallet\Wallet_MGQBA7APPQLIZL1D"
$env:db_url = "jdbc:oracle:thin:@mgqba7appqlizl1d_tp"
$env:db_user = "octotask"
$env:dbpassword = "<your_db_password>"
$env:driver_class_name = "oracle.jdbc.OracleDriver"
```

Alternative: put values in `src/main/resources/application.properties` using:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`

## 4) Build frontend once (if needed)

```powershell
Set-Location "src/main/frontend"
npm install
npm run build
Set-Location "../.."
```

## 5) Run backend

```powershell
.\mvnw spring-boot:run
```

Backend starts on port `8080`.

## 6) Optional: enable Telegram bot

If you want Telegram integration locally:

```powershell
$env:TELEGRAM_BOT_ENABLED = "true"
$env:TELEGRAM_BOT_TOKEN = "<real_telegram_token>"
$env:TELEGRAM_BOT_NAME = "<bot_name>"
```

Without valid Telegram credentials, startup will fail with a 401 from Telegram API when bot is enabled.

## 7) Local Docker test

Build the image from the backend folder:

```bash
cd MtdrSpring/backend
docker build -t todolistapp-springboot:local .
cp .env.example .env
```

Manually edit `.env` with real local values before running the container.

```bash
docker run --rm \
  --env-file .env \
  -v "$PWD/wallet:/mtdrworkshop/creds:ro" \
  -p 8080:8080 \
  todolistapp-springboot:local
```

`docker build` should not need secrets because the image is compiled without environment-specific runtime configuration. `docker run` receives secrets through `--env-file`, and the Oracle wallet is mounted at runtime as read-only under `/mtdrworkshop/creds`. This keeps the image generic and reusable across local, test, and deployment environments.

## Troubleshooting

- `ORA-17067 Invalid Oracle URL`: check `db_url` format and wallet path in `TNS_ADMIN`.
- `Missing required database setting ...`: set missing `db_*` env vars or `spring.datasource.*` properties.
- Telegram token errors: keep `telegram.bot.enabled=false` unless you are using a real bot token.
