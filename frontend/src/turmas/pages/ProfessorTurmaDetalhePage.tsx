import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { Link, useParams } from 'react-router-dom'
import { LoadingState } from '../../components/LoadingState'
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
      {isLoading ? <LoadingState>Carregando turma...</LoadingState> : null}

      {!isLoading && errorMessage ? (
        <section className="section-panel">
          <p className="form-error">{errorMessage}</p>
        </section>
      ) : null}

      {!isLoading && turma ? (
        <>
          <TurmaHeader turma={turma} />

          <section className="turma-overview">
            <div className="section-panel turma-overview-primary">
              <div className="panel-header">
                <div>
                  <h2>Visão geral</h2>
                  <p>Use esta área para acompanhar a turma e acessar os principais recursos.</p>
                </div>
              </div>

              <dl className="turma-meta turma-detail-meta">
                <div>
                  <dt>Professor</dt>
                  <dd>{turma.professorNome}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{turma.status}</dd>
                </div>
                <div>
                  <dt>Código de entrada</dt>
                  <dd>{turma.codigoEntrada}</dd>
                </div>
              </dl>
            </div>

            <section className="section-panel">
              <div className="panel-header">
                <div>
                  <h2>Atalhos da turma</h2>
                  <p>Acesse as áreas de gestão sem sair do contexto da turma.</p>
                </div>
              </div>

              <div className="turma-shortcut-grid">
                <Link className="turma-shortcut-card" to={`/professor/turmas/${turma.id}/avisos`}>
                  <strong>Avisos</strong>
                  <span>Publique comunicados para a turma.</span>
                </Link>
                <Link className="turma-shortcut-card" to={`/professor/turmas/${turma.id}/alunos`}>
                  <strong>Alunos</strong>
                  <span>Consulte matrículas e remova alunos quando necessário.</span>
                </Link>
                <Link className="turma-shortcut-card" to={`/professor/turmas/${turma.id}/solicitacoes`}>
                  <strong>Solicitações</strong>
                  <span>Avalie pedidos de entrada pendentes.</span>
                </Link>
                <Link className="turma-shortcut-card" to={`/professor/turmas/${turma.id}/atividades`}>
                  <strong>Atividades</strong>
                  <span>Crie atividades e acompanhe entregas.</span>
                </Link>
              </div>
            </section>
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
