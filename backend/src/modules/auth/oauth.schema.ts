import { z } from "zod";

export const oauthRedirectQuerySchema = z
  .object({
    returnTo: z.string().max(2048).optional(),
  })
  .strict();

export const oauthCallbackQuerySchema = z
  .object({
    code: z.string().max(4096).optional(),
    state: z.string().max(4096).optional(),
    error: z.string().max(256).optional(),
    error_description: z.string().max(2048).optional(),
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
        message: "OAuth code is required.",
      });
    }

    if (!value.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["state"],
        message: "OAuth state is required.",
      });
    }
  });

export type OAuthRedirectQueryInput = z.infer<typeof oauthRedirectQuerySchema>;
export type OAuthCallbackQueryInput = z.infer<typeof oauthCallbackQuerySchema>;
