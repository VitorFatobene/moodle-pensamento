import { Link } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'

export function AlunoHomePage() {
  const { user } = useAuth()

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Área do Aluno</h1>
          <p>{user ? `Bem-vindo, ${user.nome}.` : 'Sessão de aluno.'}</p>
        </div>
      </header>

      <section className="section-panel">
        <h2>Atalhos</h2>
        <p>Acompanhe suas turmas e solicitações de entrada em um só lugar.</p>
        <div className="form-actions">
          <Link className="text-link" to="/aluno/turmas">
            Ver turmas
          </Link>
          <Link className="text-link" to="/aluno/solicitacoes">
            Solicitações
          </Link>
        </div>
      </section>
    </main>
  )
}
