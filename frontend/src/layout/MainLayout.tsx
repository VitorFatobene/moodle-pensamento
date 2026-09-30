import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'

interface MainLayoutProps {
  children: ReactNode
}

interface NavItem {
  label: string
  to: string
  end?: boolean
}

const professorNavItems: NavItem[] = [
  { label: 'Início', to: '/professor', end: true },
  { label: 'Turmas', to: '/professor/turmas' },
]

const alunoNavItems: NavItem[] = [
  { label: 'Início', to: '/aluno', end: true },
  { label: 'Minhas turmas', to: '/aluno/turmas' },
  { label: 'Solicitações', to: '/aluno/solicitacoes' },
]

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const isProfessor = user?.tipoUsuario === 'PROFESSOR'
  const navItems = isProfessor ? professorNavItems : alunoNavItems
  const roleLabel = isProfessor ? 'Professor' : 'Aluno'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-layout">
      <aside className="app-sidebar" aria-label="Navegação principal">
        <NavLink className="app-brand" to={isProfessor ? '/professor' : '/aluno'}>
          <span className="app-brand-mark" aria-hidden="true">
            M
          </span>
          <span className="app-brand-text">
            <span className="app-brand-title">Moodle</span>
            <span className="app-brand-subtitle">Ambiente acadêmico</span>
          </span>
        </NavLink>

        <nav className="app-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className="app-sidebar-link"
              end={item.end}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-frame">
        <header className="app-header">
          <div className="app-header-context">
            <span className="app-header-title">Plataforma acadêmica</span>
            <span className="app-header-subtitle">
              {isProfessor
                ? 'Gestão de turmas, atividades e entregas'
                : 'Acompanhamento de turmas, atividades e notas'}
            </span>
          </div>

          <div className="app-user">
            <div className="app-user-info">
              <span className="app-user-name">{user?.nome ?? 'Usuário'}</span>
              <span className="app-user-role">{roleLabel}</span>
            </div>
            <button type="button" className="secondary-button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

        <div className="app-content">{children}</div>
      </div>
    </div>
  )
}
