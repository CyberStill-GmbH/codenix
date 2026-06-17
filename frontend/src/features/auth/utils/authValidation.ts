import type {
  LoginFormErrors,
  LoginFormValues,
  RegisterFormErrors,
  RegisterFormValues,
} from '../types/auth.types'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (!values.email.trim()) {
    errors.email = 'El correo es obligatorio.'
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Ingresa un correo válido.'
  }

  if (!values.password.trim()) {
    errors.password = 'La contraseña es obligatoria.'
  } else if (values.password.length < 8) {
    errors.password = 'Mínimo 8 caracteres.'
  }

  return errors
}

export function validateRegisterForm(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'El nombre es obligatorio.'
  }

  if (!values.email.trim()) {
    errors.email = 'El correo es obligatorio.'
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Ingresa un correo válido.'
  }

  if (!values.password) {
    errors.password = 'La contraseña es obligatoria.'
  } else if (values.password.length < 8) {
    errors.password = 'Mínimo 8 caracteres.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.'
  }

  if (!values.terms) {
    errors.terms = 'Debes aceptar los términos para continuar.'
  }

  return errors
}
