# Frontend Integration

## Updated Backend Endpoints

| Endpoint backend | Auth | Request | Response principal | Estado frontend |
| --- | --- | --- | --- | --- |
| `GET /api/problems` | Optional Bearer token | Query params supported by the existing endpoint: `page`, `pageSize`, `difficulty`, `topic`, `search`, `sort`. When a Bearer token is provided, the backend calculates the user's solved state. | `{ "data": [{ "id": "string", "numericId": number, "title": "string", "slug": "string", "difficulty": "easy" \| "medium" \| "hard", "acceptance": number, "solved": boolean, "topics": ["string"] }], "meta": { "page": number, "pageSize": number, "total": number, "totalPages": number } }` | `solved` is now real. The problems table can render the solved-status icon without placeholder data. |
| `GET /api/problems/:slug` | Optional Bearer token | Path param: `slug`. When a Bearer token is provided, the backend calculates the user's solved state. | `{ "id": "string", "numericId": number, "title": "string", "slug": "string", "difficulty": "easy" \| "medium" \| "hard", "acceptance": number, "solved": boolean, "topics": ["string"], "statement": "string", "inputFormat": "string", "outputFormat": "string", "constraints": "string", "examples": [{ "id": "string", "input": "string", "output": "string", "explanation": "string" \| null }], "codeTemplates": [{ "language": "python" \| "java" \| "cpp" \| "typescript" \| "javascript", "starterCode": "string" }] }` | `solved` is now real for the authenticated user. Without auth it is always `false`. |
| `GET /api/users/me/stats` | Required Bearer token | No request body. Header required: `Authorization: Bearer <accessToken>`. | `{ "totalSubmissions": number, "acceptedSubmissions": number, "attemptedProblems": number, "solvedProblems": number, "acceptanceRate": number, "currentStreak": number, "rank": number, "percentile": number, "totalUsers": number, "distribution": [{ "bucket": "string", "count": number }] }` | Profile ranking should consume the real `percentile`, `totalUsers`, and `distribution` fields. Replace any placeholder or mock data previously marked as `TODO: API-PENDING` for advanced ranking. |

## New Fields

`GET /api/users/me/stats` now includes these new frontend-ready fields:

```json
{
  "percentile": 75,
  "totalUsers": 4,
  "distribution": [
    {
      "bucket": "0",
      "count": 1
    },
    {
      "bucket": "1-5",
      "count": 3
    }
  ]
}
```

`rank` is no longer returned as a placeholder `null`; it is calculated from unique accepted problems.

## Solved State

The `solved` field in the problems list and problem detail is now calculated from real submissions:

- `true` when the authenticated user has at least one accepted submission for that problem.
- `false` when unauthenticated.
- `false` when the user has no accepted submission for that problem.

Frontend can now show solved icons in the problem list/table without mock or placeholder state.

## Profile Ranking

The Profile ranking component should use:

- `rank`
- `percentile`
- `totalUsers`
- `distribution`

Any previous placeholder, mock, or `TODO: API-PENDING` logic for profile ranking distribution should be replaced with these backend values.

Distribution buckets are string ranges:

- `0`
- `1-5`
- `6-10`
- `11-15`

The sum of all `distribution[].count` values equals `totalUsers`.

## Session Behavior

The backend session mechanism remains Bearer token based:

```http
Authorization: Bearer <accessToken>
```

CORS does not require credentials for the current session model. Frontend requests should continue sending the Bearer token header, not cookie credentials.

## Sigue pendiente

The code judge was not touched in this work and remains `TODO: API-PENDING`:

- `POST /api/problems/:problemId/run`
- `GET /api/runs/:runId`
- `POST /api/problems/:problemId/submissions`
- Polling for live/asynchronous execution results

No judge endpoint was created, modified, simulated, or stubbed.
