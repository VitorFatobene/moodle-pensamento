import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { LoadingState } from '../../components/LoadingState'
import { AlunoMatriculadoCard } from '../../matriculas/components/AlunoMatriculadoCard'
import {
  listarAlunosDaTurma,
  removerAlunoDaTurma,
} from '../../matriculas/services/matriculaService'
import type { Matricula } from '../../matriculas/types/matricula.types'
import { TurmaPlaceholderNav } from '../components/TurmaPlaceholderNav'

export function ProfessorTurmaAlunosPage() {
  const { turmaId } = useParams()
  const id = parseTurmaId(turmaId)
  const [alunos, setAlunos] = useState<Matricula[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [loadError, setLoadError] = useState<string | null>(
    id ? null : 'Identificador da turma inválido.',
  )
  const [removeError, setRemoveError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [removingAlunoId, setRemovingAlunoId] = useState<number | null>(null)

  const carregarAlunos = useCallback(async () => {
    if (!id) {
      setLoadError('Identificador da turma inválido.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const data = await listarAlunosDaTurma(id)
      setAlunos(data)
    } catch (error: unknown) {
      setLoadError(getLoadErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    let isActive = true

    async function carregar() {
      if (!id) {
        if (isActive) {
          setLoadError('Identificador da turma inválido.')
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      setLoadError(null)

      try {
        const data = await listarAlunosDaTurma(id)

        if (isActive) {
          setAlunos(data)
        }
      } catch (error: unknown) {
        if (isActive) {
          setLoadError(getLoadErrorMessage(error))
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void carregar()

    return () => {
      isActive = false
    }
  }, [id])

  async function handleRemoverAluno(alunoId: number) {
    if (!id || removingAlunoId === alunoId) {
      return
    }

    const confirmado = window.confirm('Tem certeza que deseja remover este aluno da turma?')

    if (!confirmado) {
      return
    }

    setRemovingAlunoId(alunoId)
    setRemoveError(null)
    setFeedbackMessage(null)

    try {
      await removerAlunoDaTurma(id, alunoId)
      setAlunos((alunosAtuais) =>
        alunosAtuais.filter((matricula) => matricula.alunoId !== alunoId),
      )
      setFeedbackMessage('Aluno removido da turma.')
    } catch (error: unknown) {
      setRemoveError(getRemoveErrorMessage(error))
    } finally {
      setRemovingAlunoId(null)
    }
  }

  return (
    <main className="page-shell">
      <TurmaPlaceholderNav />

      <section className="section-panel">
        <h1>Alunos da turma</h1>

        {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}
        {removeError ? <p className="form-error">{removeError}</p> : null}

        {isLoading ? <LoadingState>Carregando alunos...</LoadingState> : null}

        {!isLoading && loadError ? (
          <>
            <p className="form-error">{loadError}</p>
            {id ? (
              <button type="button" onClick={() => void carregarAlunos()}>
                Tentar novamente
              </button>
            ) : null}
          </>
        ) : null}

        {!isLoading && !loadError && alunos.length === 0 ? (
          <EmptyState>Não há alunos matriculados nesta turma.</EmptyState>
        ) : null}

        {!isLoading && !loadError && alunos.length > 0 ? (
          <div className="turmas-grid" aria-label="Lista de alunos matriculados">
            {alunos.map((matricula) => (
              <AlunoMatriculadoCard
                key={matricula.id}
                matricula={matricula}
                isRemoving={removingAlunoId === matricula.alunoId}
                onRemove={(alunoId) => void handleRemoverAluno(alunoId)}
              />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}

function parseTurmaId(value: string | undefined): number | null {
  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function getLoadErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 403) {
      return 'Você não possui permissão para gerenciar os alunos desta turma.'
    }
  }

  return 'Não foi possível carregar os alunos da turma.'
}

function getRemoveErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 403) {
      return 'Você não possui permissão para gerenciar os alunos desta turma.'
    }

    if (error.response?.status === 404) {
      return 'Aluno ou matrícula não encontrada.'
    }

    if (error.response?.status === 409) {
      return 'Não foi possível remover o aluno devido ao estado atual da matrícula.'
    }
  }

  return 'Não foi possível remover o aluno.'
}
