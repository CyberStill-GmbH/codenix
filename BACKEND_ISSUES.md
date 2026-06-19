# Backend issues: judge rate limiting and HTTP 422 responses

Date: 2026-06-19

## Scope

This document records the current backend behavior observed after the Monaco frontend repair. It is diagnostic only: no backend source code was changed as part of this phase.

Environment used for reproduction:

- API: `http://localhost:4000/api`
- PostgreSQL: local `codenix-postgres` container
- Redis: local `codenix-redis` container
- Problem: `problem-1`
- Auth: valid Bearer access token for a local QA user

## 1. Judge rate limiter still fails IPv6 validation

### Observed behavior

Starting the API emits `ERR_ERL_KEY_GEN_IPV6` twice, once for each judge limiter:

```text
ValidationError: Custom keyGenerator appears to use request IP without calling
the ipKeyGenerator helper function for IPv6 addresses.
code: ERR_ERL_KEY_GEN_IPV6
```

The API continues to listen on port 4000, but the warning confirms that the custom key generator is not compliant with `express-rate-limit` IPv6 requirements.

### Current implementation

`backend/src/modules/judge/judge.rate-limit.ts:14-19` manually reads `req.ip` and strips the `::ffff:` prefix:

```ts
keyGenerator: (req: Request) => {
  if (req.user?.id) return req.user.id;
  const ip = (req.ip ?? "anonymous").replace(/^::ffff:/, "");
  return ip;
}
```

Although the comments say that `ipKeyGenerator` must be used, the helper is not imported or called. The earlier attempted fix therefore did not reach this branch in a functional form; this is a pending issue, not a new regression.

### Recommended follow-up

Update `backend/src/modules/judge/judge.rate-limit.ts` to import and use the package-provided `ipKeyGenerator` for the IP fallback while preserving authenticated `user.id` as the preferred key. Add a focused test for IPv4, IPv4-mapped IPv6, native IPv6, and authenticated requests.

## 2. Run returns HTTP 422

### Exact frontend payload

The current frontend sends this shape from `CodeWorkspace.tsx:220-227` through `codingApi.ts:173-185`:

```json
{
  "language": "python",
  "sourceCode": "def solve(input_data: str) -> str:\n    return \"\"\n",
  "testcases": []
}
```

### Exact response

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{"code":"NO_TESTCASES","message":"This problem has no sample testcases."}
```

### Backend schema

`backend/src/modules/problems/problems.schema.ts:54-62` accepts:

| Field | Type | Constraints | Required |
| --- | --- | --- | --- |
| `language` | enum | `python`, `javascript`, `typescript`, `c`, `rust` | yes |
| `sourceCode` | string | 1 to 65536 characters | yes |
| `testcases` | array | up to 20 strict `{ input, expectedOutput }` objects | no |
| `stdin` | string | up to 65536 characters | no |
| `testcaseIds` | UUID array | up to 20 items | no |

The frontend payload matches this schema field by field. An empty `testcases` array is valid because the schema has no `.min(1)` constraint.

### Root cause

This 422 is not request-schema rejection and is not caused by the worker or queue. In `backend/src/modules/problems/problems.service.ts:264-278`, an empty custom testcase array falls back to sample testcases stored for the problem. `problem-1` has none, so the service raises `NO_TESTCASES` before creating or enqueueing a run.

| Comparison | Frontend | Backend | Result |
| --- | --- | --- | --- |
| Language | `python` | accepted enum and enabled QA template | matches |
| Source code | non-empty string | required non-empty string | matches |
| Custom testcases | empty array | schema accepts it; service treats it as absent | semantic mismatch |
| Stored sample testcases | not controlled by frontend | none for `problem-1` | direct cause of 422 |

### Recommended follow-up

Decide and document one contract:

1. Require at least one custom testcase when `testcases` is present, and have the frontend omit the field when empty; or
2. Continue accepting an empty array as "use stored samples", but guarantee every published problem has at least one sample testcase.

The primary backend locations are `problems.schema.ts:47-62`, `problems.service.ts:244-278`, and the admin publish validation/seed path that permits a published problem without sample testcases.

## 3. Submit returns HTTP 422

### Exact frontend payload

The current frontend sends this shape from `CodeWorkspace.tsx:280-283` through `codingApi.ts:196-214`:

```json
{
  "language": "python",
  "sourceCode": "def solve(input_data: str) -> str:\n    return \"\"\n"
}
```

### Exact response

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{"code":"NO_TESTCASES","message":"This problem has no testcases."}
```

### Backend schema

`backend/src/modules/problems/problems.schema.ts:64-69` expects exactly:

| Field | Type | Constraints | Required |
| --- | --- | --- | --- |
| `language` | enum | `python`, `javascript`, `typescript`, `c`, `rust` | yes |
| `sourceCode` | string | 1 to 65536 characters | yes |

The payload exactly matches the strict schema. The response is produced later by `backend/src/modules/problems/problems.service.ts:347-349` because the selected problem has no persisted testcases. No submission or queue job is created.

### Recommended follow-up

Prevent a problem from becoming `published` unless it has at least one judge testcase. The relevant areas to inspect are the admin problem publish validation/service and `problems.service.ts:317-349`. Existing published records should be audited or backfilled.

## 4. Language and starter-code data inconsistency

The real detail response for `GET /api/problems/problem-1` initially contained:

```json
{
  "codeTemplates": []
}
```

The endpoint does not expose a separate `supported_languages` field. The frontend correctly derives its selector from `codeTemplates`; its TypeScript-only fallback was activated because the backend returned no templates.

For isolated frontend QA, five local templates were inserted for `problem-1` without changing backend source files. The API then returned Python, JavaScript, TypeScript, C, and Rust, and the frontend rendered all five dynamically.

There is also a repository-level mismatch:

- Judge request schema: Python, JavaScript, TypeScript, C, Rust.
- `backend/prisma/seed-problems.ts`: Python, JavaScript, TypeScript, Java.
- Prisma enum: also permits Java and C++.

Consequences:

- Seeded Java is displayed as available but rejected by the judge request schema.
- Seeded problems do not provide C or Rust starter code.
- Problems created without templates trigger `UNSUPPORTED_LANGUAGE` before testcase validation.

### Recommended follow-up

Use one authoritative supported-language set across the Prisma enum, admin validation, seeds, problem detail response, request schemas, and judge runners. At minimum, update `backend/prisma/seed-problems.ts`, validate language/template completeness before publish, and add an integration test asserting that every language returned by problem detail is accepted by Run and Submit.

## Priority recommendation

1. Fix `ipKeyGenerator` usage because it affects rate-limit correctness for IPv6 clients.
2. Enforce publish-time testcase and code-template completeness to stop invalid problems from reaching users.
3. Align the supported-language contract across seeds, admin, public problem detail, and judge schemas.
4. Clarify whether `testcases: []` means invalid custom input or fallback to stored sample cases, then enforce the same rule in Zod and service logic.
