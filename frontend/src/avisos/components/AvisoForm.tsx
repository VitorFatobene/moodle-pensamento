import { type FormEvent, useState } from 'react'
import type { AvisoRequest } from '../types/aviso.types'

interface AvisoFormProps {
  initialValues?: AvisoRequest
  isSubmitting: boolean
  submitLabel: string
  onCancel: () => void
  onSubmit: (dados: AvisoRequest) => Promise<void>
}

export function AvisoForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
}: AvisoFormProps) {
  const [titulo, setTitulo] = useState(initialValues?.titulo ?? '')
  const [conteudo, setConteudo] = useState(initialValues?.conteudo ?? '')
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!titulo.trim()) {
      setValidationError('Informe o título do aviso.')
      return
    }

    if (!conteudo.trim()) {
      setValidationError('Informe o conteúdo do aviso.')
      return
    }

    setValidationError(null)

    try {
      await onSubmit({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
      })
    } catch {
      return
    }

    setTitulo('')
    setConteudo('')
  }

  return (
    <form className="turma-form" onSubmit={handleSubmit}>
      <label>
        Título
        <input
          type="text"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          disabled={isSubmitting}
          required
        />
      </label>

      <label>
        Conteúdo
        <textarea
          value={conteudo}
          onChange={(event) => setConteudo(event.target.value)}
          disabled={isSubmitting}
          rows={5}
          required
        />
      </label>

      {validationError ? <p className="form-error">{validationError}</p> : null}

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
