import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { LoadingState } from '../../components/LoadingState'
import { StatusBadge } from '../../components/StatusBadge'
import { MinhaEntregaSection } from '../../entregas/components/MinhaEntregaSection'
import {
  buscarMinhaEntregaDaAtividade,
  concluirAtividade,
  salvarEntrega,
} from '../../entregas/services/entregaService'
import type {
  EntregaAtividade,
  EntregaAtividadeRequest,
} from '../../entregas/types/entrega.types'
import { TurmaPlaceholderAluno } from '../../turmas/components/TurmaPlaceholderAluno'
import { buscarAtividadePorId } from '../services/atividadeService'
import type { Atividade } from '../types/atividade.types'

export function AlunoAtividadeDetalhePage() {
  const { turmaId, atividadeId } = useParams()

  return (
    <AlunoAtividadeDetalheContent
      key={`${turmaId ?? 'turma-invalida'}-${atividadeId ?? 'atividade-invalida'}`}
      turmaId={parseId(turmaId)}
      atividadeId={parseId(atividadeId)}
    />
  )
}

interface AlunoAtividadeDetalheContentProps {
  turmaId: number | null
  atividadeId: number | null
}

function AlunoAtividadeDetalheContent({
  turmaId,
  atividadeId,
}: AlunoAtividadeDetalheContentProps) {
  const [atividade, setAtividade] = useState<Atividade | null>(null)
  const [entrega, setEntrega] = useState<EntregaAtividade | null>(null)
  const [isLoadingAtividade, setIsLoadingAtividade] = useState(Boolean(turmaId && atividadeId))
  const [isLoadingEntrega, setIsLoadingEntrega] = useState(Boolean(turmaId && atividadeId))
  const [isSavingEntrega, setIsSavingEntrega] = useState(false)
  const [isConcluding, setIsConcluding] = useState(false)
  const [atividadeError, setAtividadeError] = useState<string | null>(
    turmaId && atividadeId ? null : 'Identificador da turma ou da atividade inválido.',
  )
  const [entregaLoadError, setEntregaLoadError] = useState<string | null>(null)
  const [entregaOperationError, setEntregaOperationError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [reloadVersion, setReloadVersion] = useState(0)
  const [entregaReloadVersion, setEntregaReloadVersion] = useState(0)

  useEffect(() => {
    let isActive = true

    async function carregarAtividade() {
      if (!turmaId || !atividadeId) {
        if (isActive) {
          setAtividadeError('Identificador da turma ou da atividade inválido.')
          setIsLoadingAtividade(false)
        }
        return
      }

      setIsLoadingAtividade(true)
      setAtividadeError(null)
      setAtividade(null)

      try {
        const atividadeData = await buscarAtividadePorId(atividadeId)

        if (!isActive) {
          return
        }

        if (atividadeData.turmaId !== turmaId) {
          setAtividadeError('A atividade não pertence à turma informada.')
          return
        }

        setAtividade(atividadeData)
      } catch (error: unknown) {
        if (isActive) {
          setAtividadeError(getAtividadeErrorMessage(error))
        }
      } finally {
        if (isActive) {
          setIsLoadingAtividade(false)
        }
      }
    }

    void carregarAtividade()

    return () => {
      isActive = false
    }
  }, [atividadeId, reloadVersion, turmaId])

  useEffect(() => {
    let isActive = true

    async function carregarEntrega() {
      if (!turmaId || !atividadeId) {
        if (isActive) {
          setIsLoadingEntrega(false)
        }
        return
      }

      setIsLoadingEntrega(true)
      setEntregaLoadError(null)
      setFeedbackMessage(null)
      setEntrega(null)

      try {
        const entregaData = await buscarMinhaEntregaDaAtividade(atividadeId)

        if (isActive) {
          setEntrega(entregaData)
        }
      } catch (error: unknown) {
        if (isActive) {
          setEntregaLoadError(getEntregaLoadErrorMessage(error))
        }
      } finally {
        if (isActive) {
          setIsLoadingEntrega(false)
        }
      }
    }

    void carregarEntrega()

    return () => {
      isActive = false
    }
  }, [atividadeId, entregaReloadVersion, reloadVersion, turmaId])

  async function handleSalvarEntrega(dados: EntregaAtividadeRequest) {
    if (!atividadeId || isSavingEntrega || isConcluding || entregaLoadError) {
      return
    }

    setIsSavingEntrega(true)
    setEntregaOperationError(null)
    setFeedbackMessage(null)

    try {
      const entregaAtualizada = await salvarEntrega(atividadeId, dados)
      setEntrega(entregaAtualizada)
      setFeedbackMessage('Entrega salva com sucesso.')
    } catch (error: unknown) {
      setEntregaOperationError(getEntregaErrorMessage(error))
      throw error
    } finally {
      setIsSavingEntrega(false)
    }
  }

  async function handleConcluirAtividade() {
    if (!atividadeId || isSavingEntrega || isConcluding || entregaLoadError) {
      return
    }

    setIsConcluding(true)
    setEntregaOperationError(null)
    setFeedbackMessage(null)

    try {
      const entregaAtualizada = await concluirAtividade(atividadeId)
      setEntrega(entregaAtualizada)
      setFeedbackMessage('Atividade marcada como concluída.')
    } catch (error: unknown) {
      setEntregaOperationError(getEntregaErrorMessage(error))
      throw error
    } finally {
      setIsConcluding(false)
    }
  }

  return (
    <main className="page-shell">
      <TurmaPlaceholderAluno />

      {isLoadingAtividade ? (
        <section className="section-panel state-panel atividade-task-rail">
          <LoadingState>Carregando atividade...</LoadingState>
        </section>
      ) : null}

      {!isLoadingAtividade && atividadeError ? (
        <section className="section-panel state-panel state-panel--error atividade-task-rail">
          <p className="form-error" role="alert">
            {atividadeError}
          </p>
          {turmaId && atividadeId ? (
            <button type="button" onClick={() => setReloadVersion((version) => version + 1)}>
              Tentar novamente
            </button>
          ) : null}
        </section>
      ) : null}

      {!isLoadingAtividade && !atividadeError && atividade ? (
        <div className="atividade-task-rail">
          <section className="section-panel atividade-detail">
            <div className="atividade-detail__header">
              <div>
                <span className="atividade-detail__context">Atividade</span>
                <h1>{atividade.titulo}</h1>
              </div>
              <StatusBadge value={atividade.status} />
            </div>

            <p className="atividade-detail__description">{atividade.descricao}</p>

            <dl className="turma-meta turma-detail-meta atividade-detail__meta">
              <div>
                <dt>Criada em</dt>
                <dd>
                  <time dateTime={atividade.dataCriacao}>
                    {formatarData(atividade.dataCriacao)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Data limite</dt>
                <dd>
                  {atividade.dataLimite ? (
                    <time dateTime={atividade.dataLimite}>
                      {formatarData(atividade.dataLimite)}
                    </time>
                  ) : (
                    'Sem prazo definido'
                  )}
                </dd>
              </div>
              <div>
                <dt>Nota máxima</dt>
                <dd>{formatarNotaMaxima(atividade.notaMaxima)}</dd>
              </div>
            </dl>
          </section>

          <MinhaEntregaSection
            key={`${entrega?.id ?? 'sem-entrega'}-${entrega?.status ?? 'pendente'}-${entrega?.linkEntrega ?? 'sem-link'}`}
            entrega={entrega}
            notaMaxima={atividade.notaMaxima}
            isLoading={isLoadingEntrega}
            isSaving={isSavingEntrega}
            isConcluding={isConcluding}
            loadErrorMessage={entregaLoadError}
            errorMessage={entregaOperationError}
            feedbackMessage={feedbackMessage}
            onSave={handleSalvarEntrega}
            onConclude={handleConcluirAtividade}
            onRetryLoad={() => setEntregaReloadVersion((version) => version + 1)}
          />
        </div>
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

function getAtividadeErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 403) {
      return 'Você não possui acesso às atividades desta turma.'
    }

    if (error.response?.status === 404) {
      return 'Atividade ou turma não encontrada.'
    }
  }

  return 'Não foi possível carregar a atividade.'
}

function getEntregaLoadErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.status === 403) {
    return 'Você não possui acesso às entregas desta turma.'
  }

  return 'A atividade foi carregada, mas não foi possível consultar sua entrega. Tente novamente.'
}

function getEntregaErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 400) {
      return 'Verifique os dados da entrega.'
    }

    if (error.response?.status === 403) {
      return 'Você não possui permissão para realizar esta operação.'
    }

    if (error.response?.status === 404) {
      return 'Atividade ou entrega não encontrada.'
    }

    if (error.response?.status === 409) {
      return 'Esta atividade já foi concluída.'
    }
  }

  return 'Não foi possível atualizar sua entrega. Tente novamente.'
}

function formatarData(value: string): string {
  const data = new Date(value)

  if (Number.isNaN(data.getTime())) {
    return value
  }

  return data.toLocaleString('pt-BR')
}

function formatarNotaMaxima(value: number | null): string {
  if (value === null) {
    return 'Sem nota definida'
  }

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}
