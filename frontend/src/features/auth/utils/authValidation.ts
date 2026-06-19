import type {
  ForgotPasswordFormErrors,
  ForgotPasswordFormValues,
  LoginFormErrors,
  LoginFormValues,
  RegisterFormErrors,
  RegisterFormValues,
  ResetPasswordFormErrors,
  ResetPasswordFormValues,
} from '../types/auth.types'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (!values.email.trim()) {
    errors.email = 'El correo es obligatorio.'
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Ingresa un correo valido.'
  }

  if (!values.password.trim()) {
    errors.password = 'La contrasena es obligatoria.'
  } else if (values.password.length > 72) {
    errors.password = 'Maximo 72 caracteres.'
  }

  return errors
}

export function validateRegisterForm(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'El nombre es obligatorio.'
  } else if (values.name.trim().length < 2) {
    errors.name = 'Minimo 2 caracteres.'
  } else if (values.name.trim().length > 80) {
    errors.name = 'Maximo 80 caracteres.'
  }

  if (!values.email.trim()) {
    errors.email = 'El correo es obligatorio.'
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Ingresa un correo valido.'
  }

  if (!values.password) {
    errors.password = 'La contrasena es obligatoria.'
  } else if (values.password.length < 8) {
    errors.password = 'Minimo 8 caracteres.'
  } else if (values.password.length > 72) {
    errors.password = 'Maximo 72 caracteres.'
  } else if (!/[a-z]/.test(values.password)) {
    errors.password = 'Debe incluir al menos una minuscula.'
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = 'Debe incluir al menos una mayuscula.'
  } else if (!/[0-9]/.test(values.password)) {
    errors.password = 'Debe incluir al menos un numero.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contrasena.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contrasenas no coinciden.'
  }

  if (!values.terms) {
    errors.terms = 'Debes aceptar los terminos para continuar.'
  }

  return errors
}

export function validateForgotPasswordForm(
  values: ForgotPasswordFormValues,
): ForgotPasswordFormErrors {
  const errors: ForgotPasswordFormErrors = {}

  if (!values.email.trim()) {
    errors.email = 'El correo es obligatorio.'
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Ingresa un correo valido.'
  }

  return errors
}

export function getPasswordRequirementState(password: string) {
  return [
    {
      id: 'length',
      label: 'Minimo 8 caracteres',
      isMet: password.length >= 8,
    },
    {
      id: 'max',
      label: 'Maximo 72 caracteres',
      isMet: password.length > 0 && password.length <= 72,
    },
    {
      id: 'lowercase',
      label: 'Una letra minuscula',
      isMet: /[a-z]/.test(password),
    },
    {
      id: 'uppercase',
      label: 'Una letra mayuscula',
      isMet: /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: 'Un numero',
      isMet: /[0-9]/.test(password),
    },
  ]
}

export function validateResetPasswordForm(
  values: ResetPasswordFormValues,
): ResetPasswordFormErrors {
  const errors: ResetPasswordFormErrors = {}

  const unmetRequirement = getPasswordRequirementState(values.password).find(
    (requirement) => !requirement.isMet,
  )

  if (!values.password) {
    errors.password = 'La contrasena es obligatoria.'
  } else if (unmetRequirement) {
    errors.password = unmetRequirement.label
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contrasena.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contrasenas no coinciden.'
  }

  return errors
}
