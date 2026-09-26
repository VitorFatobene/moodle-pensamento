import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { ProfessorSolicitacaoCard } from '../../solicitacoes/components/ProfessorSolicitacaoCard'
import {
  aceitarSolicitacao,
  listarSolicitacoesPendentesDaTurma,
  recusarSolicitacao,
} from '../../solicitacoes/services/solicitacaoService'
import type { SolicitacaoEntrada } from '../../solicitacoes/types/solicitacao.types'
import { TurmaPlaceholderNav } from '../components/TurmaPlaceholderNav'

export function ProfessorTurmaSolicitacoesPage() {
  const { turmaId } = useParams()
  const id = parseTurmaId(turmaId)
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoEntrada[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [processingSolicitacaoId, setProcessingSolicitacaoId] = useState<number | null>(
    null,
  )
  const [loadError, setLoadError] = useState<string | null>(
    id ? null : 'Identificador da turma inválido.',
  )
  const [operationError, setOperationError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const carregarSolicitacoes = useCallback(async () => {
    if (!id) {
      setLoadError('Identificador da turma inválido.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const data = await listarSolicitacoesPendentesDaTurma(id)
      setSolicitacoes(data)
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
        const data = await listarSolicitacoesPendentesDaTurma(id)

        if (isActive) {
          setSolicitacoes(data)
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

  async function handleAceitar(solicitacaoId: number) {
    setProcessingSolicitacaoId(solicitacaoId)
    setOperationError(null)
    setFeedbackMessage(null)

    try {
      await aceitarSolicitacao(solicitacaoId)
      setSolicitacoes((solicitacoesAtuais) =>
        solicitacoesAtuais.filter((solicitacao) => solicitacao.id !== solicitacaoId),
      )
      setFeedbackMessage('Solicitação aceita com sucesso.')
    } catch (error: unknown) {
      setOperationError(getOperationErrorMessage(error))
    } finally {
      setProcessingSolicitacaoId(null)
    }
  }

  async function handleRecusar(solicitacaoId: number) {
    setProcessingSolicitacaoId(solicitacaoId)
    setOperationError(null)
    setFeedbackMessage(null)

    try {
      await recusarSolicitacao(solicitacaoId)
      setSolicitacoes((solicitacoesAtuais) =>
        solicitacoesAtuais.filter((solicitacao) => solicitacao.id !== solicitacaoId),
      )
      setFeedbackMessage('Solicitação recusada com sucesso.')
    } catch (error: unknown) {
      setOperationError(getOperationErrorMessage(error))
    } finally {
      setProcessingSolicitacaoId(null)
    }
  }

  return (
    <main className="page-shell">
      <TurmaPlaceholderNav />

      <section className="section-panel">
        <h1>Solicitações da turma</h1>

        {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}
        {operationError ? <p className="form-error">{operationError}</p> : null}

        {isLoading ? <p>Carregando solicitações...</p> : null}

        {!isLoading && loadError ? (
          <>
            <p className="form-error">{loadError}</p>
            {id ? (
              <button type="button" onClick={() => void carregarSolicitacoes()}>
                Tentar novamente
              </button>
            ) : null}
          </>
        ) : null}

        {!isLoading && !loadError && solicitacoes.length === 0 ? (
          <p>Não há solicitações pendentes para esta turma.</p>
        ) : null}

        {!isLoading && !loadError && solicitacoes.length > 0 ? (
          <div className="turmas-grid" aria-label="Lista de solicitações pendentes">
            {solicitacoes.map((solicitacao) => (
              <ProfessorSolicitacaoCard
                key={solicitacao.id}
                solicitacao={solicitacao}
                isProcessing={processingSolicitacaoId === solicitacao.id}
                onAccept={(solicitacaoId) => void handleAceitar(solicitacaoId)}
                onReject={(solicitacaoId) => void handleRecusar(solicitacaoId)}
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
      return 'Você não possui permissão para gerenciar solicitações desta turma.'
    }

    if (error.response?.status === 404) {
      return 'Turma não encontrada.'
    }
  }

  return 'Não foi possível carregar as solicitações da turma.'
}

function getOperationErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 403) {
      return 'Você não possui permissão para gerenciar solicitações desta turma.'
    }

    if (error.response?.status === 404) {
      return 'Solicitação não encontrada.'
    }

    if (error.response?.status === 409) {
      return 'Esta solicitação já foi processada.'
    }
  }

  return 'Não foi possível processar a solicitação.'
}
