import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
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
  const { atividadeId } = useParams()
  const id = parseId(atividadeId)
  const [atividade, setAtividade] = useState<Atividade | null>(null)
  const [entrega, setEntrega] = useState<EntregaAtividade | null>(null)
  const [isLoadingAtividade, setIsLoadingAtividade] = useState(Boolean(id))
  const [isLoadingEntrega, setIsLoadingEntrega] = useState(Boolean(id))
  const [isSavingEntrega, setIsSavingEntrega] = useState(false)
  const [isConcluding, setIsConcluding] = useState(false)
  const [atividadeError, setAtividadeError] = useState<string | null>(
    id ? null : 'Identificador da atividade inválido.',
  )
  const [entregaError, setEntregaError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const carregarDados = useCallback(async () => {
    if (!id) {
      setAtividadeError('Identificador da atividade inválido.')
      setIsLoadingAtividade(false)
      setIsLoadingEntrega(false)
      return
    }

    setIsLoadingAtividade(true)
    setIsLoadingEntrega(true)
    setAtividadeError(null)
    setEntregaError(null)

    try {
      const [atividadeData, entregaData] = await Promise.all([
        buscarAtividadePorId(id),
        buscarMinhaEntregaDaAtividade(id),
      ])

      setAtividade(atividadeData)
      setEntrega(entregaData)
    } catch (error: unknown) {
      setAtividadeError(getAtividadeErrorMessage(error))
    } finally {
      setIsLoadingAtividade(false)
      setIsLoadingEntrega(false)
    }
  }, [id])

  useEffect(() => {
    let isActive = true

    async function carregar() {
      if (!id) {
        if (isActive) {
          setAtividadeError('Identificador da atividade inválido.')
          setIsLoadingAtividade(false)
          setIsLoadingEntrega(false)
        }
        return
      }

      setIsLoadingAtividade(true)
      setIsLoadingEntrega(true)
      setAtividadeError(null)
      setEntregaError(null)

      try {
        const [atividadeData, entregaData] = await Promise.all([
          buscarAtividadePorId(id),
          buscarMinhaEntregaDaAtividade(id),
        ])

        if (isActive) {
          setAtividade(atividadeData)
          setEntrega(entregaData)
        }
      } catch (error: unknown) {
        if (isActive) {
          setAtividadeError(getAtividadeErrorMessage(error))
        }
      } finally {
        if (isActive) {
          setIsLoadingAtividade(false)
          setIsLoadingEntrega(false)
        }
      }
    }

    void carregar()

    return () => {
      isActive = false
    }
  }, [id])

  async function handleSalvarEntrega(dados: EntregaAtividadeRequest) {
    if (!id) {
      return
    }

    setIsSavingEntrega(true)
    setEntregaError(null)
    setFeedbackMessage(null)

    try {
      const entregaAtualizada = await salvarEntrega(id, dados)
      setEntrega(entregaAtualizada)
      setFeedbackMessage('Entrega salva com sucesso.')
    } catch (error: unknown) {
      setEntregaError(getEntregaErrorMessage(error))
      throw error
    } finally {
      setIsSavingEntrega(false)
    }
  }

  async function handleConcluirAtividade() {
    if (!id) {
      return
    }

    setIsConcluding(true)
    setEntregaError(null)
    setFeedbackMessage(null)

    try {
      const entregaAtualizada = await concluirAtividade(id)
      setEntrega(entregaAtualizada)
      setFeedbackMessage('Atividade marcada como concluída.')
    } catch (error: unknown) {
      setEntregaError(getEntregaErrorMessage(error))
      throw error
    } finally {
      setIsConcluding(false)
    }
  }

  return (
    <main className="page-shell">
      <TurmaPlaceholderAluno />

      {isLoadingAtividade ? <p>Carregando atividade...</p> : null}

      {!isLoadingAtividade && atividadeError ? (
        <section className="section-panel">
          <p className="form-error">{atividadeError}</p>
          {id ? (
            <button type="button" onClick={() => void carregarDados()}>
              Tentar novamente
            </button>
          ) : null}
        </section>
      ) : null}

      {!isLoadingAtividade && atividade ? (
        <>
          <section className="section-panel">
            <div className="turma-card-header">
              <h1>{atividade.titulo}</h1>
              <span className="turma-status">{atividade.status}</span>
            </div>

            <p>{atividade.descricao}</p>

            <dl className="turma-meta turma-detail-meta">
              <div>
                <dt>Criada em</dt>
                <dd>{formatarData(atividade.dataCriacao)}</dd>
              </div>
              <div>
                <dt>Data limite</dt>
                <dd>{formatarDataOpcional(atividade.dataLimite)}</dd>
              </div>
              <div>
                <dt>Nota máxima</dt>
                <dd>{formatarNotaMaxima(atividade.notaMaxima)}</dd>
              </div>
            </dl>
          </section>

          <MinhaEntregaSection
            key={entrega?.id ?? 'sem-entrega'}
            entrega={entrega}
            notaMaxima={atividade.notaMaxima}
            isLoading={isLoadingEntrega}
            isSaving={isSavingEntrega}
            isConcluding={isConcluding}
            errorMessage={entregaError}
            feedbackMessage={feedbackMessage}
            onSave={handleSalvarEntrega}
            onConclude={handleConcluirAtividade}
          />
        </>
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

  return 'Não foi possível carregar as atividades.'
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

  return 'Não foi possível atualizar sua entrega.'
}

function formatarDataOpcional(value: string | null): string {
  return value ? formatarData(value) : 'Sem prazo definido'
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
