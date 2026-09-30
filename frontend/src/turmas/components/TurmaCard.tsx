import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/StatusBadge'
import { TurmaAccessCode } from './TurmaAccessCode'
import type { Turma } from '../types/turma.types'

interface TurmaCardProps {
  turma: Turma
}

export function TurmaCard({ turma }: TurmaCardProps) {
  return (
    <article className="turma-card">
      <div className="turma-card-header">
        <div className="turma-card-title">
          <h2>{turma.nome}</h2>
          <p>{turma.descricao || 'Sem descrição informada.'}</p>
        </div>
        <StatusBadge value={turma.status} />
      </div>

      <TurmaAccessCode code={turma.codigoEntrada} />

      <dl className="turma-meta">
        <div>
          <dt>Professor</dt>
          <dd>{turma.professorNome}</dd>
        </div>
      </dl>

      <div className="turma-card-actions">
        <Link className="text-link" to={`/professor/turmas/${turma.id}`}>
          Acessar turma
        </Link>
      </div>
    </article>
  )
}
