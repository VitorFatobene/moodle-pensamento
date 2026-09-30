import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { LoadingState } from '../../components/LoadingState'
import { TurmaPlaceholderAluno } from '../../turmas/components/TurmaPlaceholderAluno'
import { AvisoCard } from '../components/AvisoCard'
import { listarAvisosDaTurma } from '../services/avisoService'
import type { Aviso } from '../types/aviso.types'

export function AlunoTurmaAvisosPage() {
  const { turmaId } = useParams()
  const id = parseTurmaId(turmaId)
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [loadError, setLoadError] = useState<string | null>(
    id ? null : 'Identificador da turma inválido.',
  )

  const carregarAvisos = useCallback(async () => {
    if (!id) {
      setLoadError('Identificador da turma inválido.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const data = await listarAvisosDaTurma(id)
      setAvisos(data)
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
        const data = await listarAvisosDaTurma(id)

        if (isActive) {
          setAvisos(data)
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
      <TurmaPlaceholderAluno />

      <section className="section-panel">
        <div className="panel-header">
          <div>
            <h1>Avisos da turma</h1>
            <p>Leia os comunicados publicados pelo professor para esta turma.</p>
          </div>
        </div>

        {isLoading ? <LoadingState>Carregando avisos...</LoadingState> : null}

        {!isLoading && loadError ? (
          <div className="state-panel state-panel--error">
            <p className="form-error">{loadError}</p>
            {id ? (
              <button type="button" onClick={() => void carregarAvisos()}>
                Tentar novamente
              </button>
            ) : null}
          </div>
        ) : null}

        {!isLoading && !loadError && avisos.length === 0 ? (
          <EmptyState title="Mural sem publicações">
            Não há avisos publicados nesta turma.
          </EmptyState>
        ) : null}

        {!isLoading && !loadError && avisos.length > 0 ? (
          <div className="avisos-list avisos-list--reading" aria-label="Lista de avisos">
            {avisos.map((aviso) => (
              <AvisoCard key={aviso.id} aviso={aviso} variant="reading" />
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
      return 'Você não possui acesso aos avisos desta turma.'
    }

    if (error.response?.status === 404) {
      return 'Turma não encontrada.'
    }
  }

  return 'Não foi possível carregar os avisos da turma.'
}
