import { Link } from 'react-router-dom'
import type { Turma } from '../types/turma.types'

interface TurmaCardProps {
  turma: Turma
}

export function TurmaCard({ turma }: TurmaCardProps) {
  return (
    <article className="turma-card">
      <div className="turma-card-header">
        <h2>{turma.nome}</h2>
        <span className="turma-status">{turma.status}</span>
      </div>

      <p>{turma.descricao || 'Sem descrição informada.'}</p>

      <dl className="turma-meta">
        <div>
          <dt>Código da turma</dt>
          <dd>{turma.codigoEntrada}</dd>
        </div>
        <div>
          <dt>Professor</dt>
          <dd>{turma.professorNome}</dd>
        </div>
      </dl>

      <Link className="text-link" to={`/professor/turmas/${turma.id}`}>
        Acessar turma
      </Link>
    </article>
  )
}
