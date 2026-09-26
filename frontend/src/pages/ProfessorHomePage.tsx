import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'

export function ProfessorHomePage() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <main>
      <h1>Área do Professor</h1>
      <p>{user ? `Bem-vindo, ${user.nome}.` : 'Sessão de professor.'}</p>
      <button type="button" onClick={handleLogout}>
        Sair
      </button>
    </main>
  )
}
