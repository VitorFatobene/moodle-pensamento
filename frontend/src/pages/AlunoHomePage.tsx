import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'

export function AlunoHomePage() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <main>
      <h1>Área do Aluno</h1>
      <p>{user ? `Bem-vindo, ${user.nome}.` : 'Sessão de aluno.'}</p>
      <Link className="text-link" to="/aluno/turmas">
        Ver turmas
      </Link>
      <Link className="text-link" to="/aluno/solicitacoes">
        Solicitações
      </Link>
      <button type="button" onClick={handleLogout}>
        Sair
      </button>
    </main>
  )
}
