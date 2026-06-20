# Backend issues: judge rate limiting and HTTP 422 responses

Date: 2026-06-19

Status: **Resolved on `backend` / `develop` (2026-06-20).** The fixes below were
implemented in `backend/src/modules/judge/judge.rate-limit.ts`,
`backend/src/modules/admin/problems/admin-problems.service.ts`,
`backend/src/modules/judge/supported-languages.ts`, and
`backend/prisma/seed-problems.ts`. See `backend/BACKEND_DECISIONS.md` for the
current contracts and verification table.

## Resolved items

1. **Judge rate limiter IPv6 validation** — `getJudgeRateLimitKey` now uses
   `ipKeyGenerator` from `express-rate-limit` for anonymous requests and
   `user.id` for authenticated requests. Covered by
   `backend/src/tests/judge-rate-limit.test.ts`.
2. **Run HTTP 422 on seeded problems** — legacy `problem-1` and other invalid
   published problems are unpublished during seed. `Two Sum` and
   `Valid Parentheses` are published with sample/hidden testcases and starter
   code for all five judge languages.
3. **Supported-language contract drift** — a single canonical list in
   `supported-languages.ts` drives request validation, admin validation, seeds,
   and judge runners. Java was removed from seeds.
4. **`testcases: []` semantics** — documented in `BACKEND_DECISIONS.md`: an
   omitted field and an empty array both mean "run stored sample testcases".

## Original diagnostic notes

The sections below preserve the pre-fix investigation for context.

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
| `testcaseIds` | array | up to 20 UUIDs | no |

An omitted `testcases` field and `testcases: []` both mean "use stored sample testcases".

### Root cause

`problem-1` was published without sample testcases. The frontend correctly sends
`testcases: []` to request sample execution, but the service rejects problems
with no stored samples.

### Recommended follow-up

Enforce publish-time testcase completeness and unpublish or complete legacy
problems such as `problem-1`.

## 3. Supported-language contract drift

### Observed behavior

Problem detail can expose languages that Run/Submit reject, and seeds can omit
languages that the judge supports.

### Sources checked

- `backend/src/modules/judge/supported-languages.ts`: `python`, `javascript`, `typescript`, `c`, `rust`.
- `backend/src/modules/problems/problems.schema.ts`: same five languages.
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
