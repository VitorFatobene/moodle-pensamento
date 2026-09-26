import { type FormEvent, useState } from 'react'
import type { AtividadeRequest } from '../types/atividade.types'

interface AtividadeFormProps {
  initialValues?: AtividadeRequest
  isSubmitting: boolean
  submitLabel: string
  onCancel: () => void
  onSubmit: (dados: AtividadeRequest) => Promise<void>
}

export function AtividadeForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
}: AtividadeFormProps) {
  const [titulo, setTitulo] = useState(initialValues?.titulo ?? '')
  const [descricao, setDescricao] = useState(initialValues?.descricao ?? '')
  const [dataLimite, setDataLimite] = useState(
    toDatetimeLocalValue(initialValues?.dataLimite ?? null),
  )
  const [notaMaxima, setNotaMaxima] = useState(
    initialValues?.notaMaxima === null || initialValues?.notaMaxima === undefined
      ? ''
      : String(initialValues.notaMaxima),
  )
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const request = buildRequest()

    if (!request) {
      return
    }

    setValidationError(null)

    try {
      await onSubmit(request)
    } catch {
      return
    }

    setTitulo('')
    setDescricao('')
    setDataLimite('')
    setNotaMaxima('')
  }

  function buildRequest(): AtividadeRequest | null {
    if (!titulo.trim()) {
      setValidationError('Informe o título da atividade.')
      return null
    }

    if (!descricao.trim()) {
      setValidationError('Informe a descrição da atividade.')
      return null
    }

    if (dataLimite && !isValidDatetimeLocal(dataLimite)) {
      setValidationError('Informe uma data limite válida.')
      return null
    }

    const notaMaximaRequest = parseNotaMaxima(notaMaxima)

    if (notaMaximaRequest.status === 'invalid') {
      setValidationError(notaMaximaRequest.message)
      return null
    }

    return {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      dataLimite: toBackendLocalDateTime(dataLimite),
      notaMaxima: notaMaximaRequest.value,
    }
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
        Descrição
        <textarea
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          disabled={isSubmitting}
          rows={5}
          required
        />
      </label>

      <label>
        Data limite
        <input
          type="datetime-local"
          value={dataLimite}
          onChange={(event) => setDataLimite(event.target.value)}
          disabled={isSubmitting}
        />
      </label>

      <label>
        Nota máxima
        <input
          type="number"
          min="0"
          step="0.01"
          value={notaMaxima}
          onChange={(event) => setNotaMaxima(event.target.value)}
          disabled={isSubmitting}
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

function toDatetimeLocalValue(value: string | null): string {
  if (!value) {
    return ''
  }

  return value.length >= 16 ? value.slice(0, 16) : value
}

function toBackendLocalDateTime(value: string): string | null {
  if (!value) {
    return null
  }

  return value.length === 16 ? `${value}:00` : value
}

function isValidDatetimeLocal(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
}

type NotaMaximaParseResult =
  | {
      status: 'valid'
      value: number | null
    }
  | {
      status: 'invalid'
      message: string
    }

function parseNotaMaxima(value: string): NotaMaximaParseResult {
  if (!value.trim()) {
    return {
      status: 'valid',
      value: null,
    }
  }

  const parsed = Number(value)

  if (Number.isNaN(parsed)) {
    return {
      status: 'invalid',
      message: 'Informe uma nota máxima válida.',
    }
  }

  if (parsed <= 0) {
    return {
      status: 'invalid',
      message: 'Informe uma nota máxima maior que zero.',
    }
  }

  return {
    status: 'valid',
    value: parsed,
  }
}
