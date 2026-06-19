# Backend Decisions

## Judge Language Contract

The judge runners are the single source of truth for executable languages. The
canonical list lives in `src/modules/judge/supported-languages.ts` and contains:

- `python`
- `javascript`
- `typescript`
- `c`
- `rust`

Public request validation and admin problem validation consume this contract.
The broader Prisma enum remains a persistence compatibility detail and must not
be used to advertise executable languages.

## Problem Publication Integrity

A problem can be published only when it has at least one sample testcase, at
least one testcase in total, at least one supported language, and non-empty
starter code for every advertised language. Languages without a judge runner
also block publication. Validation failures use `INCOMPLETE_PROBLEM` and return
the exact missing requirements.

## Empty Custom Testcases

For `POST /api/problems/:problemId/run`, an omitted `testcases` field and
`testcases: []` intentionally have the same meaning: execute the sample
testcases stored for the problem. This keeps the client contract simple. The
API does not distinguish between these two representations.

## Seeded Problem Verification

`Two Sum` and `Valid Parentheses` are seeded with two sample testcases, six
hidden testcases, and starter code for every canonical judge language. Starter
code does not contain the solution.

Reference solutions are isolated in `prisma/reference-solutions.ts`. The
verification suite compiles and executes them through the same Docker runner
factory used by the queue worker, against every sample and hidden testcase.

| Problem | Language | Result |
| --- | --- | --- |
| Two Sum | Python | Accepted (8/8) |
| Two Sum | JavaScript | Accepted (8/8) |
| Two Sum | TypeScript | Accepted (8/8) |
| Two Sum | C | Accepted (8/8) |
| Two Sum | Rust | Accepted (8/8) |
| Valid Parentheses | Python | Accepted (8/8) |
| Valid Parentheses | JavaScript | Accepted (8/8) |
| Valid Parentheses | TypeScript | Accepted (8/8) |
| Valid Parentheses | C | Accepted (8/8) |
| Valid Parentheses | Rust | Accepted (8/8) |

## Scope

This work resolves backend gaps that do not depend on the future code judge integration:

- Real `solved` values for published problem list and detail endpoints.
- Extended ranking data for `GET /api/users/me/stats`.
- Explicit CORS/session decision aligned with the current Bearer token session model.
- Integration tests for the changed behavior.

Code judge execution endpoints remain out of scope.

## Real Problem Solved State

Previously, `solved` was hardcoded to `false` in the problem mapper. That meant `GET /api/problems` and `GET /api/problems/:slug` could not reflect the authenticated user's actual accepted submissions.

The backend now calculates `solved` from existing `submissions` records:

- `solved = true` when the authenticated user has at least one submission for the problem with `result = "accepted"`.
- `solved = false` when the request is unauthenticated.
- `solved = false` when the user only has failed, pending, runtime, compilation, or timeout submissions.

The logic lives in `src/shared/services/solved-problems.service.ts` and is reused by both problem responses and user statistics. This keeps the data model ready for the future judge: when the judge starts writing accepted submissions, solved states and stats will update from the same source of truth.

The list endpoint calculates solved state only for the current page of problems to avoid N+1 queries and avoid scanning unrelated problem rows.

## Extended Ranking Stats

`GET /api/users/me/stats` keeps the existing fields and adds:

- `percentile`
- `totalUsers`
- `distribution`

Ranking is based on unique accepted problems per user. The ranking population is active users with at least one submission, plus the requesting user when needed so the authenticated user always receives a coherent rank and percentile.

`percentile` is the percentage of users in the ranking population with an equal or lower solved-problem count than the authenticated user.

`distribution` is anonymous and aggregated. It never exposes per-user ranking rows or user identifiers.

## Distribution Bucketing

The distribution uses buckets of 5 solved problems:

- `0`
- `1-5`
- `6-10`
- `11-15`
- and so on

This bucket size is small enough for a useful profile chart early in the product and broad enough to avoid exposing individual user performance in a way that could identify someone.

## Performance Decision

No cache was added in this change.

Reason: current ranking and distribution are computed from the existing submissions table and must reflect new accepted submissions naturally once the judge is integrated. Adding cache before real judge traffic exists would add invalidation complexity without a measured bottleneck.

The aggregation logic is centralized so a short-lived cache can be added later around global aggregate data only. User-specific values such as `rank` and `percentile` should not share cache entries across users.

## CORS And Session Decision

The current session mechanism is Bearer token authentication through the `Authorization` header. The frontend stores the access token and sends it as:

```http
Authorization: Bearer <accessToken>
```

The backend does not currently use httpOnly cookies for application sessions.

Because of that, CORS is configured with:

```ts
credentials: false
```

This reflects the current production behavior and avoids implying cookie-based sessions that do not exist yet. OAuth callback redirects remain supported because this backend OAuth flow does not rely on backend session cookies.

A future migration to httpOnly cookies should be handled as a separate architecture change with CSRF protection, cookie attributes, frontend request changes, and explicit CORS credential handling.

## Explicitly Out Of Scope

The following judge-related endpoints and behaviors were not created, modified, simulated, or stubbed:

- `POST /api/problems/:problemId/run`
- `GET /api/runs/:runId`
- `POST /api/problems/:problemId/submissions`
- Live/asynchronous execution result polling

Those belong to the future judge integration and should be implemented with the real execution backend.

## Test Result

Backend tests were added for:

- Authenticated accepted submission sets `solved: true`.
- Authenticated user without submissions gets `solved: false`.
- Failed submissions do not set `solved: true`.
- Unauthenticated problem requests do not expose another user's solved state.
- Problem detail returns real solved state.
- `GET /api/users/me/stats` rejects unauthenticated requests.
- Ranking stats return `rank`, `percentile`, `totalUsers`, and aggregate `distribution`.

Final test result:

```bash
npm test
```

- 5 test files passed.
- 13 tests passed.
- `npm run typecheck` passed.
