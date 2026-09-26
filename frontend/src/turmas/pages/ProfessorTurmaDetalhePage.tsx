import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { TurmaHeader } from '../components/TurmaHeader'
import { buscarTurmaPorId } from '../services/turmaService'
import type { Turma } from '../types/turma.types'

type TurmaDetalheState =
  | {
      status: 'loading'
      turmaId: number
      turma: null
      errorMessage: null
    }
  | {
      status: 'success'
      turmaId: number
      turma: Turma
      errorMessage: null
    }
  | {
      status: 'error'
      turmaId: number
      turma: null
      errorMessage: string
    }

export function ProfessorTurmaDetalhePage() {
  const { turmaId } = useParams()
  const id = parseTurmaId(turmaId)
  const [state, setState] = useState<TurmaDetalheState | null>(() =>
    id
      ? {
          status: 'loading',
          turmaId: id,
          turma: null,
          errorMessage: null,
        }
      : null,
  )

  useEffect(() => {
    if (!id) {
      return
    }

    let isActive = true

    buscarTurmaPorId(id)
      .then((data) => {
        if (isActive) {
          setState({
            status: 'success',
            turmaId: id,
            turma: data,
            errorMessage: null,
          })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            status: 'error',
            turmaId: id,
            turma: null,
            errorMessage: getLoadErrorMessage(error),
          })
        }
      })

    return () => {
      isActive = false
    }
  }, [id])

  const isLoading = Boolean(id && (!state || state.turmaId !== id || state.status === 'loading'))
  const turma = state?.turmaId === id && state.status === 'success' ? state.turma : null
  const errorMessage =
    id && state?.turmaId === id && state.status === 'error'
      ? state.errorMessage
      : id
        ? null
        : 'Identificador da turma inválido.'

  return (
    <main className="page-shell">
      {isLoading ? <p>Carregando turma...</p> : null}

      {!isLoading && errorMessage ? (
        <section className="section-panel">
          <p className="form-error">{errorMessage}</p>
        </section>
      ) : null}

      {!isLoading && turma ? (
        <>
          <TurmaHeader turma={turma} />

          <section className="section-panel">
            <h2>Visão geral</h2>
            <p>Os recursos desta turma serão integrados nas próximas etapas.</p>
          </section>
        </>
      ) : null}
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
    if (error.response?.status === 404) {
      return 'Turma não encontrada.'
    }

    if (error.response?.status === 403) {
      return 'Você não possui permissão para acessar esta turma.'
    }
  }

  return 'Não foi possível carregar a turma.'
}
