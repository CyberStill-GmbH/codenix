import { z } from "zod";
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodString>;
}, z.core.$strict>;
export declare const resetPasswordSchemaBody: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strict>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchemaBody>;
//# sourceMappingURL=password-reset.schema.d.ts.map