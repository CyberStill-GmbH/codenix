import { z } from "zod";
const emailSchema = z
    .string()
    .trim()
    .max(254, "Email is too long.")
    .transform((value) => value.toLowerCase())
    .pipe(z.string().email("Invalid email."));
const resetPasswordSchema = z
    .string()
    .min(8, "Password must have at least 8 characters.")
    .max(72, "Password must have at most 72 characters.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.");
export const forgotPasswordSchema = z
    .object({
    email: emailSchema
})
    .strict();
export const resetPasswordSchemaBody = z
    .object({
    token: z.string().min(32, "Reset token is required."),
    newPassword: resetPasswordSchema
})
    .strict();
//# sourceMappingURL=password-reset.schema.js.map