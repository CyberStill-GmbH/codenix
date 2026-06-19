# Codenix Frontend API Integration

## Base de API

El frontend usa el cliente centralizado `apiRequest` en `src/shared/api/apiClient.ts`.
La URL base se configura con:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Autenticacion: JWT por header `Authorization: Bearer <accessToken>`.
El backend tiene CORS con `origin: FRONTEND_URL` y `credentials: true`, pero el contrato actual no usa cookie httpOnly para sesion.

## Auditoria backend vs frontend

| Endpoint backend | Auth | Request | Response principal | Estado frontend |
| --- | --- | --- | --- | --- |
| `GET /api/health` | No | - | `{ status: "ok" }` | No usado por UI |
| `POST /api/auth/register` | No | `{ name, email, password }` | `{ accessToken, user }` | Integrado |
| `POST /api/auth/login` | No | `{ email, password, remember? }` | `{ accessToken, user }` | Integrado |
| `GET /api/auth/me` | Si | - | `AuthUser` | Integrado |
| `POST /api/auth/logout` | Si | - | `204` | Integrado |
| `GET /api/auth/google/redirect` | No | `returnTo?` | Redirect OAuth | Integrado |
| `GET /api/auth/github/redirect` | No | `returnTo?` | Redirect OAuth | Integrado |
| `GET /api/auth/google/callback` | No | `code/state/error?` | Redirect frontend callback | Integrado |
| `GET /api/auth/github/callback` | No | `code/state/error?` | Redirect frontend callback | Integrado |
| `POST /api/auth/forgot-password` | No | `{ email }` | `204` | Integrado |
| `POST /api/auth/reset-password` | No | `{ token, newPassword }` | `204` | Integrado |
| `GET /api/problems` | No | `search?, difficulty?, topic?, page?, pageSize?, sort?` | `{ data, meta }` | Integrado |
| `GET /api/problems/search` | No | `q, limit?` | `{ data: ProblemSearchItem[] }` | Integrado en navbar |
| `GET /api/problems/topics` | No | - | `{ data: Topic[] }` | Integrado |
| `GET /api/problems/:slug` | No | `slug` | `ProblemDetail` | Integrado |
| `GET /api/submissions` | Si | `problemId?, result?, difficulty?, topic?, page?, pageSize?, sort?` | `{ data, meta }` | Integrado |
| `GET /api/submissions/:submissionId` | Si | `submissionId` UUID | `SubmissionDetail` con `sourceCode` y `testcaseResults` | Integrado en Mis Submissions |
| `GET /api/users/me/stats` | Si | - | `{ totalSubmissions, acceptedSubmissions, attemptedProblems, solvedProblems, acceptanceRate, currentStreak, rank }` | Integrado en Profile |
| `GET /api/users/me/progress` | Si | - | `{ data: [{ difficulty, solved, total }], totals }` | Integrado en Profile |
| `GET /api/users/me/activity` | Si | `year?` | `{ year, data: [{ date, count, accepted }] }` | Integrado en Profile |
| `GET /api/admin/problems` | Admin | filtros admin | `{ data, meta }` | Integrado |
| `POST /api/admin/problems` | Admin | `AdminProblemBody` | `AdminProblemDetails` | Integrado |
| `GET /api/admin/problems/:problemId` | Admin | id o slug | `AdminProblemDetails` | Integrado |
| `PUT /api/admin/problems/:problemId` | Admin | `AdminProblemBody` | `AdminProblemDetails` | Integrado |
| `PATCH /api/admin/problems/:problemId/publish` | Admin | - | `{ id, status, updatedAt }` | Integrado |
| `PATCH /api/admin/problems/:problemId/unpublish` | Admin | - | `{ id, status, updatedAt }` | Integrado |
| `GET /api/admin/problems/:problemId/testcases` | Admin | id o slug | `{ data: Testcase[] }` | Integrado |
| `POST /api/admin/problems/:problemId/testcases` | Admin | testcase legacy o moderno | `Testcase` | Integrado |
| `PUT /api/admin/problems/:problemId/testcases/:testcaseId` | Admin | testcase legacy o moderno | `Testcase` | Integrado |
| `DELETE /api/admin/problems/:problemId/testcases/:testcaseId` | Admin | - | `204` | Integrado |
| `POST /api/admin/uploads/images` | Admin | `multipart/form-data`, campo `file` | `{ url }` | Integrado en editor Markdown admin |

## Cambios de integracion realizados

- `ProfilePage` ya carga datos reales desde `/users/me/stats`, `/users/me/progress`, `/users/me/activity` y `/submissions`.
- Se elimino el archivo de mocks de perfil no usado.
- El navbar usa `GET /api/problems/search` con debounce y resultados navegables.
- El tab `Mis Submissions` carga el detalle real con `GET /api/submissions/:submissionId` para recuperar `sourceCode`.
- El editor Markdown admin sube imagenes con `POST /api/admin/uploads/images`.
- `apiRequest` soporta `FormData` sin crear un segundo cliente HTTP.

## Pendientes `TODO: API-PENDING`

- `POST /api/problems/:problemId/run`: ejecutar codigo desde el editor.
- `GET /api/runs/:runId`: polling de ejecucion asincrona, si el judge se implementa asi.
- `POST /api/problems/:problemId/submissions`: submit real desde el editor.
- Endpoint de resultado async de submit: hoy `GET /api/submissions/:submissionId` devuelve detalle historico, no estado de evaluacion en vivo.
- Ranking avanzado de perfil: backend aun no devuelve percentil, total de usuarios ni distribucion para el grafico.
- Estado `solved` real en listado de problemas: backend lo devuelve siempre como `false`.

## Validacion pendiente

- Probar login y token antes de entrar a `/profile`, `/submissions` y `/admin`.
- Probar Profile con usuario que tenga submissions reales.
- Probar busqueda del navbar con al menos dos caracteres.
- Probar carga de codigo desde `Mis Submissions` con una submission que tenga `sourceCode`.
- Probar upload admin con JPEG, PNG, WEBP/GIF y archivo mayor a 2MB para validar errores backend.

## Inconsistencias detectadas

- El backend soporta `credentials: true` en CORS, pero la sesion actual es Bearer token en `localStorage`.
- `GET /api/problems` incluye `solved`, pero el mapper backend lo fija en `false`.
- `GET /api/users/me/stats` devuelve `rank`, pero no devuelve datos suficientes para percentil/distribucion de ranking.
- Los endpoints de judge/run/submit aun no existen en backend, por eso el editor conserva llamadas preparadas y marcadas como pendientes.
