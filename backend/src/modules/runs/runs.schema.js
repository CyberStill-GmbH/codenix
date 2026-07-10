import { z } from "zod";
export const runIdParamsSchema = z.object({
    runId: z.string().uuid("Invalid run ID format"),
});
//# sourceMappingURL=runs.schema.js.map