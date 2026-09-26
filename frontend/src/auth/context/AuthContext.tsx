import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as authService from '../services/authService'
import {
  clearAuth,
  getToken,
  getUser,
  setToken,
  setUser,
} from '../services/authStorage'
import type { UsuarioAutenticado } from '../types/auth.types'
import { AuthContext, type AuthContextData } from './AuthContextValue'

interface AuthProviderProps {
  children: ReactNode
}

interface AuthState {
  user: UsuarioAutenticado | null
  token: string | null
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(() => getInitialAuthState())

  const login = useCallback(async (email: string, senha: string) => {
    const response = await authService.login({ email, senha })
    const authenticatedUser: UsuarioAutenticado = {
      id: response.usuarioId,
      nome: response.nome,
      email: response.email,
      tipoUsuario: response.tipoUsuario,
    }

    setToken(response.token)
    setUser(authenticatedUser)
    setAuthState({
      user: authenticatedUser,
      token: response.token,
    })
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setAuthState({
      user: null,
      token: null,
    })
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      setAuthState({
        user: null,
        token: null,
      })
    }

    window.addEventListener('moodle:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('moodle:unauthorized', handleUnauthorized)
    }
  }, [])

  const value = useMemo<AuthContextData>(
    () => ({
      user: authState.user,
      token: authState.token,
      isAuthenticated: Boolean(authState.user && authState.token),
      isLoading: false,
      login,
      logout,
    }),
    [authState, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function getInitialAuthState(): AuthState {
  const storedToken = getToken()
  const storedUser = getUser()

  if (storedToken && storedUser) {
    return {
      user: storedUser,
      token: storedToken,
    }
  }

  clearAuth()

  return {
    user: null,
    token: null,
  }
}
