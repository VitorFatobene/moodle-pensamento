import { Link } from 'react-router-dom'
import type { Atividade } from '../types/atividade.types'

interface AtividadeCardProps {
  atividade: Atividade
  isProcessing: boolean
  onEdit: (atividade: Atividade) => void
  onDelete: (atividadeId: number) => void
}

export function AtividadeCard({
  atividade,
  isProcessing,
  onEdit,
  onDelete,
}: AtividadeCardProps) {
  return (
    <article className="turma-card">
      <div className="turma-card-header">
        <h2>{atividade.titulo}</h2>
        <span className="turma-status">{atividade.status}</span>
      </div>

      <p>{atividade.descricao}</p>

      <dl className="turma-meta">
        <div>
          <dt>Data limite</dt>
          <dd>{formatarDataOpcional(atividade.dataLimite)}</dd>
        </div>
        <div>
          <dt>Nota máxima</dt>
          <dd>{formatarNota(atividade.notaMaxima)}</dd>
        </div>
        <div>
          <dt>Criada em</dt>
          <dd>{formatarData(atividade.dataCriacao)}</dd>
        </div>
      </dl>

      <div className="form-actions">
        <Link
          className="text-link"
          to={`/professor/turmas/${atividade.turmaId}/atividades/${atividade.id}/entregas`}
        >
          Ver entregas
        </Link>
        <button
          type="button"
          className="secondary-button"
          disabled={isProcessing}
          onClick={() => onEdit(atividade)}
        >
          Editar
        </button>
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => onDelete(atividade.id)}
        >
          {isProcessing ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </article>
  )
}

function formatarDataOpcional(value: string | null): string {
  return value ? formatarData(value) : 'Sem prazo definido'
}

function formatarData(value: string): string {
  const data = new Date(value)

  if (Number.isNaN(data.getTime())) {
    return value
  }

  return data.toLocaleString('pt-BR')
}

function formatarNota(value: number | null): string {
  if (value === null) {
    return 'Sem nota definida'
  }

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}
