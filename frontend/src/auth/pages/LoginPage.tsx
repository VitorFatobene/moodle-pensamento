import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useAuth } from '../hooks/useAuth'
import { getUser } from '../services/authStorage'
import type { TipoUsuario } from '../types/auth.types'

export function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, login, user } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      navigate(getRedirectPath(user.tipoUsuario), { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await login(email, senha)
      const authenticatedUser = getUser()

      if (authenticatedUser) {
        navigate(getRedirectPath(authenticatedUser.tipoUsuario), { replace: true })
      }
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h1>Login</h1>
          <p>Acesse sua conta para continuar.</p>
        </div>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}

function getRedirectPath(tipoUsuario: TipoUsuario): string {
  return tipoUsuario === 'PROFESSOR' ? '/professor' : '/aluno'
}

function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.status === 401) {
    return 'Email ou senha inválidos.'
  }

  return 'Não foi possível realizar o login.'
}
