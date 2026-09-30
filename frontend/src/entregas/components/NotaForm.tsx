import { type FormEvent, useId, useState } from 'react'
import type { NotaEntregaRequest } from '../types/entrega.types'

interface NotaFormProps {
  initialNota: number | null
  notaMaxima: number | null
  isSubmitting: boolean
  isDisabled: boolean
  feedbackMessage: string | null
  errorMessage: string | null
  onSubmit: (dados: NotaEntregaRequest) => Promise<void>
}

const NOTA_LIMITE_PERSISTENCIA = 999.99

export function NotaForm({
  initialNota,
  notaMaxima,
  isSubmitting,
  isDisabled,
  feedbackMessage,
  errorMessage,
  onSubmit,
}: NotaFormProps) {
  const inputId = useId()
  const errorId = useId()
  const hintId = useId()
  const [nota, setNota] = useState(initialNota === null ? '' : String(initialNota))
  const [validationError, setValidationError] = useState<string | null>(null)
  const limiteNota = Math.min(notaMaxima ?? NOTA_LIMITE_PERSISTENCIA, NOTA_LIMITE_PERSISTENCIA)
  const describedBy = validationError ? `${hintId} ${errorId}` : hintId

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedNota = nota.trim()

    if (!normalizedNota) {
      setValidationError('Informe a nota.')
      return
    }

    const parsed = Number(normalizedNota)

    if (!Number.isFinite(parsed)) {
      setValidationError('Informe uma nota válida.')
      return
    }

    if (parsed < 0) {
      setValidationError('A nota não pode ser negativa.')
      return
    }

    if (!/^\d+(\.\d{1,2})?$/.test(normalizedNota)) {
      setValidationError('Use no máximo duas casas decimais.')
      return
    }

    if (parsed > limiteNota) {
      setValidationError(
        notaMaxima === null
          ? `A nota deve ser menor ou igual a ${formatarNumero(limiteNota)}.`
          : `A nota máxima desta atividade é ${formatarNumero(notaMaxima)}.`,
      )
      return
    }

    setValidationError(null)

    try {
      await onSubmit({ nota: parsed })
    } catch {
      return
    }
  }

  return (
    <form className="nota-form" onSubmit={handleSubmit} noValidate>
      <div className="nota-form__heading">
        <div>
          <h3>Correção</h3>
          <p id={hintId}>
            {notaMaxima === null
              ? 'Informe a nota com até duas casas decimais.'
              : `Valor permitido: de 0 a ${formatarNumero(notaMaxima)}.`}
          </p>
        </div>
        <span className={`entrega-correction-state${initialNota === null ? '' : ' entrega-correction-state--graded'}`}>
          {initialNota === null ? 'Aguardando nota' : 'Nota registrada'}
        </span>
      </div>

      <div className="nota-form__controls">
        <label htmlFor={inputId}>
          Nota
          <input
            id={inputId}
            type="number"
            min="0"
            max={limiteNota}
            step="0.01"
            inputMode="decimal"
            value={nota}
            onChange={(event) => {
              setNota(event.target.value)
              if (validationError) {
                setValidationError(null)
              }
            }}
            disabled={isDisabled}
            aria-invalid={Boolean(validationError)}
            aria-describedby={describedBy}
          />
        </label>

        <button type="submit" disabled={isDisabled}>
          {isSubmitting
            ? 'Salvando...'
            : initialNota === null
              ? 'Salvar nota'
              : 'Atualizar nota'}
        </button>
      </div>

      <div className="feedback-stack nota-form__feedback" aria-live="polite">
        {validationError ? (
          <p id={errorId} className="field-error" role="alert">
            {validationError}
          </p>
        ) : null}
        {errorMessage ? (
          <p className="form-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}
      </div>
    </form>
  )
}

function formatarNumero(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}
