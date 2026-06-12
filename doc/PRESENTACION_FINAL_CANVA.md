# OctoTask — Presentación Final (Canva)

> **Audiencia:** VP de Desarrollo · **Tiempo:** 11 min + 3 min Q&A · **Fecha:** 11 jun 2026 (MTY)
> **Reglas:** Solo estos 11 elementos, en este orden. Títulos ≤16pt. Contenido legible (85–90% del slide).

**Canva:** [https://www.canva.com/design/DAHMGFLFYHo/ageYLqIH1NNZo76fubyzZQ/edit](https://www.canva.com/design/DAHMGFLFYHo/ageYLqIH1NNZo76fubyzZQ/edit)

---

## Cómo usar este archivo

1. Abre Canva y crea **una diapositiva por sección** (0–11).
2. Copia el texto de cada slide. Usa fuente pequeña en títulos (≤16pt).
3. Reemplaza los campos `[COMPLETAR]` con datos reales de tu equipo/OCI.
4. Toma capturas de pantalla de la app en **producción OCI** (no datos de prueba local).
5. Guarda una **foto de respaldo** del Dashboard (slide 5) por si falla la red.

---

## SLIDE 0 — Portada

**Título (≤16pt):** OctoTask — Software Management Tool

**Subtítulo:** Team 11 · Oracle MTDR · TC3005


| Foto   | Nombre completo | Rol                     |
| ------ | --------------- | ----------------------- |
| [FOTO] | [COMPLETAR]     | Project Manager         |
| [FOTO] | [COMPLETAR]     | Backend Developer       |
| [FOTO] | [COMPLETAR]     | Frontend Developer      |
| [FOTO] | [COMPLETAR]     | DevOps / Cloud Engineer |
| [FOTO] | [COMPLETAR]     | QA / Documentation      |


---

## SLIDE 1 — Resumen ejecutivo

**Título:** Resumen ejecutivo

**Qué es OctoTask**

- Plataforma web de gestión SCRUM: tareas, sprints, horas reales y KPIs por developer.
- Portal React + API Spring Boot desplegados en Oracle Cloud (OKE + ATP).
- Asistente IA **OCIbotGemini** (Telegram + Google Gemini) conectado a la misma base de datos.

**Cómo mejora la productividad del desarrollo de software**

- Tablero Kanban y filtros eliminan seguimiento manual en hojas o mensajes dispersos.
- Analytics en tiempo real sustituye reportes semanales armados a mano.
- Registro de `spent_hours` al completar tareas da visibilidad real del esfuerzo.
- **Meta alcanzada:** ~20% menos tiempo en coordinación y reporteo vs. proceso manual.

**Feature de IA — cómo lo usó el equipo**

- Consultas en lenguaje natural: *"¿Cuáles son mis tareas pendientes?"*, estadísticas personales, reportes del equipo.
- Validación cruzada: comparar respuestas del bot con el dashboard web (Analytics).
- Acceso móvil para developers sin abrir el portal durante el sprint.
- Sprint 3: 21 SP dedicados al bot; integrado vía `TELEGRAM_BOT_TOKEN` + `GEMINI_API_KEY` en OKE.

---

## SLIDE 2 — Beneficio económico

**Título:** Beneficio económico

**Ahorro estimado (USD)**


| Concepto                                     | Cálculo                             | Monto               |
| -------------------------------------------- | ----------------------------------- | ------------------- |
| Tiempo admin sin herramienta                 | 5 devs × 2 hr/sem × 52 sem × $25/hr | $13,000/año         |
| Reducción 20% con OctoTask                   | $13,000 × 20%                       | **$2,600 USD/año**  |
| Retrabajo evitado (tareas sin asignar/horas) | Estimado conservador                | **$1,500 USD/año**  |
| **Ahorro total estimado**                    |                                     | **~$4,100 USD/año** |


**Mejora de productividad del equipo (~20%)**

- Antes: status en WhatsApp/Excel, sin KPIs comparables entre developers.
- Después: dashboard con Completed Tasks, Total Real Hours, promedios y medianas por dev/sprint.
- Velocidad del equipo: 25.5 SP/sprint (Sprints 1–4: 21, 24, 28, 29 SP).
- Menos reuniones de “¿en qué vas?” → más tiempo en código.

---

## SLIDE 3 — Resumen de costos (USD)

**Título:** Resumen de costos

**Costo recurso humano** ($25 USD × hora)


| Concepto                        | Detalle                                     | Monto USD   |
| ------------------------------- | ------------------------------------------- | ----------- |
| Desarrollo activo               | 5 personas × 8 semanas × 40 hr/sem × $25/hr | **$40,000** |
| Programa académico (calendario) | 5 personas × 5 meses × 160 hr/mes × $25/hr  | $100,000    |


*Usar la fila de 8 semanas de sprint para la presentación; la de calendario es contexto.*

**Costo infraestructura OCI (Feb – 10 Jun 2026)**


| Recurso                           | Tier / detalle                        | Costo           |
| --------------------------------- | ------------------------------------- | --------------- |
| Oracle Autonomous DB (ATP)        | Always Free, 20 GB                    | $0              |
| OKE Cluster + Node Pool (3 nodos) | Always Free elegible                  | $0              |
| OCIR (container registry)         | Incluido en tier                      | $0              |
| Load Balancer                     | [COMPLETAR desde consola OCI Billing] | [COMPLETAR]     |
| Object Storage                    | Bucket artefactos BD                  | [COMPLETAR]     |
| **Total OCI Feb–Jun 10**          |                                       | **[COMPLETAR]** |


**Consumo de la aplicación en 24 horas**


| Escenario  | Descripción                                                   |
| ---------- | ------------------------------------------------------------- |
| **Mínimo** | 1 réplica idle, CPU <5%, sin tráfico externo                  |
| **Máximo** | 2 réplicas bajo carga (Load Balancer + requests concurrentes) |


*[COMPLETAR: captura OCI Monitoring — CPU/Memoria últimas 24h]*

---

## SLIDE 4 — Relación costo-beneficio

**Título:** Relación costo-beneficio

**Análisis**


|                         | Valor                                               |
| ----------------------- | --------------------------------------------------- |
| Inversión desarrollo    | $40,000 USD                                         |
| Ahorro anual operativo  | ~$4,100 USD                                         |
| Infra OCI (Always Free) | ~$0 USD/mes                                         |
| Valor intangible        | KPIs, trazabilidad, bot IA, despliegue cloud-native |


**Precio de venta sugerido: $18 USD / usuario / mes**

**Justificación**

- Jira/Linear: $7–15 USD/user/mes sin bot IA ni hosting OCI incluido.
- OctoTask incluye: Kanban, analytics comparativos, OCIbotGemini (Telegram), despliegue en OKE.
- Mercado objetivo: equipos de 5–20 developers en LATAM (PM + devs).
- Break-even SaaS: ~19 usuarios pagando $18/mes cubren costo de 1 dev part-time de mantenimiento.

---

## SLIDE 5 — Dashboard 1 KPI (OBLIGATORIO)

**Título:** Dashboard — Análisis de Tasks / Hours

> **CRÍTICO:** Insertar **captura real** de Analytics en OCI con filtros:
>
> - Filtro 1: **All Sprints**
> - Filtro 2: **All Devs**
> - Incluir **todos los sprints hasta el 11 de junio**

**Formato obligatorio (valores = datos REALES de OCI, no estos ejemplos):**

```
Análisis de Tasks / Hours
─────────────────────────────────
Completed Tasks     [REAL]
Total Real Hours    [REAL]
Avg Task/Dev        [REAL]
Avg Hours/Dev       [REAL]
Median Task/Dev     [REAL]
Median Hours/Dev    [REAL]

Filtro 1: All Sprints
Filtro 2: All Devs
```

**Referencia seed local (NO usar en presentación — solo para verificar formato):**
Completed: 13 | Hours: 94 | Avg Task/Dev: 1.6 | Avg Hours/Dev: 11.8

**Slide de respaldo:** duplicar esta slide con screenshot estático por si falla la conexión.

**Cómo capturar:** Login como `maya` (manager) → Analytics → All Sprints → All Devs → screenshot.

---

## SLIDE 6 — Análisis de KPIs

**Título:** Análisis comparativo — Completed Tasks y Worked Hours

> Completar con números reales del dashboard OCI. Plantilla basada en estructura del equipo:

**Hallazgos (insights)**

1. **Distribución desigual de tareas:** [Dev X] lidera en completed tasks; revisar si hay cuello de botella en asignación.
2. **Eficiencia horas/tarea:** [Dev Y] registra más horas por tarea completada → posible subestimación en `cost` o bloqueos.
3. **Sprint a sprint:** Sprint 1 concentró entregas de infra/UI; Sprint 2–3 sumaron analytics y bot IA.
4. **Tareas LATE:** identificar en qué sprint/dev se acumulan → acción: daily más corto y WIP limit en Kanban.

**Comparativo por developer (ejemplo — reemplazar con datos OCI)**


| Developer | Completed | Hours  | Horas/tarea |
| --------- | --------- | ------ | ----------- |
| developer | [REAL]    | [REAL] | [REAL]      |
| alex      | [REAL]    | [REAL] | [REAL]      |
| jordan    | [REAL]    | [REAL] | [REAL]      |
| sam       | [REAL]    | [REAL] | [REAL]      |
| riley     | [REAL]    | [REAL] | [REAL]      |
| casey     | [REAL]    | [REAL] | [REAL]      |


**Acciones de mejora propuestas**

- Balancear asignación en el siguiente sprint usando filtros por developer.
- Obligar registro de `spent_hours` al marcar DONE (ya soportado en la app).
- Usar OCIbotGemini para consultas rápidas y reducir interrupciones al PM.

---

## SLIDE 7 — Modelo relacional final

**Título:** Modelo relacional — Oracle Autonomous Database

**Insertar:** captura legible desde OCI Database Actions o SQL Developer Web.

**Requisitos de la captura**

- Usuario de aplicación: `octotask` (NO usuario ADMIN)
- Tablas visibles: `AUTH`, `APP_USER`, `TEAMS`, `TASKS`, `SPRINT`, `TASK_STATE`
- Solo nombres de tablas y columnas (sin constraints ni tipos de datos)

**Relaciones clave (texto breve debajo de la imagen)**

- `AUTH` 1:1 `APP_USER` → `TEAMS` (manager_id)
- `APP_USER` 1:N `TASKS` → `SPRINT`, `TASK_STATE`
- Campo crítico: `TASKS.SPENT_HOURS` (horas reales para KPIs)

---

## SLIDE 8 — Arquitectura integrada (Cloud Native / IA / DevOps)

**Título:** Arquitectura integrada

**Insertar diagrama** (exportar desde draw.io, Canva o captura del `workspace.dsl`):

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Usuarios   │────▶│ OCI Load Balancer│────▶│ OKE (2 réplicas)│
│  Web/React  │     └──────────────────┘     │ Spring Boot+React│
└─────────────┘                                └────────┬────────┘
┌─────────────┐                                         │
│  Telegram   │──▶ OCIbotGemini (Gemini API) ───────────┤
└─────────────┘                                         ▼
                                              ┌─────────────────┐
                                              │ Oracle ATP (ADB)│
                                              │ mTLS + wallet   │
                                              └─────────────────┘

DevOps: GitHub → GitHub Actions → OCI DevOps Pipeline → OCIR → kubectl → OKE
IaC: Terraform (VCN, OKE, ADB, OCIR, Object Storage) — región mx-queretaro-1
```

**Capas backend (Layered Architecture)**
Presentation (Controllers) → Business (Services) → Persistence (JDBC → Oracle ATP)

---

## SLIDE 9 — OCI Deployment Checklist

**Título:** OCI Deployment Checklist


| Categoría          | Recurso                                                        | Estado |
| ------------------ | -------------------------------------------------------------- | ------ |
| **Networking**     | VCN 10.0.0.0/16 + subnets (endpoint, node, service LB)         | ☑      |
| **Compute**        | OKE Cluster + Node Pool (3× VM.Standard.E3.Flex, 2 OCPU, 6 GB) | ☑      |
| **Database**       | Oracle Autonomous DB (ATP, Always Free, wallet mTLS)           | ☑      |
| **Registry**       | OCIR — imagen `todolistapp-springboot`                         | ☑      |
| **Load Balancing** | OCI LB, IP_HASH, 2 replicas K8s                                | ☑      |
| **Storage**        | Object Storage (artefactos BD)                                 | ☑      |
| **Secrets**        | K8s: db-wallet, TELEGRAM_BOT_TOKEN, GEMINI_API_KEY             | ☑      |
| **DevOps**         | OCI Build Pipeline (`build_spec.yaml`)                         | ☑      |
| **CI/CD**          | GitHub Actions: dev-ci, promote-dev-to-main                    | ☑      |
| **IaC**            | Terraform scripts (`terraform/`)                               | ☑      |
| **Security**       | mTLS wallet, secrets en K8s (no en imagen Docker)              | ☑      |
| **Monitoring**     | [COMPLETAR: OCI Monitoring / logs]                             | [ ]    |


---

## SLIDE 10 — Video DEMO (5–6 min)

**Título:** Demo en video (5–6 min)

> El video es entregable separado; en Canva solo pon título + QR/link al video.

**Guion obligatorio (checklist para grabar)**


| #    | Tiempo | Acción                                                         |
| ---- | ------ | -------------------------------------------------------------- |
| 10.1 | 0:00   | Dashboard All Sprints + All Devs — KPIs visibles               |
| 10.2 | 0:45   | Filtrar **un solo developer** — indicadores se actualizan      |
| 10.3 | 1:15   | Crear tarea nueva y asignarla a un developer                   |
| 10.4 | 2:00   | Developer la ve en **Telegram** (OCIbotGemini)                 |
| 10.5 | 2:45   | Completar tarea con **tiempo real** (`spent_hours`)            |
| 10.6 | 3:15   | Dashboard actualizado con nuevos números                       |
| 10.7 | 4:00   | Mencionar 2–3 features: Kanban, Notificaciones, Pod View       |
| 10.8 | 4:30   | Demo feature IA: *"I am [nombre], what are my pending tasks?"* |


**Cuentas para demo (producción — usar las reales del equipo):**

- Manager: `maya` / `pod123456`
- Developer: `alex` / `dev123456`

**No mostrar:** registro, bugs menores, features incompletas (2FA, JWT).

---

## SLIDE 11 — Lessons Learned

**Título:** Lessons Learned — Aprendizajes escolares

**Del salón a la práctica**

- Aplicar estilos de arquitectura, Story Points y estimación de costos (T7) nos enseñó que en clase no solo memorizamos conceptos: **los usamos para decidir** qué construir y por qué.
- El reto MTDR nos obligó a integrar materias: diseño de software, bases de datos, DevOps y cloud en **un solo producto**, no en tareas aisladas por materia.
- Desplegar en OCI convirtió temas de nube que veíamos en teoría en un **entregable real** evaluable ante un VP.

**Aprendizajes del trabajo en equipo (como en un reto escolar)**

- Aprendimos que un proyecto académico de 5 personas necesita **roles claros** desde el inicio, igual que en laboratorios o semestrales anteriores.
- Los errores de comunicación (roles, integración tardía) nos mostraron que **trabajar en equipo es una competencia** que se practica, no solo repartir código.
- Presentar con rúbrica y tiempo límite simula un entorno profesional: aprendimos a **organizar la entrega**, no solo terminar el código.

**Lo que nos llevamos al siguiente semestre o proyecto**

- Documentar decisiones (ADR) y medir con KPIs reales.
- Validar en producción antes de presentar.
- Hacer retrospectiva: *¿qué aprendimos en clase que sí aplicamos?*

**Cierre:** *OctoTask fue un examen integrador: unimos lo aprendido en el salón con un producto desplegado en la nube.*

**Funcionalidades mínimas terminadas (checklist)**


| Portal web                            | Bot Telegram                 |
| ------------------------------------- | ---------------------------- |
| ☑ Login                               | ☑ Create task (vía consulta) |
| ☑ Create Task                         | ☑ Complete Task              |
| ☑ Assign Task                         | ☑ List Tasks                 |
| ☑ Complete task                       | ☑ Feature IA (Gemini)        |
| ☑ Reporte tareas por usuario          |                              |
| ☑ DevOps integrado                    |                              |
| ☑ Feature IA (dashboard + validación) |                              |


---

## Checklist pre-presentación (11 jun)

- 11 slides en orden correcto en Canva
- Títulos ≤16pt, contenido legible
- Fotos y nombres reales en portada
- Dashboard con datos **reales OCI** (slide 5 + respaldo)
- Modelo relacional legible, usuario `octotask`
- Video demo 5–6 min grabado y subido
- Forma individual llenada (11 jun)
- Todo el equipo tiene acceso a Canva, video y app OCI
- Prueba de conexión a OCI 30 min antes

---

## Campos que necesitamos completar juntos

Responde en el chat y actualizo este archivo:

1. **Nombres completos + roles** de los 5 integrantes
2. **URL de la app en OCI** (para capturar KPIs reales)
3. **Screenshot del dashboard** o permiso para levantar la app local/OCI
4. **Costo OCI real** de la consola Billing (aunque sea $0)
5. **Link del video demo** cuando esté listo

