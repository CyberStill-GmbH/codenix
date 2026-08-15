import { z } from 'zod'

export const changeUsernameSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre completo debe tener al menos 2 caracteres.')
    .max(50, 'El nombre completo no puede exceder 50 caracteres.')
    .optional()
    .or(z.literal('')),
  newUsername: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
    .max(20, 'El nombre de usuario no puede exceder 20 caracteres.')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Usa entre 3 y 20 caracteres alfanuméricos o guion bajo (_).',
    )
    .optional()
    .or(z.literal('')),
})

export type ChangeUsernameFormValues = z.infer<typeof changeUsernameSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida.'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirma la nueva contraseña.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
