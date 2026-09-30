import { NavLink } from 'react-router-dom'
import { StatusBadge } from '../../components/StatusBadge'
import { TurmaAccessCode } from './TurmaAccessCode'
import type { Turma } from '../types/turma.types'

interface TurmaHeaderProps {
  turma: Turma
}

export function TurmaHeader({ turma }: TurmaHeaderProps) {
  const basePath = `/professor/turmas/${turma.id}`

  return (
    <header className="turma-detail-header">
      <div className="turma-detail-main">
        <div className="turma-detail-title">
          <h1>{turma.nome}</h1>
          <StatusBadge value={turma.status} />
        </div>
        <p>{turma.descricao || 'Sem descrição informada.'}</p>
      </div>

      <div className="turma-detail-tools">
        <TurmaAccessCode code={turma.codigoEntrada} />
      </div>

      <dl className="turma-meta turma-detail-meta">
        <div>
          <dt>Professor</dt>
          <dd>{turma.professorNome}</dd>
        </div>
      </dl>

      <nav className="turma-tabs" aria-label="Navegação da turma">
        <NavLink end to={basePath}>
          Visão geral
        </NavLink>
        <NavLink to={`${basePath}/avisos`}>Avisos</NavLink>
        <NavLink to={`${basePath}/alunos`}>Alunos</NavLink>
        <NavLink to={`${basePath}/solicitacoes`}>Solicitações</NavLink>
        <NavLink to={`${basePath}/atividades`}>Atividades</NavLink>
      </nav>
    </header>
  )
}
