import { type FormEvent, useState } from 'react'
import type {
  EntregaAtividade,
  EntregaAtividadeRequest,
} from '../types/entrega.types'

interface MinhaEntregaSectionProps {
  entrega: EntregaAtividade | null
  notaMaxima: number | null
  isLoading: boolean
  isSaving: boolean
  isConcluding: boolean
  errorMessage: string | null
  feedbackMessage: string | null
  onSave: (dados: EntregaAtividadeRequest) => Promise<void>
  onConclude: () => Promise<void>
}

export function MinhaEntregaSection({
  entrega,
  notaMaxima,
  isLoading,
  isSaving,
  isConcluding,
  errorMessage,
  feedbackMessage,
  onSave,
  onConclude,
}: MinhaEntregaSectionProps) {
  const [linkEntrega, setLinkEntrega] = useState(entrega?.linkEntrega ?? '')
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedLink = linkEntrega.trim()

    if (trimmedLink && !isUrlValida(trimmedLink)) {
      setValidationError('Informe uma URL válida.')
      return
    }

    setValidationError(null)

    try {
      await onSave({
        linkEntrega: trimmedLink || null,
      })
    } catch {
      return
    }
  }

  async function handleConcluir() {
    const confirmado = window.confirm('Deseja marcar esta atividade como concluída?')

    if (!confirmado) {
      return
    }

    try {
      await onConclude()
    } catch {
      return
    }
  }

  return (
    <section className="section-panel">
      <h2>Minha entrega</h2>

      {isLoading ? <p>Carregando entrega...</p> : null}
      {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

      {!isLoading ? (
        <>
          {entrega ? (
            <dl className="turma-meta">
              <div>
                <dt>Status</dt>
                <dd>{entrega.status}</dd>
              </div>
              <div>
                <dt>Link enviado</dt>
                <dd>
                  {entrega.linkEntrega ? (
                    <a
                      className="text-link"
                      href={entrega.linkEntrega}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir entrega
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
                <dt>Nota</dt>
                <dd>{formatarNota(entrega.nota, notaMaxima)}</dd>
              </div>
            </dl>
          ) : (
            <p>Você ainda não enviou uma entrega.</p>
          )}

          <form className="turma-form" onSubmit={handleSubmit}>
            <label>
              Link da entrega
              <input
                type="url"
                value={linkEntrega}
                onChange={(event) => setLinkEntrega(event.target.value)}
                disabled={isSaving}
                placeholder="https://..."
              />
            </label>

            {validationError ? <p className="form-error">{validationError}</p> : null}

            <div className="form-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar entrega'}
              </button>
            </div>
          </form>

          {entrega?.status === 'CONCLUIDA' ? (
            <p>Atividade concluída.</p>
          ) : (
            <div className="form-actions">
              <button type="button" disabled={isConcluding} onClick={handleConcluir}>
                {isConcluding ? 'Concluindo...' : 'Marcar como concluída'}
              </button>
            </div>
          )}
        </>
      ) : null}
    </section>
  )
}

function isUrlValida(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
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

function formatarNota(nota: number | null, notaMaxima: number | null): string {
  if (nota === null) {
    return 'Nota ainda não atribuída.'
  }

  const notaFormatada = formatarNumero(nota)

  if (notaMaxima === null) {
    return `Nota: ${notaFormatada}`
  }

  return `Nota: ${notaFormatada} / ${formatarNumero(notaMaxima)}`
}

function formatarNumero(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}
