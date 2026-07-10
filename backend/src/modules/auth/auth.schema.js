import { z } from "zod";
const emailSchema = z
    .string()
    .trim()
    .max(254, "Email is too long.")
    .transform((value) => value.toLowerCase())
    .pipe(z.string().email("Invalid email."));
const registerPasswordSchema = z
    .string()
    .min(8, "Password must have at least 8 characters.")
    .max(72, "Password must have at most 72 characters.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.");
export const registerSchema = z
    .object({
    name: z
        .string()
        .trim()
        .min(2, "Name must have at least 2 characters.")
        .max(80, "Name must have at most 80 characters."),
    email: emailSchema,
    password: registerPasswordSchema
})
    .strict();
export const loginSchema = z
    .object({
    email: emailSchema,
    password: z
        .string()
        .min(1, "Password is required.")
        .max(72, "Password must have at most 72 characters."),
    remember: z.boolean().optional()
})
    .strict();
//# sourceMappingURL=auth.schema.js.map