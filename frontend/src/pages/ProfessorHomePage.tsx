import { Link } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'

export function ProfessorHomePage() {
  const { user } = useAuth()

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Área do Professor</h1>
          <p>{user ? `Bem-vindo, ${user.nome}.` : 'Sessão de professor.'}</p>
        </div>
      </header>

      <section className="section-panel">
        <h2>Turmas</h2>
        <p>Acesse suas turmas para gerenciar avisos, alunos, solicitações e atividades.</p>
        <div className="form-actions">
          <Link className="text-link" to="/professor/turmas">
            Ver turmas
          </Link>
        </div>
      </section>
    </main>
  )
}
