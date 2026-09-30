import { StatusBadge } from '../../components/StatusBadge'
import type { Aviso } from '../types/aviso.types'

interface AvisoCardProps {
  aviso: Aviso
  isProcessing?: boolean
  variant?: 'admin' | 'reading'
  onEdit?: (aviso: Aviso) => void
  onDelete?: (avisoId: number) => void
}

export function AvisoCard({
  aviso,
  isProcessing,
  variant,
  onEdit,
  onDelete,
}: AvisoCardProps) {
  const hasActions = Boolean(onEdit && onDelete)
  const cardVariant = variant ?? (hasActions ? 'admin' : 'reading')

  return (
    <article className={`turma-card aviso-card aviso-card--${cardVariant}`}>
      <div className="aviso-card-main">
        <div className="turma-card-header aviso-card-header">
          <h2>{aviso.titulo}</h2>
          {cardVariant === 'admin' ? <StatusBadge value={aviso.status} /> : null}
        </div>

        <p className="aviso-card-content">{aviso.conteudo}</p>
      </div>

      <dl className="turma-meta aviso-card-meta" aria-label="Informações do aviso">
        <div>
          <dt>Publicado por</dt>
          <dd>{aviso.professorNome}</dd>
        </div>
        <div>
          <dt>Criado em</dt>
          <dd>{formatarData(aviso.dataCriacao)}</dd>
        </div>
        {aviso.dataAtualizacao ? (
          <div>
            <dt>Atualizado em</dt>
            <dd>{formatarData(aviso.dataAtualizacao)}</dd>
          </div>
        ) : null}
      </dl>

      {onEdit && onDelete ? (
        <div className="form-actions aviso-card-actions" aria-label="Ações do aviso">
          <button
            type="button"
            className="ghost-button"
            disabled={isProcessing}
            onClick={() => onEdit(aviso)}
          >
            Editar
          </button>
          <button
            type="button"
            className="danger-button"
            disabled={isProcessing}
            onClick={() => onDelete(aviso.id)}
          >
            {isProcessing ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      ) : null}
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
