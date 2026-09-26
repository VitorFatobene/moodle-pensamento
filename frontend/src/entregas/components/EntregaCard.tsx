import type { EntregaAtividade, NotaEntregaRequest } from '../types/entrega.types'
import { NotaForm } from './NotaForm'

interface EntregaCardProps {
  entrega: EntregaAtividade
  isSubmittingNota: boolean
  onSubmitNota: (entregaId: number, dados: NotaEntregaRequest) => Promise<void>
}

export function EntregaCard({
  entrega,
  isSubmittingNota,
  onSubmitNota,
}: EntregaCardProps) {
  return (
    <article className="turma-card">
      <div className="turma-card-header">
        <h2>{entrega.alunoNome}</h2>
        <span className="turma-status">{entrega.status}</span>
      </div>

      <dl className="turma-meta">
        <div>
          <dt>Entrega</dt>
          <dd>
            {entrega.linkEntrega ? (
              <a
                className="text-link"
                href={entrega.linkEntrega}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir link
              </a>
            ) : (
              'Sem link enviado'
            )}
          </dd>
        </div>
        <div>
          <dt>Conclusão</dt>
          <dd>{formatarDataConclusao(entrega.dataConclusao)}</dd>
        </div>
        <div>
          <dt>Nota atual</dt>
          <dd>{formatarNota(entrega.nota)}</dd>
        </div>
      </dl>

      <NotaForm
        key={`${entrega.id}-${entrega.nota ?? 'sem-nota'}`}
        initialNota={entrega.nota}
        isSubmitting={isSubmittingNota}
        onSubmit={(dados) => onSubmitNota(entrega.id, dados)}
      />
    </article>
  )
}

function formatarDataConclusao(value: string | null): string {
  if (!value) {
    return 'Não concluída'
  }

  const data = new Date(value)

  if (Number.isNaN(data.getTime())) {
    return value
  }

  return data.toLocaleString('pt-BR')
}

function formatarNota(value: number | null): string {
  if (value === null) {
    return 'Sem nota'
  }

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}
