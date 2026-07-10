import { z } from "zod";
export declare const activityQuerySchema: z.ZodObject<{
    year: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strict>;
export type ActivityQueryInput = z.infer<typeof activityQuerySchema>;
//# sourceMappingURL=users.schema.d.ts.map