import { type FormEvent, useState } from 'react'
import type { CriarTurmaRequest } from '../types/turma.types'

interface CriarTurmaFormProps {
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (dados: CriarTurmaRequest) => Promise<void>
}

export function CriarTurmaForm({
  isSubmitting,
  onCancel,
  onSubmit,
}: CriarTurmaFormProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!nome.trim()) {
      setValidationError('Informe o nome da turma.')
      return
    }

    setValidationError(null)

    try {
      await onSubmit({
        nome: nome.trim(),
        descricao: descricao.trim(),
      })
    } catch {
      return
    }

    setNome('')
    setDescricao('')
  }

  return (
    <form className="turma-form" onSubmit={handleSubmit}>
      <label htmlFor="turma-nome">
        Nome
        <input
          id="turma-nome"
          type="text"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          disabled={isSubmitting}
          placeholder="Ex.: Pensamento Computacional"
          required
        />
      </label>

      <label htmlFor="turma-descricao">
        Descrição
        <textarea
          id="turma-descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          disabled={isSubmitting}
          placeholder="Informe uma breve descrição para orientar os alunos."
          rows={4}
        />
      </label>

      {validationError ? <p className="form-error">{validationError}</p> : null}

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar turma'}
        </button>
      </div>
    </form>
  )
}
