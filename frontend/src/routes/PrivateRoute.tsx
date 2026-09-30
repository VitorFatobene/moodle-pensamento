import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import type { TipoUsuario } from '../auth/types/auth.types'

interface PrivateRouteProps {
  children: ReactNode
  allowedTipoUsuario?: TipoUsuario
}

export function PrivateRoute({ children, allowedTipoUsuario }: PrivateRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <main className="auth-page">
        <LoadingState>Carregando sessão...</LoadingState>
      </main>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedTipoUsuario && user.tipoUsuario !== allowedTipoUsuario) {
    const fallbackPath = user.tipoUsuario === 'PROFESSOR' ? '/professor' : '/aluno'
    return <Navigate to={fallbackPath} replace />
  }

  return children
}
