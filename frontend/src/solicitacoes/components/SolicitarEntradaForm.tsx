import { type FormEvent, useState } from 'react'
import type { Turma } from '../../turmas/types/turma.types'

interface SolicitarEntradaFormProps {
  turmas: Turma[]
  isLoadingTurmas: boolean
  isSubmitting: boolean
  onSubmit: (turmaId: number) => Promise<void>
}

export function SolicitarEntradaForm({
  turmas,
  isLoadingTurmas,
  isSubmitting,
  onSubmit,
}: SolicitarEntradaFormProps) {
  const [turmaId, setTurmaId] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsedTurmaId = Number(turmaId)

    if (!Number.isInteger(parsedTurmaId) || parsedTurmaId <= 0) {
      setValidationError('Selecione uma turma.')
      return
    }

    setValidationError(null)

    try {
      await onSubmit(parsedTurmaId)
    } catch {
      return
    }

    setTurmaId('')
  }

  return (
    <form className="turma-form" onSubmit={handleSubmit}>
      <label>
        Turma
        <select
          value={turmaId}
          onChange={(event) => setTurmaId(event.target.value)}
          disabled={isSubmitting || isLoadingTurmas || turmas.length === 0}
          required
        >
          <option value="">
            {isLoadingTurmas ? 'Carregando turmas...' : 'Selecione uma turma'}
          </option>
          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome} - {turma.professorNome}
            </option>
          ))}
        </select>
      </label>

      {validationError ? <p className="form-error">{validationError}</p> : null}

      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting || isLoadingTurmas || turmas.length === 0}
        >
          {isSubmitting ? 'Enviando...' : 'Solicitar entrada'}
        </button>
      </div>
    </form>
  )
}
