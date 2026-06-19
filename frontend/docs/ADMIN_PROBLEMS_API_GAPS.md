# Admin Problems API Gaps

## Estado De Integracion

El frontend admin ya consume la API real disponible cuando aplica:

- `GET /api/problems?pageSize=50&sort=numeric-asc`
- `GET /api/problems/:slug`
- `GET /api/problems/topics`

Estas rutas son publicas y solo devuelven problemas publicados. Para no alterar la UI del admin, el servicio `adminProblemsService` usa esas respuestas cuando estan disponibles y conserva fallback mock para drafts, creacion, edicion y testcases admin.

## Endpoints Que Aun Necesita El Frontend

### Listar Problemas Admin

`GET /api/admin/problems`

Debe devolver publicados y drafts, con filtros admin.

Query esperada:

```json
{
  "search": "string opcional",
  "difficulty": "easy | medium | hard opcional",
  "status": "draft | published opcional",
  "tag": "string opcional",
  "page": 1,
  "pageSize": 50,
  "sort": "updated-desc | updated-asc | title-asc"
}
```

Respuesta esperada:

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "difficulty": "easy | medium | hard",
      "tags": ["string"],
      "status": "draft | published",
      "testcasesCount": 0,
      "updatedAt": "ISO date"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 50,
    "total": 0,
    "totalPages": 0
  }
}
```

### Obtener Detalle Admin

`GET /api/admin/problems/:problemId`

Debe poder cargar drafts y published por `id` o `slug`.

Respuesta esperada:

```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "difficulty": "easy | medium | hard",
  "tags": ["string"],
  "status": "draft | published",
  "testcasesCount": 0,
  "updatedAt": "ISO date",
  "descriptionMarkdown": "string",
  "examples": [{ "id": "string", "input": "string", "output": "string", "explanation": "string opcional" }],
  "constraintsList": ["string"],
  "parameters": [{ "id": "string", "name": "string", "type": "number | number[] | string | string[] | boolean | object", "description": "string opcional" }],
  "outputType": "number | number[] | string | string[] | boolean | object",
  "testcases": [{ "id": "string", "input": {}, "expectedOutput": null, "isSample": true }],
  "supportedLanguages": ["typescript", "javascript", "python", "java", "cpp"],
  "starterCode": {
    "typescript": "string",
    "javascript": "string",
    "python": "string",
    "java": "string",
    "cpp": "string"
  },
  "timeLimitMs": 2000,
  "memoryLimitMb": 256
}
```

### Crear Problema

`POST /api/admin/problems`

Body que ya produce el frontend:

```json
{
  "title": "string",
  "slug": "string",
  "difficulty": "EASY | MEDIUM | HARD",
  "tags": ["string"],
  "description_markdown": "string",
  "examples": [{ "input": "string", "output": "string", "explanation": "string opcional" }],
  "constraints": ["string"],
  "parameters": [{ "name": "string", "type": "number | number[] | string | string[] | boolean | object", "description": "string opcional" }],
  "output_type": "number | number[] | string | string[] | boolean | object",
  "testcases": [{ "id": "string", "input": {}, "expected_output": null, "is_sample": true }],
  "supported_languages": ["typescript", "javascript", "python", "java", "cpp"],
  "starter_code": {},
  "time_limit_ms": 2000,
  "memory_limit_mb": 256,
  "status": "DRAFT | PUBLISHED"
}
```

Respuesta esperada: `AdminProblemDetails` completo.

Errores necesarios:

- `409 SLUG_ALREADY_EXISTS`
- `400 VALIDATION_ERROR`
- `401 UNAUTHORIZED`
- `403 FORBIDDEN`

### Actualizar Problema

`PUT /api/admin/problems/:problemId`

Mismo body que crear problema. Respuesta esperada: `AdminProblemDetails` completo actualizado.

### Publicar / Despublicar

`PATCH /api/admin/problems/:problemId/publish`

`PATCH /api/admin/problems/:problemId/unpublish`

Respuesta esperada:

```json
{
  "id": "string",
  "status": "draft | published",
  "updatedAt": "ISO date"
}
```

Validacion esperada al publicar:

- Debe existir al menos un testcase sample.
- Debe existir al menos un testcase hidden.
- Debe existir al menos un lenguaje soportado.
- Debe existir starter code para cada lenguaje soportado.

### Testcases Admin

Aunque el formulario integrado ya envia testcases dentro de create/update, el admin legacy aun tiene una pantalla dedicada de testcases. Para eliminar mocks ahi se necesitan:

- `GET /api/admin/problems/:problemId/testcases`
- `POST /api/admin/problems/:problemId/testcases`
- `PUT /api/admin/problems/:problemId/testcases/:testcaseId`
- `DELETE /api/admin/problems/:problemId/testcases/:testcaseId`

Shape legacy esperado:

```json
{
  "id": "string",
  "problemId": "string",
  "input": "string",
  "expectedOutput": "string",
  "visibility": "sample | hidden",
  "weight": 1,
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

Shape recomendado nuevo:

```json
{
  "id": "string",
  "input": {},
  "expected_output": null,
  "is_sample": true,
  "weight": 1,
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Upload De Imagenes Para Markdown

`POST /api/admin/uploads/images`

Request esperado: `multipart/form-data` con campo `file`.

Respuesta esperada:

```json
{
  "url": "https://..."
}
```

## Funciones Frontend Que Quedarian Por Activar

Cuando existan los endpoints admin, el frontend solo necesita reemplazar el fallback mock en:

- `src/features/admin/problems/services/adminProblems.service.ts`

Funciones afectadas:

- `getProblems`
- `getProblem`
- `getProblemDetails`
- `createProblem`
- `updateProblem`
- `getProblemTestcases`
- `createProblemTestcase`
- `updateProblemTestcase`
- `deleteProblemTestcase`
- `publishProblem`
- `unpublishProblem`
- `canPublishProblem`

## Notas De Seguridad

- Las rutas `/api/admin/*` deben requerir usuario autenticado con rol `admin`.
- El backend debe validar el Markdown como texto, no como HTML.
- El frontend renderiza Markdown con sanitizacion; el backend igualmente debe rechazar payloads fuera de tamano maximo.
- Los testcases hidden no deben exponerse en rutas publicas.
