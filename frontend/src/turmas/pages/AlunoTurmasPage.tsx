import { useCallback, useEffect, useState } from 'react'
import { AlunoTurmaCard } from '../components/AlunoTurmaCard'
import { listarMinhasTurmas } from '../../matriculas/services/matriculaService'
import type { Matricula } from '../../matriculas/types/matricula.types'

export function AlunoTurmasPage() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const carregarTurmas = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const data = await listarMinhasTurmas()
      setMatriculas(data)
    } catch {
      setLoadError('Não foi possível carregar suas turmas.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    listarMinhasTurmas()
      .then((data) => {
        if (isActive) {
          setMatriculas(data)
        }
      })
      .catch(() => {
        if (isActive) {
          setLoadError('Não foi possível carregar suas turmas.')
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Minhas turmas</h1>
          <p>Acompanhe as turmas em que você está matriculado.</p>
        </div>
      </header>

      {isLoading ? <p>Carregando turmas...</p> : null}

      {!isLoading && loadError ? (
        <section className="section-panel">
          <p className="form-error">{loadError}</p>
          <button type="button" onClick={() => void carregarTurmas()}>
            Tentar novamente
          </button>
        </section>
      ) : null}

      {!isLoading && !loadError && matriculas.length === 0 ? (
        <section className="section-panel empty-state">
          <p>Você ainda não está matriculado em nenhuma turma.</p>
        </section>
      ) : null}

      {!isLoading && !loadError && matriculas.length > 0 ? (
        <section className="turmas-grid" aria-label="Lista de turmas do aluno">
          {matriculas.map((matricula) => (
            <AlunoTurmaCard key={matricula.id} matricula={matricula} />
          ))}
        </section>
      ) : null}
    </main>
  )
}
