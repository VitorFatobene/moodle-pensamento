import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { LoadingState } from '../../components/LoadingState'
import { TurmaPlaceholderAluno } from '../../turmas/components/TurmaPlaceholderAluno'
import { AtividadeCard } from '../components/AtividadeCard'
import { listarAtividadesDaTurma } from '../services/atividadeService'
import type { Atividade } from '../types/atividade.types'

export function AlunoTurmaAtividadesPage() {
  const { turmaId } = useParams()
  const id = parseId(turmaId)
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [loadError, setLoadError] = useState<string | null>(
    id ? null : 'Identificador da turma inválido.',
  )

  const carregarAtividades = useCallback(async () => {
    if (!id) {
      setLoadError('Identificador da turma inválido.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const data = await listarAtividadesDaTurma(id)
      setAtividades(data)
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
        const data = await listarAtividadesDaTurma(id)

        if (isActive) {
          setAtividades(data)
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

      <header className="page-header atividades-page-header">
        <div>
          <h1>Atividades da turma</h1>
          <p>Acompanhe instruções, prazos e notas de cada atividade.</p>
        </div>
      </header>

      {isLoading ? (
        <section className="section-panel state-panel">
          <LoadingState>Carregando atividades...</LoadingState>
        </section>
      ) : null}

      {!isLoading && loadError ? (
        <section className="section-panel state-panel state-panel--error">
          <p className="form-error" role="alert">
            {loadError}
          </p>
          {id ? (
            <button type="button" onClick={() => void carregarAtividades()}>
              Tentar novamente
            </button>
          ) : null}
        </section>
      ) : null}

      {!isLoading && !loadError && atividades.length === 0 ? (
        <section className="section-panel atividade-empty">
          <EmptyState title="Nenhuma atividade disponível">
            Quando o professor publicar uma atividade, ela aparecerá aqui com prazo e nota.
          </EmptyState>
        </section>
      ) : null}

      {!isLoading && !loadError && atividades.length > 0 ? (
        <section className="atividades-collection" aria-labelledby="atividades-list-title">
          <div className="atividades-list-header">
            <div>
              <h2 id="atividades-list-title">Atividades disponíveis</h2>
              <p>Priorize os itens com prazo próximo e abra os detalhes para enviar sua entrega.</p>
            </div>
            <span className="atividades-count">
              {atividades.length} {atividades.length === 1 ? 'atividade' : 'atividades'}
            </span>
          </div>
          <div className="atividades-grid" role="list" aria-label="Lista de atividades">
            {atividades.map((atividade) => (
              <AtividadeCard
                key={atividade.id}
                atividade={atividade}
                detalhesTo={`/aluno/turmas/${atividade.turmaId}/atividades/${atividade.id}`}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

function parseId(value: string | undefined): number | null {
  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function getLoadErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 403) {
      return 'Você não possui acesso às atividades desta turma.'
    }

    if (error.response?.status === 404) {
      return 'Atividade ou turma não encontrada.'
    }
  }

  return 'Não foi possível carregar as atividades.'
}
