import type { TipoUsuario, UsuarioAutenticado } from '../types/auth.types'

const TOKEN_KEY = 'moodle_token'
const USER_KEY = 'moodle_user'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function getUser(): UsuarioAutenticado | null {
  const storedUser = localStorage.getItem(USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    const parsedUser: unknown = JSON.parse(storedUser)
    return isUsuarioAutenticado(parsedUser) ? parsedUser : null
  } catch {
    return null
  }
}

export function setUser(user: UsuarioAutenticado): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY)
}

export function clearAuth(): void {
  removeToken()
  removeUser()
}

function isUsuarioAutenticado(value: unknown): value is UsuarioAutenticado {
  if (!value || typeof value !== 'object') {
    return false
  }

  const user = value as Partial<UsuarioAutenticado>

  return (
    typeof user.id === 'number' &&
    typeof user.nome === 'string' &&
    typeof user.email === 'string' &&
    isTipoUsuario(user.tipoUsuario)
  )
}

function isTipoUsuario(value: unknown): value is TipoUsuario {
  return value === 'PROFESSOR' || value === 'ALUNO'
}
