import type { Aviso } from '../types/aviso.types'

interface AvisoCardProps {
  aviso: Aviso
  isProcessing?: boolean
  onEdit?: (aviso: Aviso) => void
  onDelete?: (avisoId: number) => void
}

export function AvisoCard({ aviso, isProcessing, onEdit, onDelete }: AvisoCardProps) {
  return (
    <article className="turma-card">
      <div className="turma-card-header">
        <h2>{aviso.titulo}</h2>
        <span className="turma-status">{aviso.status}</span>
      </div>

      <p>{aviso.conteudo}</p>

      <dl className="turma-meta">
        <div>
          <dt>Professor</dt>
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
        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            disabled={isProcessing}
            onClick={() => onEdit(aviso)}
          >
            Editar
          </button>
          <button
            type="button"
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
