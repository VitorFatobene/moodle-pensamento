import { useState } from 'react'

interface TurmaAccessCodeProps {
  code: string
}

export function TurmaAccessCode({ code }: TurmaAccessCodeProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1800)
    } catch {
      setCopyState('error')
      window.setTimeout(() => setCopyState('idle'), 2200)
    }
  }

  const feedback =
    copyState === 'copied'
      ? 'Copiado'
      : copyState === 'error'
        ? 'Não foi possível copiar'
        : null

  return (
    <div className="turma-code">
      <div>
        <span className="turma-code-label">Código da turma</span>
        <strong>{code}</strong>
      </div>
      <button
        type="button"
        className="secondary-button turma-code-button"
        onClick={handleCopy}
        aria-label={`Copiar código ${code}`}
      >
        Copiar
      </button>
      {feedback ? (
        <span className="turma-code-feedback" aria-live="polite">
          {feedback}
        </span>
      ) : null}
    </div>
  )
}
