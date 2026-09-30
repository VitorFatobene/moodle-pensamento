import { type FormEvent, useId, useState } from 'react'
import { StatusBadge } from '../../components/StatusBadge'
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
  loadErrorMessage: string | null
  errorMessage: string | null
  feedbackMessage: string | null
  onSave: (dados: EntregaAtividadeRequest) => Promise<void>
  onConclude: () => Promise<void>
  onRetryLoad: () => void
}

export function MinhaEntregaSection({
  entrega,
  notaMaxima,
  isLoading,
  isSaving,
  isConcluding,
  loadErrorMessage,
  errorMessage,
  feedbackMessage,
  onSave,
  onConclude,
  onRetryLoad,
}: MinhaEntregaSectionProps) {
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()
  const [linkEntrega, setLinkEntrega] = useState(entrega?.linkEntrega ?? '')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isConfirmingConclusion, setIsConfirmingConclusion] = useState(false)
  const isBusy = isSaving || isConcluding
  const savedLink = entrega?.linkEntrega?.trim() ?? ''
  const currentLink = linkEntrega.trim()
  const hasUnsavedChanges = currentLink !== savedLink
  const isConcluded = entrega?.status === 'CONCLUIDA'
  const describedBy = validationError ? `${hintId} ${errorId}` : hintId

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (currentLink && !isUrlValida(currentLink)) {
      setValidationError('Informe uma URL válida iniciada por http:// ou https://.')
      return
    }

    if (currentLink.length > 255) {
      setValidationError('O link deve ter no máximo 255 caracteres.')
      return
    }

    setValidationError(null)
    setIsConfirmingConclusion(false)

    try {
      await onSave({
        linkEntrega: currentLink || null,
      })
    } catch {
      return
    }
  }

  async function handleConcluir() {
    if (hasUnsavedChanges || isBusy) {
      return
    }

    try {
      await onConclude()
      setIsConfirmingConclusion(false)
    } catch {
      return
    }
  }

  if (isLoading) {
    return (
      <section className="section-panel minha-entrega-panel" aria-labelledby="minha-entrega-title">
        <h2 id="minha-entrega-title">Minha entrega</h2>
        <p className="loading-state" role="status">
          Carregando entrega...
        </p>
      </section>
    )
  }

  if (loadErrorMessage) {
    return (
      <section className="section-panel minha-entrega-panel" aria-labelledby="minha-entrega-title">
        <header className="minha-entrega-header">
          <div>
            <h2 id="minha-entrega-title">Minha entrega</h2>
            <p>Não é seguro alterar ou concluir a entrega sem carregar seu estado atual.</p>
          </div>
        </header>
        <div className="entrega-load-error">
          <p className="form-error" role="alert">
            {loadErrorMessage}
          </p>
          <button type="button" onClick={onRetryLoad}>
            Tentar carregar novamente
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="section-panel minha-entrega-panel" aria-labelledby="minha-entrega-title">
      <header className="minha-entrega-header">
        <div>
          <h2 id="minha-entrega-title">Minha entrega</h2>
          <p>
            {isConcluded
              ? 'A atividade está concluída. Você ainda pode atualizar o link enquanto a turma permitir.'
              : 'Salve o link primeiro e conclua a atividade quando o envio estiver pronto.'}
          </p>
        </div>
        <StatusBadge value={entrega?.status ?? 'PENDENTE'} />
      </header>

      <div className="feedback-stack" aria-live="polite">
        {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}
        {errorMessage ? (
          <p className="form-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <dl className="minha-entrega-summary">
        <div>
          <dt>Conclusão</dt>
          <dd>{formatarDataConclusao(entrega?.dataConclusao ?? null)}</dd>
        </div>
        <div>
          <dt>Nota</dt>
          <dd>{formatarNota(entrega?.nota ?? null, notaMaxima)}</dd>
        </div>
      </dl>

      <form className="minha-entrega-editor" onSubmit={handleSubmit} noValidate>
        <div className="minha-entrega-editor__heading">
          <div>
            <h3>Link da entrega</h3>
            <p id={hintId}>Use um endereço público iniciado por http:// ou https://.</p>
          </div>
          {savedLink ? (
            <a
              className="entrega-open-link"
              href={savedLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir entrega salva
            </a>
          ) : null}
        </div>

        <label htmlFor={inputId}>
          Endereço do trabalho
          <input
            id={inputId}
            type="url"
            value={linkEntrega}
            onChange={(event) => {
              setLinkEntrega(event.target.value)
              setIsConfirmingConclusion(false)
              if (validationError) {
                setValidationError(null)
              }
            }}
            disabled={isBusy}
            maxLength={255}
            placeholder="https://..."
            aria-invalid={Boolean(validationError)}
            aria-describedby={describedBy}
          />
        </label>

        {validationError ? (
          <p id={errorId} className="field-error" role="alert">
            {validationError}
          </p>
        ) : null}

        <div className="minha-entrega-editor__actions">
          <span className={hasUnsavedChanges ? 'unsaved-indicator' : 'saved-indicator'}>
            {hasUnsavedChanges ? 'Alterações ainda não salvas' : 'Link sincronizado'}
          </span>
          <button className="secondary-button" type="submit" disabled={isBusy || !hasUnsavedChanges}>
            {isSaving ? 'Salvando...' : entrega ? 'Atualizar entrega' : 'Salvar entrega'}
          </button>
        </div>
      </form>

      {!isConcluded ? (
        <section className="entrega-conclusion" aria-labelledby="entrega-conclusion-title">
          <div>
            <h3 id="entrega-conclusion-title">Finalizar atividade</h3>
            <p>
              Marque como concluída somente depois de salvar o link que deseja enviar ao professor.
            </p>
          </div>

          {hasUnsavedChanges ? (
            <p className="info-message">Salve as alterações do link antes de concluir.</p>
          ) : null}

          {isConfirmingConclusion ? (
            <div className="entrega-confirmation" role="group" aria-label="Confirmar conclusão">
              <p>Confirma que esta entrega está pronta para avaliação?</p>
              <div className="form-actions">
                <button type="button" disabled={isBusy} onClick={() => void handleConcluir()}>
                  {isConcluding ? 'Concluindo...' : 'Confirmar conclusão'}
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  disabled={isBusy}
                  onClick={() => setIsConfirmingConclusion(false)}
                >
                  Voltar
                </button>
              </div>
            </div>
          ) : (
            <button
              className="entrega-conclusion__button"
              type="button"
              disabled={isBusy || hasUnsavedChanges}
              onClick={() => setIsConfirmingConclusion(true)}
            >
              Marcar como concluída
            </button>
          )}
        </section>
      ) : (
        <div className="entrega-completed-state" role="status">
          <strong>Entrega concluída</strong>
          <p>O professor já pode revisar o material e registrar sua nota.</p>
        </div>
      )}
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
    return 'Ainda não concluída'
  }

  const data = new Date(value)

  if (Number.isNaN(data.getTime())) {
    return value
  }

  return data.toLocaleString('pt-BR')
}

function formatarNota(nota: number | null, notaMaxima: number | null): string {
  if (nota === null) {
    return 'Ainda não atribuída'
  }

  const notaFormatada = formatarNumero(nota)

  if (notaMaxima === null) {
    return notaFormatada
  }

  return `${notaFormatada} / ${formatarNumero(notaMaxima)}`
}

function formatarNumero(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}
