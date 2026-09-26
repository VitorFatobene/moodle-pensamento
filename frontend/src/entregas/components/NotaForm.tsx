import { type FormEvent, useState } from 'react'
import type { NotaEntregaRequest } from '../types/entrega.types'

interface NotaFormProps {
  initialNota: number | null
  isSubmitting: boolean
  onSubmit: (dados: NotaEntregaRequest) => Promise<void>
}

export function NotaForm({ initialNota, isSubmitting, onSubmit }: NotaFormProps) {
  const [nota, setNota] = useState(initialNota === null ? '' : String(initialNota))
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!nota.trim()) {
      setValidationError('Informe a nota.')
      return
    }

    const parsed = Number(nota)

    if (Number.isNaN(parsed)) {
      setValidationError('Informe uma nota válida.')
      return
    }

    if (parsed < 0) {
      setValidationError('A nota não pode ser negativa.')
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
    <form className="turma-form" onSubmit={handleSubmit}>
      <label>
        Nota
        <input
          type="number"
          min="0"
          step="0.01"
          value={nota}
          onChange={(event) => setNota(event.target.value)}
          disabled={isSubmitting}
        />
      </label>

      {validationError ? <p className="form-error">{validationError}</p> : null}

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar nota'}
        </button>
      </div>
    </form>
  )
}
