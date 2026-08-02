# Codenix Frontend API Integration

## Base de API

El frontend usa el cliente centralizado `apiRequest` en `src/shared/api/apiClient.ts`.
La URL base se configura con:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Autenticacion: JWT por header `Authorization: Bearer <accessToken>`.
El backend tiene CORS con `origin: FRONTEND_URL` y `credentials: false`; la sesion actual no usa cookies httpOnly.

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
| `GET /api/users/me/stats` | Si | - | `{ totalSubmissions, acceptedSubmissions, attemptedProblems, solvedProblems, acceptanceRate, currentStreak, rank, percentile, totalUsers, distribution }` | Integrado en Profile |
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
| `POST /api/problems/:problemId/run` | Si | `{ language, sourceCode, testcases?, stdin? }` | `202` `{ id, status: "pending" }` | Integrado con polling |
| `GET /api/runs/:runId` | Si | UUID del run | Run con `status`, stdout, stderr, error, tiempo, memoria y `testcaseResults` | Integrado como fuente de polling |
| `POST /api/problems/:problemId/submissions` | Si | `{ language, sourceCode }` | `202` `{ id, status, result, resultCode, submittedAt }` | Integrado con polling |

## Cambios de integracion realizados

- `ProfilePage` ya carga datos reales desde `/users/me/stats`, `/users/me/progress`, `/users/me/activity` y `/submissions`.
- Se elimino el archivo de mocks de perfil no usado.
- El navbar usa `GET /api/problems/search` con debounce y resultados navegables.
- El tab `Mis Submissions` carga el detalle real con `GET /api/submissions/:submissionId` para recuperar `sourceCode`.
- El editor Markdown admin sube imagenes con `POST /api/admin/uploads/images`.
- `apiRequest` soporta `FormData` sin crear un segundo cliente HTTP.
- Run y Submit consumen los endpoints reales y normalizan sus receipts/detalles al modelo del panel de resultados.
- Admin Problems ya no usa fallback a memoria: listado, formulario, publicación y testcases dependen de la API real.
- Se eliminaron los tres archivos de mock data de Admin Problems.

## Pendientes fuera de alcance MVP

- Ejecucion de `stdin` en Run: el schema lo acepta, pero el judge actual ejecuta
  testcases almacenados del problema.
- Distribucion y percentil de runtime por lenguaje para submissions aceptadas: el
  backend aun no devuelve estos datos; el grafico solo aparece cuando la API los
  envia.

## Validacion manual recomendada

- Probar login y token antes de entrar a `/profile`, `/submissions` y `/admin`.
- Probar Profile con usuario que tenga submissions reales.
- Probar busqueda del navbar con al menos dos caracteres.
- Probar carga de codigo desde `Mis Submissions` con una submission que tenga `sourceCode`.
- Probar upload admin con JPEG, PNG, WEBP/GIF y archivo mayor a 2MB para validar errores backend.
- Probar Run y Submit autenticados en `two-sum` y `valid-parentheses` con al menos
  Python y TypeScript: Run debe pasar samples; Submit debe dar Accepted y marcar
  el problema como resuelto.
- Probar una solucion incorrecta y confirmar Wrong Answer con el caso sample visible.

## Inconsistencias detectadas

- CORS y sesion son coherentes: `credentials: false` y JWT Bearer en header.
- Run declara `stdin`, pero el servicio backend no lo aplica al judge actual.
- Run/Submit encolan ejecucion real en Docker; el frontend hace polling por id.
