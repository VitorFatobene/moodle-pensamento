import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { Link, useParams } from 'react-router-dom'
import { LoadingState } from '../../components/LoadingState'
import { AlunoTurmaHeader } from '../components/AlunoTurmaHeader'
import { buscarTurmaPorId } from '../services/turmaService'
import type { Turma } from '../types/turma.types'

export function AlunoTurmaDetalhePage() {
  const { turmaId } = useParams()
  const id = parseTurmaId(turmaId)
  const [turma, setTurma] = useState<Turma | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [loadError, setLoadError] = useState<string | null>(
    id ? null : 'Identificador da turma inválido.',
  )

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
        const data = await buscarTurmaPorId(id)

        if (isActive) {
          setTurma(data)
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

  return (
    <main className="page-shell">
      {isLoading ? <LoadingState>Carregando turma...</LoadingState> : null}

      {!isLoading && loadError ? (
        <section className="section-panel">
          <p className="form-error">{loadError}</p>
        </section>
      ) : null}

      {!isLoading && turma ? (
        <>
          <AlunoTurmaHeader turma={turma} />

          <section className="turma-overview">
            <div className="section-panel turma-overview-primary">
              <div className="panel-header">
                <div>
                  <h2>Visão geral</h2>
                  <p>Consulte os recursos disponíveis e acompanhe as próximas atividades.</p>
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
              </dl>
            </div>

            <section className="section-panel">
              <div className="panel-header">
                <div>
                  <h2>Atalhos da turma</h2>
                  <p>Acesse rapidamente os materiais e comunicados desta turma.</p>
                </div>
              </div>

              <div className="turma-shortcut-grid">
                <Link className="turma-shortcut-card" to={`/aluno/turmas/${turma.id}/avisos`}>
                  <strong>Avisos</strong>
                  <span>Veja comunicados publicados pelo professor.</span>
                </Link>
                <Link className="turma-shortcut-card" to={`/aluno/turmas/${turma.id}/atividades`}>
                  <strong>Atividades</strong>
                  <span>Acompanhe atividades e entregas.</span>
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
    if (error.response?.status === 403) {
      return 'Você não possui permissão para acessar esta turma.'
    }

    if (error.response?.status === 404) {
      return 'Turma não encontrada.'
    }
  }

  return 'Não foi possível carregar a turma.'
}
