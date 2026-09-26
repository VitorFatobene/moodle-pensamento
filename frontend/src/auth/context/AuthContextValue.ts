import { createContext } from 'react'
import type { UsuarioAutenticado } from '../types/auth.types'

export interface AuthContextData {
  user: UsuarioAutenticado | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextData | null>(null)
