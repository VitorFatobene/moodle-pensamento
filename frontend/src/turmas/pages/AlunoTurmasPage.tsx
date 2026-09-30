import { useCallback, useEffect, useState } from 'react'
import { EmptyState } from '../../components/EmptyState'
import { LoadingState } from '../../components/LoadingState'
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
      <header className="page-header turmas-page-header">
        <div>
          <h1>Minhas turmas</h1>
          <p>Acesse seus espaços de estudo, avisos e atividades em andamento.</p>
        </div>
      </header>

      {isLoading ? (
        <section className="section-panel">
          <LoadingState>Carregando turmas...</LoadingState>
        </section>
      ) : null}

      {!isLoading && loadError ? (
        <section className="section-panel">
          <p className="form-error">{loadError}</p>
          <button type="button" onClick={() => void carregarTurmas()}>
            Tentar novamente
          </button>
        </section>
      ) : null}

      {!isLoading && !loadError && matriculas.length === 0 ? (
        <section className="section-panel empty-workspace">
          <EmptyState>
            Você ainda não está matriculado em nenhuma turma.
          </EmptyState>
        </section>
      ) : null}

      {!isLoading && !loadError && matriculas.length > 0 ? (
        <>
          <section className="turmas-summary" aria-label="Resumo de turmas">
            <span>
              {matriculas.length}{' '}
              {matriculas.length === 1 ? 'turma encontrada' : 'turmas encontradas'}
            </span>
            <span>Entre em uma turma para consultar avisos e atividades.</span>
          </section>

          <section className="turmas-grid" aria-label="Lista de turmas do aluno">
            {matriculas.map((matricula) => (
              <AlunoTurmaCard key={matricula.id} matricula={matricula} />
            ))}
          </section>
        </>
      ) : null}
    </main>
  )
}
