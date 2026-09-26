import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { CriarTurmaForm } from '../components/CriarTurmaForm'
import { TurmaCard } from '../components/TurmaCard'
import { criarTurma, listarTurmas } from '../services/turmaService'
import type { CriarTurmaRequest, Turma } from '../types/turma.types'

export function ProfessorTurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const carregarTurmas = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const data = await listarTurmas()
      setTurmas(data)
    } catch {
      setLoadError('Não foi possível carregar as turmas.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    listarTurmas()
      .then((data) => {
        if (isActive) {
          setTurmas(data)
        }
      })
      .catch(() => {
        if (isActive) {
          setLoadError('Não foi possível carregar as turmas.')
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

  async function handleCriarTurma(dados: CriarTurmaRequest) {
    setIsCreating(true)
    setCreateError(null)
    setFeedbackMessage(null)

    try {
      const turmaCriada = await criarTurma(dados)
      setTurmas((turmasAtuais) => [turmaCriada, ...turmasAtuais])
      setShowCreateForm(false)
      setFeedbackMessage('Turma criada com sucesso.')
    } catch (error) {
      setCreateError(getCreateErrorMessage(error))
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Minhas turmas</h1>
          <p>Gerencie as turmas que serão utilizadas nas próximas etapas.</p>
        </div>

        <button type="button" onClick={() => setShowCreateForm(true)}>
          Nova turma
        </button>
      </header>

      {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}

      {showCreateForm ? (
        <section className="section-panel">
          <h2>Nova turma</h2>
          {createError ? <p className="form-error">{createError}</p> : null}
          <CriarTurmaForm
            isSubmitting={isCreating}
            onCancel={() => {
              setShowCreateForm(false)
              setCreateError(null)
            }}
            onSubmit={handleCriarTurma}
          />
        </section>
      ) : null}

      {isLoading ? <p>Carregando turmas...</p> : null}

      {!isLoading && loadError ? (
        <div className="section-panel">
          <p className="form-error">{loadError}</p>
          <button type="button" onClick={() => void carregarTurmas()}>
            Tentar novamente
          </button>
        </div>
      ) : null}

      {!isLoading && !loadError && turmas.length === 0 ? (
        <section className="section-panel empty-state">
          <h2>Você ainda não possui turmas.</h2>
          <p>Crie uma turma para gerar o código de entrada dos alunos.</p>
          <button type="button" onClick={() => setShowCreateForm(true)}>
            Nova turma
          </button>
        </section>
      ) : null}

      {!isLoading && !loadError && turmas.length > 0 ? (
        <section className="turmas-grid" aria-label="Lista de turmas">
          {turmas.map((turma) => (
            <TurmaCard key={turma.id} turma={turma} />
          ))}
        </section>
      ) : null}
    </main>
  )
}

function getCreateErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.status === 403) {
    return 'Você não possui permissão para realizar esta ação.'
  }

  return 'Não foi possível criar a turma.'
}
