import { z } from "zod";
export const oauthRedirectQuerySchema = z
    .object({
    returnTo: z.string().optional()
})
    .strict();
export const oauthCallbackQuerySchema = z
    .object({
    code: z.string().optional(),
    state: z.string().optional(),
    error: z.string().optional(),
    error_description: z.string().optional()
})
    .passthrough()
    .superRefine((value, ctx) => {
    if (value.error) {
        return;
    }
    if (!value.code) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["code"],
            message: "OAuth code is required."
        });
    }
    if (!value.state) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["state"],
            message: "OAuth state is required."
        });
    }
});
//# sourceMappingURL=oauth.schema.js.map