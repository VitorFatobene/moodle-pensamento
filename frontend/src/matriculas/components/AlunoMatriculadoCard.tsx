import type { Matricula } from '../types/matricula.types'

interface AlunoMatriculadoCardProps {
  matricula: Matricula
  isRemoving: boolean
  onRemove: (alunoId: number) => void
}

export function AlunoMatriculadoCard({
  matricula,
  isRemoving,
  onRemove,
}: AlunoMatriculadoCardProps) {
  return (
    <article className="turma-card">
      <div className="turma-card-header">
        <h2>{matricula.alunoNome}</h2>
        <span className="turma-status">{matricula.status}</span>
      </div>

      <dl className="turma-meta">
        <div>
          <dt>Entrada</dt>
          <dd>{formatarDataEntrada(matricula.dataEntrada)}</dd>
        </div>
      </dl>

      <button
        type="button"
        disabled={isRemoving}
        onClick={() => onRemove(matricula.alunoId)}
      >
        {isRemoving ? 'Removendo...' : 'Remover da turma'}
      </button>
    </article>
  )
}

function formatarDataEntrada(dataEntrada: string): string {
  const data = new Date(dataEntrada)

  if (Number.isNaN(data.getTime())) {
    return dataEntrada
  }

  return data.toLocaleString('pt-BR')
}
