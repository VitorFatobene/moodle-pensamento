import { Link } from 'react-router-dom'
import type { Matricula } from '../../matriculas/types/matricula.types'

interface AlunoTurmaCardProps {
  matricula: Matricula
}

export function AlunoTurmaCard({ matricula }: AlunoTurmaCardProps) {
  return (
    <article className="turma-card">
      <div className="turma-card-header">
        <h2>{matricula.turmaNome}</h2>
        <span className="turma-status">{matricula.status}</span>
      </div>

      <dl className="turma-meta">
        <div>
          <dt>Entrada</dt>
          <dd>{formatarData(matricula.dataEntrada)}</dd>
        </div>
      </dl>

      <Link className="text-link" to={`/aluno/turmas/${matricula.turmaId}`}>
        Acessar turma
      </Link>
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
