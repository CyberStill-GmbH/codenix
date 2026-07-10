import { z } from "zod";
export declare const oauthRedirectQuerySchema: z.ZodObject<{
    returnTo: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const oauthCallbackQuerySchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    error_description: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export type OAuthRedirectQueryInput = z.infer<typeof oauthRedirectQuerySchema>;
export type OAuthCallbackQueryInput = z.infer<typeof oauthCallbackQuerySchema>;
//# sourceMappingURL=oauth.schema.d.ts.map