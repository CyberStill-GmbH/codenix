import { z } from "zod";

export const activityQuerySchema = z
  .object({
    year: z.coerce
      .number()
      .int()
      .min(2020)
      .max(2100)
      .default(new Date().getFullYear())
  })
  .strict();

export type ActivityQueryInput = z.infer<typeof activityQuerySchema>;