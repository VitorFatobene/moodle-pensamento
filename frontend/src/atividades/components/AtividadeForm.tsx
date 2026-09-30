import { type FormEvent, type RefObject, useRef, useState } from 'react'
import type { AtividadeRequest } from '../types/atividade.types'

interface AtividadeFormProps {
  initialValues?: AtividadeRequest
  isSubmitting: boolean
  submitLabel: string
  onCancel: () => void
  onSubmit: (dados: AtividadeRequest) => Promise<void>
}

type ValidationField = 'titulo' | 'descricao' | 'dataLimite' | 'notaMaxima'

interface ValidationError {
  field: ValidationField
  message: string
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
  const [validationError, setValidationError] = useState<ValidationError | null>(null)
  const tituloRef = useRef<HTMLInputElement>(null)
  const descricaoRef = useRef<HTMLTextAreaElement>(null)
  const dataLimiteRef = useRef<HTMLInputElement>(null)
  const notaMaximaRef = useRef<HTMLInputElement>(null)

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
      showValidationError('titulo', 'Informe o título da atividade.', tituloRef)
      return null
    }

    if (!descricao.trim()) {
      showValidationError(
        'descricao',
        'Informe a descrição da atividade.',
        descricaoRef,
      )
      return null
    }

    if (dataLimite && !isValidDatetimeLocal(dataLimite)) {
      showValidationError(
        'dataLimite',
        'Informe uma data limite válida.',
        dataLimiteRef,
      )
      return null
    }

    const notaMaximaRequest = parseNotaMaxima(notaMaxima)

    if (notaMaximaRequest.status === 'invalid') {
      showValidationError('notaMaxima', notaMaximaRequest.message, notaMaximaRef)
      return null
    }

    return {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      dataLimite: toBackendLocalDateTime(dataLimite),
      notaMaxima: notaMaximaRequest.value,
    }
  }

  function showValidationError(
    field: ValidationField,
    message: string,
    ref: RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
  ) {
    setValidationError({ field, message })
    requestAnimationFrame(() => ref.current?.focus())
  }

  function clearFieldError(field: ValidationField) {
    setValidationError((currentError) =>
      currentError?.field === field ? null : currentError,
    )
  }

  function fieldErrorId(field: ValidationField): string | undefined {
    return validationError?.field === field ? `atividade-${field}-error` : undefined
  }

  return (
    <form className="turma-form atividade-form" onSubmit={handleSubmit} noValidate>
      <label>
        Título
        <input
          ref={tituloRef}
          type="text"
          value={titulo}
          onChange={(event) => {
            setTitulo(event.target.value)
            clearFieldError('titulo')
          }}
          disabled={isSubmitting}
          aria-invalid={validationError?.field === 'titulo'}
          aria-describedby={fieldErrorId('titulo')}
          required
        />
        {validationError?.field === 'titulo' ? (
          <span id="atividade-titulo-error" className="field-error" role="alert">
            {validationError.message}
          </span>
        ) : null}
      </label>

      <label>
        Descrição
        <textarea
          ref={descricaoRef}
          value={descricao}
          onChange={(event) => {
            setDescricao(event.target.value)
            clearFieldError('descricao')
          }}
          disabled={isSubmitting}
          aria-invalid={validationError?.field === 'descricao'}
          aria-describedby={fieldErrorId('descricao')}
          rows={5}
          required
        />
        {validationError?.field === 'descricao' ? (
          <span id="atividade-descricao-error" className="field-error" role="alert">
            {validationError.message}
          </span>
        ) : null}
      </label>

      <div className="atividade-form__rules">
        <label>
          Data limite
          <input
            ref={dataLimiteRef}
            type="datetime-local"
            value={dataLimite}
            onChange={(event) => {
              setDataLimite(event.target.value)
              clearFieldError('dataLimite')
            }}
            disabled={isSubmitting}
            aria-invalid={validationError?.field === 'dataLimite'}
            aria-describedby={
              validationError?.field === 'dataLimite'
                ? 'atividade-data-hint atividade-dataLimite-error'
                : 'atividade-data-hint'
            }
          />
          <span id="atividade-data-hint" className="field-hint">
            Opcional. O prazo usa o horário local informado.
          </span>
          {validationError?.field === 'dataLimite' ? (
            <span id="atividade-dataLimite-error" className="field-error" role="alert">
              {validationError.message}
            </span>
          ) : null}
        </label>

        <label>
          Nota máxima
          <input
            ref={notaMaximaRef}
            type="number"
            min="0.01"
            step="0.01"
            value={notaMaxima}
            onChange={(event) => {
              setNotaMaxima(event.target.value)
              clearFieldError('notaMaxima')
            }}
            disabled={isSubmitting}
            aria-invalid={validationError?.field === 'notaMaxima'}
            aria-describedby={
              validationError?.field === 'notaMaxima'
                ? 'atividade-nota-hint atividade-notaMaxima-error'
                : 'atividade-nota-hint'
            }
          />
          <span id="atividade-nota-hint" className="field-hint">
            Opcional. Use um valor maior que zero.
          </span>
          {validationError?.field === 'notaMaxima' ? (
            <span id="atividade-notaMaxima-error" className="field-error" role="alert">
              {validationError.message}
            </span>
          ) : null}
        </label>
      </div>

      <div className="form-actions atividade-form__actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
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

  if (!Number.isFinite(parsed)) {
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

  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) {
    return {
      status: 'invalid',
      message: 'Use no máximo duas casas decimais na nota máxima.',
    }
  }

  return {
    status: 'valid',
    value: parsed,
  }
}
