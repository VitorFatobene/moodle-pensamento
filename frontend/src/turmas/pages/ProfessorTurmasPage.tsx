import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useAuth } from '../../auth/hooks/useAuth'
import { EmptyState } from '../../components/EmptyState'
import { LoadingState } from '../../components/LoadingState'
import { CriarTurmaForm } from '../components/CriarTurmaForm'
import { TurmaCard } from '../components/TurmaCard'
import { criarTurma, listarTurmasDoProfessor } from '../services/turmaService'
import type { CriarTurmaRequest, Turma } from '../types/turma.types'

export function ProfessorTurmasPage() {
  const { user } = useAuth()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const carregarTurmas = useCallback(async () => {
    if (!user) {
      setLoadError('Sessão não encontrada.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const data = await listarTurmasDoProfessor(user.id)
      setTurmas(data)
    } catch {
      setLoadError('Não foi possível carregar as turmas.')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      return
    }

    let isActive = true

    listarTurmasDoProfessor(user.id)
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
  }, [user])

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
      <header className="page-header turmas-page-header">
        <div>
          <h1>Minhas turmas</h1>
          <p>Organize as turmas, compartilhe códigos de entrada e acesse os espaços de trabalho.</p>
        </div>

        <button type="button" onClick={() => setShowCreateForm(true)}>
          Nova turma
        </button>
      </header>

      {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}

      {showCreateForm ? (
        <section className="section-panel turma-form-panel">
          <div className="panel-header">
            <div>
              <h2>Nova turma</h2>
              <p>Crie a turma e compartilhe o código de entrada com os alunos.</p>
            </div>
          </div>
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

      {isLoading ? (
        <section className="section-panel">
          <LoadingState>Carregando turmas...</LoadingState>
        </section>
      ) : null}

      {!isLoading && loadError ? (
        <div className="section-panel">
          <p className="form-error">{loadError}</p>
          <button type="button" onClick={() => void carregarTurmas()}>
            Tentar novamente
          </button>
        </div>
      ) : null}

      {!isLoading && !loadError && turmas.length === 0 ? (
        <section className="section-panel empty-workspace">
          <EmptyState title="Você ainda não possui turmas.">
            Crie uma turma para gerar o código de entrada dos alunos.
          </EmptyState>
          <button type="button" onClick={() => setShowCreateForm(true)}>
            Nova turma
          </button>
        </section>
      ) : null}

      {!isLoading && !loadError && turmas.length > 0 ? (
        <>
          <section className="turmas-summary" aria-label="Resumo de turmas">
            <span>
              {turmas.length}{' '}
              {turmas.length === 1 ? 'turma cadastrada' : 'turmas cadastradas'}
            </span>
            <span>Use o código de entrada para convidar alunos.</span>
          </section>

          <section className="turmas-grid" aria-label="Lista de turmas">
            {turmas.map((turma) => (
              <TurmaCard key={turma.id} turma={turma} />
            ))}
          </section>
        </>
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
