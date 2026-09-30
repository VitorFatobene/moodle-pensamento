import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/StatusBadge'
import type { Matricula } from '../../matriculas/types/matricula.types'

interface AlunoTurmaCardProps {
  matricula: Matricula
}

export function AlunoTurmaCard({ matricula }: AlunoTurmaCardProps) {
  return (
    <article className="turma-card">
      <div className="turma-card-header">
        <div className="turma-card-title">
          <h2>{matricula.turmaNome}</h2>
          <p>Turma matriculada</p>
        </div>
        <StatusBadge value={matricula.status} />
      </div>

      <dl className="turma-meta">
        <div>
          <dt>Entrada</dt>
          <dd>{formatarData(matricula.dataEntrada)}</dd>
        </div>
      </dl>

      <div className="turma-card-actions">
        <Link className="text-link" to={`/aluno/turmas/${matricula.turmaId}`}>
          Acessar turma
        </Link>
      </div>
    </article>
  )
}

function formatarData(value: string): string {
  const data = new Date(value)

  if (Number.isNaN(data.getTime())) {
    return value
  }

  return data.toLocaleString('pt-BR')
}
