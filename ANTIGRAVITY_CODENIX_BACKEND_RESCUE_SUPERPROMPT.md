# Superprompt para Antigravity — Rescate, auditoría e implementación modular del backend Codenix V1.0

> Usa este prompt dentro de Antigravity/Codex/agent IDE en la raíz del repositorio de Codenix. El objetivo es reconstruir de forma segura y profesional el backend parcial después de un reset de Git, leyendo primero el frontend, los documentos existentes y el estado real del backend antes de tocar código.

---

## Rol que debes asumir

Actúa como un ingeniero backend senior especializado en Node.js, TypeScript, Express, Prisma, PostgreSQL, arquitectura monolítica modular, diseño REST y testing de APIs.

Vas a trabajar en el proyecto **Codenix V1.0**, una plataforma tipo LeetCode para practicar algoritmos y programación competitiva. El frontend ya existe en React + TypeScript + Vite + Tailwind y usa mocks/fallbacks de desarrollo. Tu tarea es auditar los contratos del frontend y reconstruir/implementar en backend todos los endpoints necesarios para reemplazar esos mocks, manteniendo una arquitectura limpia, modular, testeable y segura.

No actúes como generador impulsivo de código. Primero audita. Luego implementa por fases. No rompas lo que ya funciona.

---

## Contexto del proyecto

Codenix V1.0 es una plataforma web de práctica de programación competitiva. El alcance del MVP busca:

1. Auth y sesión.
2. Catálogo público de problemas.
3. Detalle de problema.
4. Ejecución de código desde el editor (`Run`).
5. Envío real de soluciones (`Submit`).
6. Historial y detalle de submissions.
7. Perfil/progreso/dashboard de usuario.
8. Admin Problems CRUD.
9. Admin Testcases CRUD.
10. Publicar/despublicar problemas con validaciones.
11. Upload de imágenes para editor Markdown admin.
12. Búsqueda global de problemas desde navbar.

Stack esperado del backend:

- Node.js
- TypeScript
- Express
- Prisma 7.x
- PostgreSQL
- Docker para DB local
- Arquitectura monolítica modular
- Validación con Zod
- Auth con JWT Bearer token

Stack esperado del frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- Mock data/fallbacks que deben dejar de ser fuente de verdad cuando el backend responda.

---

## Estado histórico antes del reset

Antes del reset de Git, se había conseguido que varias partes pasaran `typecheck` y pruebas manuales con `curl`/PowerShell. Debes usar esta sección como guía de reconstrucción, pero **no asumas que esos archivos siguen existiendo**. Primero audita el estado actual.

### Funcionaba antes del reset

1. PostgreSQL Docker estaba corriendo con DB local:
   - DB: `codenix_dev`
   - User: `codenix`
   - Container típico: `codenix-postgres`

2. Prisma 7 estaba configurado con adapter PostgreSQL:
   - Prisma Client generado en `src/generated/prisma`
   - `src/db/prisma.ts` usaba `@prisma/adapter-pg` y `PrismaPg`.

3. Existía seed de problemas funcional:
   - `npm run seed:problems`
   - Seed creaba problemas como `two-sum`, `valid-parentheses`, `fibonacci-number`.

4. Existía seed admin funcional:
   - `npm run seed:admin`
   - Usuario admin de desarrollo:
     - Email: `cesar.guevara.s@uni.pe`
     - Password: `AdminPassword123`
     - Role: `admin`
   - El login devolvía:
     ```json
     {
       "accessToken": "...",
       "user": {
         "role": "admin"
       }
     }
     ```

5. Auth funcionaba:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `GET /api/auth/me`
   - `POST /api/auth/logout`
   - OAuth Google/GitHub base existía o estaba parcialmente implementado.
   - Password reset estaba implementado o parcialmente implementado.
   - El token se enviaba como:
     ```http
     Authorization: Bearer <accessToken>
     ```

6. Public Problems funcionaba:
   - `GET /api/problems`
   - `GET /api/problems?search=`
   - `GET /api/problems?difficulty=`
   - `GET /api/problems?topic=`
   - `GET /api/problems/topics`
   - `GET /api/problems/:slug`
   - `GET /api/problems/search?q=` se agregó después como búsqueda global.

7. Admin Problems funcionaba:
   - `GET /api/admin/problems`
   - `GET /api/admin/problems/:problemId`
   - `POST /api/admin/problems`
   - `PUT /api/admin/problems/:problemId`
   - `PATCH /api/admin/problems/:problemId/publish`
   - `PATCH /api/admin/problems/:problemId/unpublish`
   - Todas protegidas con auth + role admin.

8. Admin Testcases funcionaba:
   - `GET /api/admin/problems/:problemId/testcases`
   - `POST /api/admin/problems/:problemId/testcases`
   - `PUT /api/admin/problems/:problemId/testcases/:testcaseId`
   - `DELETE /api/admin/problems/:problemId/testcases/:testcaseId`

9. Users profile endpoints habían sido implementados y pasaban `typecheck`:
   - `GET /api/users/me/stats`
   - `GET /api/users/me/progress`
   - `GET /api/users/me/activity?year=2026`

10. Submissions detalle estaba implementado o en proceso:
    - `GET /api/submissions`
    - `GET /api/submissions/:submissionId`

11. Admin upload images funcionaba después de ajuste:
    - `POST /api/admin/uploads/images`
    - Guardaba imágenes en `uploads/images`
    - Servía estático en `/uploads/images/...`
    - Permitía JPEG, PNG, WEBP, GIF.
    - SVG debía rechazarse por seguridad, salvo que se implemente sanitización explícita.

12. Quedaban como pendientes pesados:
    - `POST /api/problems/:problemId/run`
    - `GET /api/runs/:runId`
    - `POST /api/problems/:problemId/submissions`
    - Judge real con Docker/worker/sandbox.

---

## Reglas estrictas de trabajo

### 1. Primero audita, luego implementa

Antes de modificar código, debes leer y resumir:

- Estructura del repo.
- `package.json` raíz si existe.
- `backend/package.json` si existe.
- `backend/prisma/schema.prisma`.
- `backend/src/app.ts`.
- `backend/src/server.ts`.
- `backend/src/db/prisma.ts`.
- Módulos existentes en `backend/src/modules/**`.
- Middlewares existentes en `backend/src/shared/**`.
- Documentos `.md` relevantes en repo, especialmente:
  - `RESTFUL_API_REQUIREMENTS.md`
  - docs dentro de `frontend/`
  - README del frontend/backend
  - cualquier documento que mencione `API-PENDING`, `mock`, `fallback`, `endpoint`, `REST`, `admin`, `submission`, `run`, `judge`.
- Servicios de frontend que consumen API, especialmente archivos bajo:
  - `frontend/src/**/api*`
  - `frontend/src/**/services*`
  - `frontend/src/**/hooks*`
  - `frontend/src/**/mocks*`
  - `frontend/src/**/types*`
  - `frontend/src/**/admin*`
  - `frontend/src/**/problems*`
  - `frontend/src/**/submissions*`
  - `frontend/src/**/profile*`

Después de leer, genera internamente una matriz:

```txt
Endpoint esperado | Lo pide frontend/docs | Existe backend | Estado | Acción
```

No hace falta crear un archivo de reporte salvo que sea útil, pero sí debes usar esa matriz para decidir.

### 2. No borres módulos existentes sin justificación

Si un módulo existe parcialmente, debes refactorizarlo con cuidado. No hagas rewrite masivo si basta con completar piezas.

### 3. Conserva arquitectura modular

Usa esta estructura por módulo:

```txt
src/modules/<module>/
  <module>.schema.ts
  <module>.mapper.ts
  <module>.service.ts
  <module>.controller.ts
  <module>.routes.ts
```

Para admin:

```txt
src/modules/admin/problems/
src/modules/admin/uploads/
```

Para runs:

```txt
src/modules/runs/
```

### 4. Mantén validación con Zod

Toda entrada externa debe pasar por schemas Zod. Usa `res.locals.validatedBody`, `res.locals.validatedQuery`, `res.locals.validatedParams` si el proyecto ya usa ese patrón.

Evita asignar directamente a `req.query`, porque Express puede tener `req.query` como getter/no asignable.

### 5. Mantén respuestas de error estándar

Formato:

```ts
interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
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

### 6. TypeScript estricto

No uses `any` salvo como último recurso y justificado. Prefiere tipos Prisma generados, `Prisma.<Model>GetPayload`, enums generados y tipos Zod inferidos.

### 7. No ejecutes código no confiable en host

Para `run` y `submit`, si no existe todavía un juez Docker seguro, implementa la persistencia, contratos REST y una capa `JudgeService` desacoplada. En modo desarrollo/test puedes usar un `MockJudgeService` determinístico para pruebas. **No ejecutes sourceCode arbitrario directamente con `child_process` en el host**.

La arquitectura debe permitir reemplazar `MockJudgeService` por `DockerJudgeService` después.

### 8. Tests obligatorios

Agrega o repara tests. Si no hay framework, usa Vitest + Supertest o el stack ya presente en el repo.

Como mínimo, deben existir tests para:

- Auth dev seed/login o helper de token en tests.
- Public problems list/detail/search.
- Admin protected routes rechazan sin token.
- Admin protected routes rechazan usuario no admin.
- Admin problems CRUD básico.
- Admin testcases CRUD básico.
- Users stats/progress/activity.
- Admin uploads: rechaza sin token, rechaza SVG, acepta WebP/PNG/JPEG/GIF.
- Submissions detail: solo dueño puede leer.
- Runs: crear run y consultar run.
- Submit: crea submission persistida.

Si por tiempo no puedes terminar todos, deja los tests más críticos y documenta en comentarios TODO, pero intenta completarlos.

### 9. Ejecuta validaciones finales

Al final debes correr:

```bash
npm run typecheck
npm test
```

Si existen scripts de lint/build:

```bash
npm run lint
npm run build
```

Si un script no existe, no lo inventes salvo que estés configurando formalmente el framework de tests.

---

## Convenciones REST esperadas

Base URL:

```txt
/api
```

Headers:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <accessToken>
```

Paginación:

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

Dificultades:

```ts
type ProblemDifficulty = "easy" | "medium" | "hard"
```

Status de problema:

```ts
type ProblemStatus = "draft" | "published"
```

Resultados de submission/run en API pública:

```ts
type SubmissionResult =
  | "Accepted"
  | "Wrong Answer"
  | "Runtime Error"
  | "Time Limit Exceeded"
  | "Compilation Error"
  | "Pending"
```

En DB/enums internos se recomienda usar lowercase/snake_case:

```ts
type SubmissionResultCode =
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "time_limit_exceeded"
  | "compilation_error"
  | "pending"
```

---

## Prisma: estado y campos importantes

Audita primero el `schema.prisma` real. No sobreescribas ciegamente. Pero el esquema esperado debe cubrir como mínimo:

### User

Debe soportar:

- `id`
- `name`
- `username`
- `email`
- `passwordHash` o equivalente
- `avatarUrl`
- `degree`
- `githubUrl`
- `linkedinUrl`
- `role` con `user | admin`
- timestamps
- relaciones con submissions, runs, etc.

### Problem

Debe soportar:

- `id`
- `numericId`
- `title`
- `slug`
- `difficulty`
- `acceptance`
- `status`
- `statement`
- `inputFormat`
- `outputFormat`
- `constraints`
- `parameters Json @default("[]")` si ya se había agregado.
- `outputType String @default("object")` si ya se había agregado.
- `timeLimitMs Int @default(2000)` si ya se había agregado.
- `memoryLimitMb Int @default(256)` si ya se había agregado.
- relaciones:
  - examples
  - codeTemplates
  - topics vía join table
  - testcases
  - submissions
  - codeRuns si se implementa.

### Topic y ProblemTopic

Debe soportar:

- Topic con `name` y `slug`.
- Join table `ProblemTopic` con `problemId` y `topicId`.

### Testcase

Debe soportar:

- `id`
- `problemId`
- `input`
- `expectedOutput`
- `visibility` (`sample | hidden`)
- `weight`
- `orderIndex`
- timestamps

### Submission

Debe soportar:

- `id`
- `userId`
- `problemId`
- `language`
- `sourceCode`
- `result`
- `stdout?`
- `stderr?`
- `error?`
- `stackTrace?`
- `executionTimeMs?`
- `memoryKb?`
- `submittedAt`
- relaciones con testcase results.

Si faltan campos como `sourceCode`, `stdout`, `stderr`, `error`, `stackTrace`, agrégalos mediante migración.

### SubmissionTestcaseResult

Debe soportar:

- `id`
- `submissionId`
- `testcaseId`
- `actualOutput?`
- `error?`
- `passed`
- `executionTimeMs?`
- `memoryKb?`
- timestamps si existen.

### CodeRun y CodeRunTestcaseResult

Para `POST /api/problems/:problemId/run` y `GET /api/runs/:runId`, agrega si no existen:

```prisma
// Ajusta nombres/enums al estilo existente del schema.
enum CodeRunStatus {
  pending
  running
  accepted
  wrong_answer
  runtime_error
  time_limit_exceeded
  compilation_error
  internal_error
}

model CodeRun {
  id              String        @id @default(uuid())
  userId          String
  problemId       String
  language        String
  sourceCode      String
  status          CodeRunStatus @default(pending)
  stdout          String?
  stderr          String?
  error           String?
  executionTimeMs Int?
  memoryKb        Int?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  problem         Problem       @relation(fields: [problemId], references: [id], onDelete: Cascade)
  testcaseResults CodeRunTestcaseResult[]

  @@index([userId])
  @@index([problemId])
  @@index([status])
  @@map("code_runs")
}

model CodeRunTestcaseResult {
  id              String        @id @default(uuid())
  runId           String
  testcaseId      String?
  input           String
  expectedOutput  String?
  actualOutput    String?
  error           String?
  passed          Boolean       @default(false)
  executionTimeMs Int?
  memoryKb        Int?
  createdAt       DateTime      @default(now())

  run             CodeRun       @relation(fields: [runId], references: [id], onDelete: Cascade)
  testcase        Testcase?     @relation(fields: [testcaseId], references: [id], onDelete: SetNull)

  @@index([runId])
  @@index([testcaseId])
  @@map("code_run_testcase_results")
}
```

Y agrega relaciones inversas si Prisma las exige:

```prisma
// en User
codeRuns CodeRun[]

// en Problem
codeRuns CodeRun[]

// en Testcase
codeRunResults CodeRunTestcaseResult[]
```

Después de cambios Prisma:

```bash
npx prisma format
npx prisma migrate dev --name <migration_name>
npx prisma generate
npm run typecheck
```

---

## Endpoints que deben existir o reconstruirse

### Auth

Audita y conserva/implementa:

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/google
GET  /api/auth/google/callback
GET  /api/auth/github
GET  /api/auth/github/callback
```

Para MVP, OAuth puede quedar configurado de forma segura con env vars y mensajes claros si faltan credenciales. No debe romper el login local.

### Public Problems

Implementa/conserva:

```txt
GET /api/problems
GET /api/problems?search=
GET /api/problems?difficulty=easy|medium|hard
GET /api/problems?topic=array
GET /api/problems?sort=numeric-asc|numeric-desc|acceptance-desc|acceptance-asc
GET /api/problems/topics
GET /api/problems/search?q=two&limit=8
GET /api/problems/:slug
```

Orden de rutas obligatorio:

```txt
/search antes de /:slug
/topics antes de /:slug
```

Respuesta `GET /api/problems/search?q=` esperada:

```ts
interface ProblemSearchItem {
  id: string
  numericId?: number
  title: string
  slug: string
  difficulty: "easy" | "medium" | "hard"
  topics: string[]
}

interface ProblemSearchResponse {
  data: ProblemSearchItem[]
}
```

Nunca expongas hidden testcases en rutas públicas.

### Problem Run

Implementa:

```txt
POST /api/problems/:problemId/run
GET  /api/runs/:runId
```

`problemId` debe aceptar slug o UUID si el frontend usa ambos. Audita frontend para decidir. Se recomienda helper `findProblemOrThrow(identifier)` que busque por `id` si UUID y por `slug` si no.

Request:

```ts
interface RunCodeRequest {
  language: "python" | "javascript" | "typescript" | "java" | "cpp" | "c" | "rust" | string
  sourceCode: string
  stdin?: string
  testcaseIds?: string[]
}
```

Response inicial:

```ts
interface RunCodeResponse {
  id: string
  status: "pending" | "running" | "accepted" | "wrong_answer" | "runtime_error" | "time_limit_exceeded" | "compilation_error" | "internal_error"
}
```

`GET /api/runs/:runId`:

```ts
interface RunDetailResponse {
  id: string
  problemId: string
  problemTitle: string
  problemSlug: string
  language: string
  sourceCode: string
  status: string
  stdout: string | null
  stderr: string | null
  error: string | null
  executionTimeMs: number | null
  memoryKb: number | null
  createdAt: string
  updatedAt: string
  testcaseResults: Array<{
    id: string
    testcaseId: string | null
    input: string
    expectedOutput: string | null
    actualOutput: string | null
    error: string | null
    passed: boolean
    executionTimeMs: number | null
    memoryKb: number | null
  }>
}
```

Seguridad:

- No ejecutes código real en host.
- Usa `JudgeService` desacoplado.
- En modo `mock`, crea resultados determinísticos para tests.
- En el futuro se reemplaza por Docker judge.

### Submissions

Implementa/conserva:

```txt
GET  /api/submissions
GET  /api/submissions/:submissionId
POST /api/problems/:problemId/submissions
```

`GET /api/submissions` debe filtrar por usuario autenticado. No devolver submissions de otros usuarios.

Query opcional:

```txt
problemId
result
page
pageSize
sort=submitted-desc|submitted-asc
difficulty
topic
```

`GET /api/submissions/:submissionId` debe devolver detalle completo y verificar ownership:

```ts
interface SubmissionDetail {
  id: string
  problemId: string
  problemTitle: string
  problemSlug: string
  difficulty: "easy" | "medium" | "hard"
  topics: string[]
  result: "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded" | "Compilation Error" | "Pending"
  resultCode: string
  language: string
  submittedAt: string
  sourceCode: string
  stdout: string | null
  stderr: string | null
  error: string | null
  stackTrace: string | null
  executionTimeMs: number | null
  memoryKb: number | null
  testcaseResults: Array<{
    id: string
    testcaseId: string
    visibility: "sample" | "hidden"
    input: string
    expectedOutput: string
    actualOutput: string | null
    error: string | null
    passed: boolean
    executionTimeMs: number | null
    memoryKb: number | null
  }>
}
```

`POST /api/problems/:problemId/submissions`:

Request:

```ts
interface CreateSubmissionRequest {
  language: string
  sourceCode: string
}
```

Response:

```ts
interface CreateSubmissionResponse {
  id: string
  result: string
  resultCode: string
  submittedAt: string
}
```

MVP sin juez real:

- Persistir submission.
- Usar `JudgeService` mock si no hay Docker judge.
- Crear testcase results según testcases del problema.
- Mantener arquitectura lista para judge real.

### Users/Profile

Implementa/conserva:

```txt
GET /api/users/me/stats
GET /api/users/me/progress
GET /api/users/me/activity?year=2026
```

`GET /api/users/me/stats`:

```ts
interface UserStatsResponse {
  totalSubmissions: number
  acceptedSubmissions: number
  attemptedProblems: number
  solvedProblems: number
  acceptanceRate: number
  currentStreak: number
  rank: number | null
}
```

`GET /api/users/me/progress`:

```ts
interface UserProgressResponse {
  data: Array<{
    difficulty: "easy" | "medium" | "hard"
    solved: number
    total: number
  }>
  totals: {
    solved: number
    total: number
  }
}
```

`GET /api/users/me/activity?year=`:

```ts
interface UserActivityResponse {
  year: number
  data: Array<{
    date: string // YYYY-MM-DD
    count: number
    accepted: number
  }>
}
```

Si no hay submissions, devuelve ceros y arrays vacíos. No falles.

### Admin Problems

Implementa/conserva:

```txt
GET   /api/admin/problems
GET   /api/admin/problems/:problemId
POST  /api/admin/problems
PUT   /api/admin/problems/:problemId
PATCH /api/admin/problems/:problemId/publish
PATCH /api/admin/problems/:problemId/unpublish
```

Todas requieren:

```txt
authMiddleware + adminMiddleware
```

`problemId` puede ser UUID o slug.

Admin list item:

```ts
interface AdminProblemListItem {
  id: string
  title: string
  slug: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  status: "draft" | "published"
  testcasesCount: number
  updatedAt: string
}
```

Admin detail debe incluir todo lo necesario para editor:

- title
- slug
- difficulty
- tags/topics
- status
- statement
- inputFormat
- outputFormat
- constraints
- examples
- codeTemplates
- parameters
- outputType
- timeLimitMs
- memoryLimitMb
- testcases summary o testcases completos según frontend.

Al publicar, valida mínimo:

- title
- statement
- difficulty
- al menos un sample testcase
- al menos un hidden testcase o según regla MVP
- al menos un code template si frontend lo requiere

### Admin Testcases

Implementa/conserva:

```txt
GET    /api/admin/problems/:problemId/testcases
POST   /api/admin/problems/:problemId/testcases
PUT    /api/admin/problems/:problemId/testcases/:testcaseId
DELETE /api/admin/problems/:problemId/testcases/:testcaseId
```

Debe aceptar formato legacy y/o moderno si el frontend lo usa.

Formato legacy visto funcionar:

```json
{
  "input": "[1,2,3]\n5",
  "expectedOutput": "[1,2]",
  "visibility": "hidden",
  "weight": 1
}
```

Formato moderno posible:

```json
{
  "input": [1,2,3],
  "expected_output": [1,2],
  "is_sample": false,
  "weight": 1
}
```

Puedes normalizar internamente a:

```ts
{
  input: string
  expectedOutput: string
  visibility: "sample" | "hidden"
  weight: number
}
```

Si `input` o `expected_output` son JSON, serializa con `JSON.stringify`.

### Admin Upload Images

Implementa/conserva:

```txt
POST /api/admin/uploads/images
```

Requisitos:

- Protegido con auth + admin.
- Multipart field: `file`.
- Guardar en local para MVP:
  ```txt
  uploads/images/
  ```
- Servir estático:
  ```txt
  /uploads/images/<filename>
  ```
- Devolver:
  ```json
  {
    "url": "http://localhost:4000/uploads/images/<filename>"
  }
  ```
- Aceptar:
  - image/jpeg
  - image/png
  - image/webp
  - image/gif
- Rechazar SVG por defecto:
  - `image/svg+xml` no permitido salvo sanitización explícita.
- Tamaño máximo recomendado: 2MB o 5MB según frontend.
- En Windows/curl, WebP puede llegar como `application/octet-stream`; puedes aceptar por MIME o extensión segura (`.webp`) siempre que la extensión sea de lista blanca.

`src/server.ts` debe crear carpeta antes de escuchar:

```ts
await ensureImagesUploadDir()
```

---

## Patrones de código que se habían usado y conviene mantener

### Prisma client con adapter PostgreSQL

Si falta `src/db/prisma.ts`, reconstruir así adaptado al proyecto:

```ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
```

Ajusta import path si el generated client usa otro path.

### Validate middleware esperado

Si está roto, usa patrón:

```ts
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../errors/app-error";

type ValidationTarget = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export function validate(schemas: ValidationTarget) {
  return (req: Request, res: Response, next: NextFunction) => {
    const bodyResult = schemas.body?.safeParse(req.body);
    const queryResult = schemas.query?.safeParse(req.query);
    const paramsResult = schemas.params?.safeParse(req.params);

    const failedResult = [bodyResult, queryResult, paramsResult].find(
      (result) => result && !result.success
    );

    if (failedResult && !failedResult.success) {
      throw new AppError(422, "VALIDATION_ERROR", "Invalid request data.", {
        issues: failedResult.error.issues
      });
    }

    if (bodyResult?.success) {
      req.body = bodyResult.data;
      res.locals.validatedBody = bodyResult.data;
    }

    if (queryResult?.success) {
      res.locals.validatedQuery = queryResult.data;
    }

    if (paramsResult?.success) {
      res.locals.validatedParams = paramsResult.data;
    }

    next();
  };
}
```

### asyncHandler esperado

```ts
import type { NextFunction, Request, Response } from "express";

type AsyncOrSyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => unknown | Promise<unknown>;

export function asyncHandler(fn: AsyncOrSyncHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(() => fn(req, res, next))
      .catch(next);
  };
}
```

### adminMiddleware esperado

Debe buscar el userId desde el patrón usado por `authMiddleware`. Antes se usó robusto:

```ts
type AuthenticatedRequest = Request & {
  user?: {
    id?: string;
    userId?: string;
  };
  userId?: string;
  auth?: {
    userId?: string;
  };
};
```

Y luego buscar usuario en DB y exigir `role === "admin"`.

### seed-admin esperado

Si falta, recrear:

```ts
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = "cesar.guevara.s@uni.pe";
const ADMIN_PASSWORD = "AdminPassword123";
const ADMIN_NAME = "César Admin";
const ADMIN_USERNAME = "cesar-admin";

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, role: "admin" },
    create: {
      name: ADMIN_NAME,
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin"
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true
    }
  });

  console.log("Admin user ready:");
  console.log(admin);
  console.log("");
  console.log("Login credentials:");
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Script:

```json
"seed:admin": "tsx prisma/seed-admin.ts"
```

---

## Implementación por fases

No intentes hacer todo de golpe en una sola edición gigante. Hazlo en fases con `typecheck` entre ellas.

### Fase 0 — Auditoría y protección del estado actual

1. Ejecuta:
   ```bash
   git status --short
   ```
2. Si hay cambios vivos, no los pierdas.
3. Lee documentos y frontend.
4. Determina qué endpoints ya existen y cuáles faltan.
5. Determina si Prisma schema ya tiene modelos/campos necesarios.

### Fase 1 — Recuperar base estable

Objetivo:

- Backend compila.
- DB conecta.
- Auth local funciona.
- seed admin funciona.

Revisar:

```bash
npm run typecheck
npm run seed:admin
```

Prueba manual:

```powershell
$login = Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4000/api/auth/login" `
  -ContentType "application/json" `
  -Body (@{
    email = "cesar.guevara.s@uni.pe"
    password = "AdminPassword123"
  } | ConvertTo-Json)

$token = $login.accessToken
"Bearer $token"
```

### Fase 2 — Public problems + search

Asegura:

```txt
GET /api/problems
GET /api/problems/topics
GET /api/problems/search?q=
GET /api/problems/:slug
```

Testea orden de rutas para que `/search` y `/topics` no caigan en `/:slug`.

### Fase 3 — Admin problems + testcases

Asegura:

```txt
/api/admin/problems
/api/admin/problems/:problemId/testcases
```

Debe pasar auth/admin. Usuario normal debe recibir 403.

### Fase 4 — Users profile endpoints

Asegura:

```txt
/api/users/me/stats
/api/users/me/progress
/api/users/me/activity?year=2026
```

Sin submissions debe responder ceros.

### Fase 5 — Submissions list/detail

Asegura:

```txt
GET /api/submissions
GET /api/submissions/:submissionId
```

Debe respetar ownership.

Si no hay data, crea seed de submissions de prueba o tests que creen data directamente.

### Fase 6 — Admin uploads

Asegura:

```txt
POST /api/admin/uploads/images
```

Pruebas:

- Sin token → 401.
- Token user → 403.
- SVG → 400.
- WebP/PNG/JPEG/GIF → 201 + URL.
- URL estática devuelve archivo.

### Fase 7 — Runs y Submit sin juez real inseguro

Agrega Prisma models `CodeRun` y `CodeRunTestcaseResult` si no existen.

Implementa:

```txt
POST /api/problems/:problemId/run
GET /api/runs/:runId
POST /api/problems/:problemId/submissions
```

Usa `JudgeService` desacoplado:

```ts
export interface JudgeService {
  run(input: JudgeRunInput): Promise<JudgeRunResult>;
}
```

Con `MockJudgeService` determinístico para tests/desarrollo. Ejemplo simple:

- Si `sourceCode` contiene `__CE_FAIL_COMPILE__`, devuelve `compilation_error`.
- Si contiene `__CE_RUNTIME_ERROR__`, devuelve `runtime_error`.
- Si contiene `__CE_TLE__`, devuelve `time_limit_exceeded`.
- Si no, devuelve `accepted` y marca testcases como passed.

Esto permite que frontend deje de usar placeholders sin ejecutar código real. Documenta claramente que judge real Docker queda como siguiente fase.

---

## Tests sugeridos

Si el proyecto no tiene tests, configura Vitest + Supertest de forma mínima.

Dependencias sugeridas:

```bash
npm install -D vitest supertest @types/supertest
```

Script:

```json
"test": "vitest run"
```

Estructura sugerida:

```txt
src/test/
  helpers/
    auth.ts
    db.ts
  problems.e2e.test.ts
  admin-problems.e2e.test.ts
  admin-testcases.e2e.test.ts
  users.e2e.test.ts
  submissions.e2e.test.ts
  uploads.e2e.test.ts
  runs.e2e.test.ts
```

Si usar la DB dev directamente es aceptable para MVP, documenta que los tests requieren PostgreSQL local y `DATABASE_URL`. Si puedes aislar test DB, mejor.

Helpers útiles:

- Crear usuario admin.
- Crear usuario normal.
- Login y obtener token.
- Seed de problema mínimo con testcases.
- Limpiar tablas relevantes antes/después.

Casos mínimos:

### Public problems

- Lista problemas publicados.
- No lista drafts.
- Detail por slug publicado.
- 404 para draft/no existente.
- Search por `q` encuentra por título/topic.

### Admin

- Sin token → 401.
- User normal → 403.
- Admin puede listar.
- Admin puede crear problema draft.
- Admin puede update.
- Admin puede publish/unpublish.

### Testcases

- Admin lista testcases.
- Admin crea testcase sample/hidden.
- Admin actualiza testcase.
- Admin elimina testcase.

### Users

- Stats sin submissions devuelve ceros.
- Progress refleja problemas publicados y accepted submissions.
- Activity agrupa por fecha.

### Submissions

- Usuario solo ve sus submissions.
- Detail incluye sourceCode y testcaseResults.
- Otro usuario no puede leer detail.

### Uploads

- SVG rechazado.
- WebP aceptado.
- Archivo mayor al límite rechazado.

### Runs/Submit

- Crear run con mock judge devuelve id/status.
- Consultar run devuelve resultados.
- Crear submission persiste y devuelve id.
- Detail de submission posterior funciona.

---

## Comandos manuales de validación

Después de implementar, estos comandos deben funcionar en PowerShell.

### Login admin

```powershell
npm run seed:admin

$login = Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4000/api/auth/login" `
  -ContentType "application/json" `
  -Body (@{
    email = "cesar.guevara.s@uni.pe"
    password = "AdminPassword123"
  } | ConvertTo-Json)

$token = $login.accessToken
"Bearer $token"
```

### Public search

```powershell
curl.exe -i "http://localhost:4000/api/problems/search?q=two"
curl.exe -i "http://localhost:4000/api/problems/search?q=array&limit=5"
```

### Admin problems

```powershell
curl.exe -i "http://localhost:4000/api/admin/problems" -H "Authorization: Bearer $token"
```

### Admin testcases

```powershell
curl.exe -i "http://localhost:4000/api/admin/problems/two-sum/testcases" -H "Authorization: Bearer $token"
```

PowerShell body recomendado para POST testcase:

```powershell
$body = @{
  input = "[1,2,3]`n5"
  expectedOutput = "[1,2]"
  visibility = "hidden"
  weight = 1
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4000/api/admin/problems/two-sum/testcases" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $body
```

### Users

```powershell
curl.exe -i "http://localhost:4000/api/users/me/stats" -H "Authorization: Bearer $token"
curl.exe -i "http://localhost:4000/api/users/me/progress" -H "Authorization: Bearer $token"
curl.exe -i "http://localhost:4000/api/users/me/activity?year=2026" -H "Authorization: Bearer $token"
```

### Upload image

```powershell
curl.exe -i -X POST "http://localhost:4000/api/admin/uploads/images" `
  -H "Authorization: Bearer $token" `
  -F "file=@C:\projects\codenix\frontend\public\contests-upcoming.webp;type=image/webp"
```

Sin `type=image/webp`, algunos curl de Windows mandan MIME incorrecto. El backend idealmente debe tolerar extensión `.webp` de lista blanca.

### Run

```powershell
$body = @{
  language = "python"
  sourceCode = "print('hello codenix')"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4000/api/problems/two-sum/run" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $body
```

### Submit

```powershell
$body = @{
  language = "python"
  sourceCode = "print('solution')"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4000/api/problems/two-sum/submissions" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $body
```

---

## Criterios de aceptación final

El trabajo se considera terminado cuando:

1. El agente leyó frontend/docs y no implementó a ciegas.
2. `npm run typecheck` pasa.
3. `npm test` pasa o se agregó test suite funcional.
4. Las rutas requeridas por frontend existen.
5. Los endpoints protegidos exigen Bearer token.
6. Las rutas admin exigen role `admin`.
7. Public routes no exponen hidden testcases.
8. Users stats/progress/activity no fallan aunque no haya submissions.
9. Upload rechaza SVG y acepta imágenes raster permitidas.
10. Runs/Submit tienen persistencia y contrato modular, sin ejecutar código arbitrario en host.
11. Prisma schema está migrado y generado.
12. El código queda modular y no concentrado en `app.ts` o controladores gigantes.
13. El README o un documento breve indica qué queda pendiente para judge real Docker.

---

## Salida esperada de Antigravity

Al finalizar, entrega un resumen con:

```txt
1. Archivos leídos para auditoría.
2. Endpoints encontrados en frontend/docs.
3. Endpoints ya existentes antes de cambios.
4. Endpoints implementados/reparados.
5. Cambios Prisma/migraciones realizadas.
6. Tests agregados.
7. Comandos ejecutados y resultado.
8. Pendientes honestos para el judge real.
```

No ocultes fallos. Si algo no pudo implementarse, explica el motivo y deja TODO concreto.

---

## Nota final de prioridad

La prioridad no es “hacer mucho código rápido”. La prioridad es dejar el backend de Codenix recuperado, compilando, testeado y alineado al frontend. Si hay conflicto entre frontend docs y backend actual, el frontend/docs mandan para el contrato, pero el backend debe mantener consistencia interna y seguridad.

No ejecutes código de usuarios sin sandbox. Para el MVP, un `MockJudgeService` modular es aceptable hasta implementar Docker judge.
