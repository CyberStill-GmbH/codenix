# Admin Problem Form Decisions

## Context

The admin problem editor was upgraded as a frontend-only implementation. Backend endpoints for the final problem authoring contract are not available yet, so the UI is wired to the existing mock admin service and stores draft/publish payload snapshots in `localStorage`.

## Current Admin Routing

- `/admin/problems`: problem list.
- `/admin/problems/new`: create problem.
- `/admin/problems/:problemId/edit`: edit problem.
- `/admin/problems/:problemId/testcases`: legacy testcase management screen.

The new integrated form lives inside the existing create/edit route to avoid changing navigation or route permissions.

## Data Model Decision

The form now separates author-facing content from judge-facing data:

- `descriptionMarkdown`: problem statement in Markdown.
- `examples`: human-readable examples rendered in the problem page.
- `constraintsList`: structured list of constraints.
- `parameters`: judge input schema.
- `testcases`: structured JSON cases with `input`, `expectedOutput`, and `isSample`.
- `starterCode`: starter code keyed by supported language.
- `timeLimitMs`, `memoryLimitMb`, `status`: judge and publication settings.

Legacy fields (`statement`, `inputFormat`, `outputFormat`, `constraints`, `codeTemplates`) remain in the type temporarily so older admin components continue compiling during the transition.

## Dependency Decision

The requested dependencies are now available and integrated:

- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`
- `@hookform/resolvers`
- `@monaco-editor/react`
- `@uiw/react-md-editor`
- `highlight.js`
- `nanoid`
- `react-hook-form`
- `react-markdown`
- `rehype-highlight`
- `rehype-sanitize`
- `remark-gfm`
- `zod`

Markdown authoring uses `@uiw/react-md-editor`. Rendering uses `react-markdown` with `remark-gfm`, `rehype-highlight`, and `rehype-sanitize`, avoiding `dangerouslySetInnerHTML`.

Form state is managed through `react-hook-form`; validation is backed by Zod. The recursive JSON testcase type is isolated inside `useProblemForm` to keep TypeScript compile times stable while exposing strongly typed `AdminProblemFormValues` to the rest of the form.

Examples, constraints, and testcases use `@dnd-kit/sortable` for drag-and-drop ordering. IDs for new entities use `nanoid`.

## Pending API Contract

Expected create/update request body:

```json
{
  "title": "string",
  "slug": "string",
  "difficulty": "EASY | MEDIUM | HARD",
  "tags": ["string"],
  "description_markdown": "string",
  "examples": [{ "input": "string", "output": "string", "explanation": "string" }],
  "constraints": ["string"],
  "parameters": [{ "name": "string", "type": "number | number[] | string | string[] | boolean | object", "description": "string" }],
  "output_type": "number | number[] | string | string[] | boolean | object",
  "testcases": [{ "id": "string", "input": {}, "expected_output": null, "is_sample": true }],
  "supported_languages": ["typescript", "javascript", "python", "java", "cpp"],
  "starter_code": {},
  "time_limit_ms": 2000,
  "memory_limit_mb": 256,
  "status": "DRAFT | PUBLISHED"
}
```

Expected response:

```json
{
  "id": "string",
  "updatedAt": "ISO date",
  "...": "AdminProblemDetails"
}
```

## TODO Markers

- `TODO: API-PENDING POST/PUT /api/admin/problems`: create/update with the payload above.
- `TODO: API-PENDING upload de imagenes`: image upload endpoint for Markdown images.
- `TODO: considerar KaTeX si se necesita math complejo`: advanced math rendering.

## Local Testing

1. Start the frontend with `npm run dev`.
2. Open `/admin/problems/new`.
3. Fill title, Markdown description, examples, parameters, testcases, starter code, and settings.
4. Use `Guardar borrador` to save through the mock service and backup the values in `localStorage`.
5. Use `Publicar` to run full validation and store the backend-shaped payload in `localStorage` under `codenix_admin_problem_last_payload`.
6. Edit an existing problem from `/admin/problems/:problemId/edit` to verify mock hydration.

## Validation Completed

- `npm run lint`
- `npm run build`
