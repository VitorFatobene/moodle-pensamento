import { StatusBadge } from '../../components/StatusBadge'
import type { EntregaAtividade, NotaEntregaRequest } from '../types/entrega.types'
import { NotaForm } from './NotaForm'

interface EntregaCardProps {
  entrega: EntregaAtividade
  notaMaxima: number | null
  isSubmittingNota: boolean
  isOperationBlocked: boolean
  feedbackMessage: string | null
  errorMessage: string | null
  onSubmitNota: (entregaId: number, dados: NotaEntregaRequest) => Promise<void>
}

export function EntregaCard({
  entrega,
  notaMaxima,
  isSubmittingNota,
  isOperationBlocked,
  feedbackMessage,
  errorMessage,
  onSubmitNota,
}: EntregaCardProps) {
  return (
    <article className="entrega-card" role="listitem" aria-busy={isSubmittingNota}>
      <header className="entrega-card__header">
        <div>
          <h2>{entrega.alunoNome}</h2>
          <p>{entrega.nota === null ? 'Correção pendente' : 'Correção registrada'}</p>
        </div>
        <StatusBadge value={entrega.status} />
      </header>

      <div className="entrega-card__body">
        <section className="entrega-evidence" aria-labelledby={`entrega-${entrega.id}-evidencia`}>
          <div className="entrega-section-heading">
            <div>
              <h3 id={`entrega-${entrega.id}-evidencia`}>Entrega do aluno</h3>
              <p>{formatarDataConclusao(entrega.dataConclusao)}</p>
            </div>

            {entrega.linkEntrega ? (
              <a
                className="entrega-open-link"
                href={entrega.linkEntrega}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir entrega
              </a>
            ) : null}
          </div>

          {!entrega.linkEntrega ? (
            <p className="entrega-missing-link">Nenhum link foi enviado para esta atividade.</p>
          ) : null}
        </section>

        <NotaForm
          key={`${entrega.id}-${entrega.nota ?? 'sem-nota'}`}
          initialNota={entrega.nota}
          notaMaxima={notaMaxima}
          isSubmitting={isSubmittingNota}
          isDisabled={isOperationBlocked}
          feedbackMessage={feedbackMessage}
          errorMessage={errorMessage}
          onSubmit={(dados) => onSubmitNota(entrega.id, dados)}
        />
      </div>
    </article>
  )
}

function formatarDataConclusao(value: string | null): string {
  if (!value) {
    return 'O aluno ainda não marcou a atividade como concluída.'
  }

  const data = new Date(value)

  if (Number.isNaN(data.getTime())) {
    return value
  }

  return `Concluída em ${data.toLocaleString('pt-BR')}`
}
