# Codenix RESTful API Requirements

Documento Frontend -> Backend para reemplazar mocks y arrancar el MVP de Codenix.

Estado: MVP contract draft  
Frontend: React + TypeScript + Vite + Tailwind  
Fecha: 2026-06-17

## 1. Objetivo

El frontend actual ya tiene pantallas User y Admin con mock data. Este documento define las APIs REST necesarias para conectar el sistema real sin reestructurar el frontend.

Prioridad del MVP:

1. Auth y sesión.
2. Catálogo de problemas User.
3. Detalle de problema y envío de solución.
4. Historial de submissions.
5. Perfil/progreso/dashboard.
6. Admin Problems CRUD.
7. Admin Testcases CRUD.
8. Publicar/despublicar con validaciones.

## 2. Convenciones generales

Base URL sugerida:

```txt
/api
```

Formato:

```http
Content-Type: application/json
Accept: application/json
```

Autenticación:

```http
Authorization: Bearer <accessToken>
```

Fechas:

```ts
type ISODateString = string // ejemplo: "2026-06-16T22:14:00-05:00"
```

IDs:

```ts
type ID = string
```

Respuesta de error estándar:

```ts
interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}
```

Ejemplo:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Title is required.",
  "details": {
    "field": "title"
  }
}
```

Status codes esperados:

```txt
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

Paginación recomendada:

```ts
interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
```

## 3. Modelos compartidos

### Difficulty

El frontend User usa labels capitalizados y Admin usa valores lowercase. Backend puede devolver lowercase y el adapter frontend normaliza, pero para reducir fricción se recomienda estandarizar en lowercase en API.

```ts
type ProblemDifficulty = "easy" | "medium" | "hard"
```

### Problem status

```ts
type ProblemStatus = "draft" | "published"
```

### User

```ts
interface User {
  id: string
  name: string
  username: string
  email?: string
  avatarUrl: string
  degree: string
  githubUrl: string
  linkedinUrl: string
  memberSince?: string
  role?: "user" | "admin"
}
```

### Public problem list item

```ts
interface ProblemListItem {
  id: string
  numericId?: number
  title: string
  slug: string
  difficulty: ProblemDifficulty
  acceptance: number
  solved: boolean
  topics: string[]
  isLocked?: boolean
  isFavorite?: boolean
}
```

### Problem detail

```ts
interface ProblemExample {
  id: string
  input: string
  output: string
  explanation?: string
}

interface ProblemCodeTemplate {
  language: string
  starterCode: string
}

interface ProblemDetail extends ProblemListItem {
  statement: string
  inputFormat: string
  outputFormat: string
  constraints: string
  examples: ProblemExample[]
  codeTemplates: ProblemCodeTemplate[]
}
```

### Submission

```ts
type SubmissionResult =
  | "Accepted"
  | "Wrong Answer"
  | "Runtime Error"
  | "Time Limit Exceeded"
  | "Compilation Error"
  | "Pending"

interface Submission {
  id: string
  problemId: string
  problemTitle: string
  problemSlug: string
  difficulty: ProblemDifficulty
  result: SubmissionResult
  language: string
  submittedAt: string
  executionTimeMs?: number
  memoryKb?: number
}
```

## 4. Auth API

### POST /api/auth/login

Usado por LoginPage.

Request:

```ts
interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}
```

Response:

```ts
interface AuthSession {
  accessToken: string
  refreshToken?: string
  user: User
}
```

Status:

```txt
200 OK
401 INVALID_CREDENTIALS
422 VALIDATION_ERROR
```

### POST /api/auth/register

Usado por RegisterPage.

Request:

```ts
interface RegisterRequest {
  name: string
  email: string
  password: string
}
```

Response:

```ts
interface AuthSession {
  accessToken: string
  refreshToken?: string
  user: User
}
```

Regla: el frontend puede soportar login automático post-register o redirección a login. Para MVP se recomienda devolver sesión.

### POST /api/auth/logout

Usado por UserMenu.

Response:

```txt
204 No Content
```

### GET /api/auth/me

Sirve para restaurar sesión al refrescar.

Response:

```ts
User
```

### OAuth

Endpoints sugeridos:

```txt
GET /api/auth/github/redirect
GET /api/auth/google/redirect
GET /api/auth/:provider/callback
```

Providers soportados por frontend:

```ts
type OAuthProvider = "github" | "google"
```

## 5. User Problems API

### GET /api/problems

Usado por ProblemsPage.

Query params:

```ts
interface ProblemsQuery {
  search?: string
  difficulty?: "easy" | "medium" | "hard"
  status?: "solved" | "unsolved"
  topic?: string
  sort?: "id-asc" | "acceptance-desc" | "acceptance-asc" | "difficulty-asc"
  page?: number
  pageSize?: number
}
```

Response:

```ts
PaginatedResponse<ProblemListItem>
```

Notas frontend:

- La tabla necesita title, difficulty, acceptance, solved, topics, slug.
- `slug` se usa para navegar a `/problems/:problemSlug`.
- Si el backend usa numeric id, devolver también slug.

### GET /api/problems/topics

Usado para filtros/chips.

Response:

```ts
interface TopicsResponse {
  topics: string[]
}
```

### GET /api/problems/search

Usado por búsqueda global del navbar.

Query:

```txt
?q=two
```

Response:

```ts
interface ProblemSearchResult {
  id: string
  title: string
  slug: string
  difficulty: ProblemDifficulty
}
```

```ts
ProblemSearchResult[]
```

### GET /api/problems/:slug

Usado por ProblemDetailPage / solve page.

Response:

```ts
ProblemDetail
```

## 6. Judge / Solve API

La pantalla de solución actual es MVP ligera, pero el backend debe preparar estos endpoints.

### POST /api/problems/:problemId/submissions

Crea un envío real al judge.

Request:

```ts
interface CreateSubmissionRequest {
  language: "python" | "java" | "cpp" | "typescript" | "javascript"
  sourceCode: string
}
```

Response inicial:

```ts
interface CreateSubmissionResponse {
  submissionId: string
  status: "Pending"
  createdAt: string
}
```

### GET /api/submissions/:submissionId

Consulta resultado final o pending.

Response:

```ts
interface SubmissionDetail extends Submission {
  sourceCode?: string
  testcaseResults?: Array<{
    testcaseId: string
    visibility: "sample" | "hidden"
    passed: boolean
    input?: string
    expectedOutput?: string
    actualOutput?: string
    error?: string
    executionTimeMs?: number
    memoryKb?: number
  }>
}
```

Reglas:

- Sample testcases pueden devolver input/output al usuario.
- Hidden testcases no deben exponer input/output si fallan.

## 7. Submissions API

### GET /api/submissions

Usado por SubmissionsPage y UserRecentSubmissions.

Query params:

```ts
interface SubmissionsQuery {
  userId?: string
  problemId?: string
  result?: SubmissionResult
  difficulty?: ProblemDifficulty
  topic?: string
  sort?: "submitted-desc" | "submitted-asc" | "submissions-desc" | "acceptance-desc"
  limit?: number
  page?: number
  pageSize?: number
}
```

Response:

```ts
PaginatedResponse<Submission>
```

Para la tabla actual se necesitan también:

```ts
interface SubmissionListItem extends Submission {
  submissionsCount: number
  acceptance: number
  topics: string[]
}
```

### GET /api/submissions/topics

Para filtros de submissions.

Response:

```ts
interface SubmissionTopicsResponse {
  topics: string[]
}
```

## 8. User Profile / Dashboard API

### GET /api/users/me

Usado por ProfilePage, AppNavbar y UserMenu.

Response:

```ts
User
```

### GET /api/users/me/stats

Usado por UserProgressPanel y UserTopRanking.

Response:

```ts
interface UserStats {
  problemsSolved: number
  totalProblems: number
  submissionsCount: number
  mostUsedLanguage: string
  currentStreak: number
  rankingPercentile?: number
  rankingPosition?: number
}
```

### GET /api/users/me/progress

Usado por progress por dificultad.

Response:

```ts
interface DifficultyProgress {
  easy: { solved: number; total: number }
  medium: { solved: number; total: number }
  hard: { solved: number; total: number }
}
```

### GET /api/users/me/activity

Usado por ActivityHeatmap.

Query:

```txt
?year=2026
```

Response:

```ts
interface ActivityDay {
  date: string
  count: number
}

interface ActivityResponse {
  year: number
  days: ActivityDay[]
}
```

### GET /api/users/me/recent-submissions

Alternativa simple para el profile.

Query:

```txt
?limit=10
```

Response:

```ts
Submission[]
```

## 9. Admin Problems API

Todos los endpoints admin requieren:

```txt
Authorization: Bearer <adminToken>
```

Si el usuario no es admin:

```txt
403 Forbidden
```

### Admin model

```ts
interface AdminProblem {
  id: string
  title: string
  slug: string
  difficulty: ProblemDifficulty
  tags: string[]
  status: "draft" | "published"
  testcasesCount: number
  updatedAt: string
}

interface AdminProblemFormValues {
  title: string
  slug: string
  difficulty: ProblemDifficulty
  tags: string[]
  statement: string
  inputFormat: string
  outputFormat: string
  constraints: string
  examples: ProblemExample[]
  codeTemplates: ProblemCodeTemplate[]
}

type AdminProblemDetails = AdminProblem & AdminProblemFormValues
```

### GET /api/admin/problems

Usado por `/admin/problems`.

Query params:

```ts
interface AdminProblemsQuery {
  search?: string
  difficulty?: ProblemDifficulty
  status?: "draft" | "published"
  tag?: string
  page?: number
  pageSize?: number
}
```

Response:

```ts
PaginatedResponse<AdminProblem>
```

### GET /api/admin/problems/:id

Usado por edit form y testcases page header.

Response:

```ts
AdminProblemDetails
```

Debe aceptar `id` o `slug` si backend quiere facilitar integración actual:

```txt
/api/admin/problems/two-sum
/api/admin/problems/prob-001
```

### POST /api/admin/problems

Usado por `/admin/problems/new`.

Request:

```ts
AdminProblemFormValues
```

Backend debe crear en draft por defecto:

```ts
status: "draft"
```

Response:

```ts
AdminProblemDetails
```

Validaciones:

- `title` requerido.
- `slug` requerido.
- `slug` único.
- `difficulty` requerido.
- `statement` requerido.
- mínimo 1 example.

Errores:

```txt
409 SLUG_ALREADY_EXISTS
422 VALIDATION_ERROR
```

### PUT /api/admin/problems/:id

Usado por edit problem.

Request:

```ts
AdminProblemFormValues
```

Response:

```ts
AdminProblemDetails
```

Reglas:

- No cambiar automáticamente el status.
- Si un problema published queda inválido por edición, backend puede:
  - rechazar el cambio, o
  - permitirlo y marcarlo draft.
- Para MVP se recomienda no tocar status al editar.

### PATCH /api/admin/problems/:id/publish

Usado por admin list y testcases page.

Response:

```ts
AdminProblem
```

Regla obligatoria:

Un problema solo puede publicarse si tiene al menos:

```txt
1 sample testcase
1 hidden testcase
```

Si no cumple:

```json
{
  "code": "PROBLEM_NOT_PUBLISHABLE",
  "message": "Add at least 1 sample testcase and 1 hidden testcase before publishing."
}
```

### PATCH /api/admin/problems/:id/unpublish

Response:

```ts
AdminProblem
```

Debe marcar:

```ts
status: "draft"
```

### GET /api/admin/problems/tags

Para filtros admin.

Response:

```ts
interface AdminProblemTagsResponse {
  tags: string[]
}
```

## 10. Admin Testcases API

### Testcase model

```ts
type TestcaseVisibility = "sample" | "hidden"

interface AdminTestcase {
  id: string
  problemId: string
  input: string
  expectedOutput: string
  visibility: TestcaseVisibility
  weight?: number
  createdAt: string
  updatedAt: string
}

interface AdminTestcasePayload {
  input: string
  expectedOutput: string
  visibility: TestcaseVisibility
  weight?: number
}
```

### GET /api/admin/problems/:problemId/testcases

Usado por `/admin/problems/:problemId/testcases`.

Response:

```ts
AdminTestcase[]
```

### POST /api/admin/problems/:problemId/testcases

Request:

```ts
AdminTestcasePayload
```

Response:

```ts
AdminTestcase
```

Validaciones:

- `input` requerido.
- `expectedOutput` requerido.
- `visibility` requerido.
- `weight` opcional, número >= 0.

### PUT /api/admin/problems/:problemId/testcases/:testcaseId

Request:

```ts
AdminTestcasePayload
```

Response:

```ts
AdminTestcase
```

### DELETE /api/admin/problems/:problemId/testcases/:testcaseId

Response:

```txt
204 No Content
```

Regla:

Si el problema está published y se elimina un testcase dejando de cumplir la regla mínima, backend debe:

1. Rechazar la eliminación, o
2. Permitirla y despublicar el problema.

Para MVP se recomienda opción 1:

```json
{
  "code": "PUBLISHED_PROBLEM_REQUIRES_TESTCASES",
  "message": "Cannot delete this testcase because the published problem requires at least 1 sample and 1 hidden testcase."
}
```

## 11. Landing / Public content

Actualmente la landing usa contenido estático. No es bloqueante para MVP.

Endpoints opcionales:

```txt
GET /api/public/stats
GET /api/public/preview-problems
GET /api/public/roadmap
```

Prioridad baja.

## 12. Roles y permisos

Roles mínimos:

```ts
type Role = "user" | "admin"
```

Permisos:

| Acción | user | admin |
| --- | --- | --- |
| Ver landing | yes | yes |
| Ver problems published | yes | yes |
| Enviar solución | yes | yes |
| Ver su profile | yes | yes |
| Ver admin console | no | yes |
| Crear/editar problems | no | yes |
| Gestionar testcases | no | yes |
| Publicar/despublicar | no | yes |

## 13. Orden sugerido de implementación backend

### Fase 1: desbloquear frontend principal

1. `POST /api/auth/login`
2. `POST /api/auth/register`
3. `GET /api/auth/me`
4. `GET /api/problems`
5. `GET /api/problems/:slug`
6. `GET /api/submissions`

### Fase 2: dashboard/progreso

1. `GET /api/users/me`
2. `GET /api/users/me/stats`
3. `GET /api/users/me/progress`
4. `GET /api/users/me/activity`
5. `GET /api/users/me/recent-submissions`

### Fase 3: admin MVP

1. `GET /api/admin/problems`
2. `GET /api/admin/problems/:id`
3. `POST /api/admin/problems`
4. `PUT /api/admin/problems/:id`
5. `GET /api/admin/problems/:problemId/testcases`
6. `POST /api/admin/problems/:problemId/testcases`
7. `PUT /api/admin/problems/:problemId/testcases/:testcaseId`
8. `DELETE /api/admin/problems/:problemId/testcases/:testcaseId`
9. `PATCH /api/admin/problems/:id/publish`
10. `PATCH /api/admin/problems/:id/unpublish`

### Fase 4: judge

1. `POST /api/problems/:problemId/submissions`
2. `GET /api/submissions/:submissionId`
3. Worker/judge real.

## 14. Notas de integración frontend

- El frontend hoy usa mocks y services locales. Backend puede implementar REST en paralelo.
- No se requiere GraphQL.
- No se requiere WebSocket para MVP; polling de submission por `GET /api/submissions/:submissionId` basta.
- Si el backend devuelve enums lowercase, frontend puede adaptar User labels.
- Mantener `slug` estable; el frontend lo usa en URLs.
- Los errores deben devolver `message` legible para mostrarlo directamente en UI.
- Admin publish debe validar sample + hidden en backend, no solo en frontend.

## 15. Checklist de aceptación backend

- Login/register devuelven usuario y token.
- Problems page puede listar, buscar y filtrar.
- Problem detail puede cargar por slug.
- Submission history puede listar y filtrar.
- Profile carga usuario, stats, progress, activity y recientes.
- Admin puede crear problem draft.
- Admin puede editar problem.
- Admin puede listar problems con status/testcasesCount.
- Admin puede crear, editar y eliminar testcases.
- Admin no puede publicar sin 1 sample + 1 hidden.
- Errores son JSON consistentes.
- Fechas son ISO strings.
- Endpoints admin rechazan usuario sin rol admin.

