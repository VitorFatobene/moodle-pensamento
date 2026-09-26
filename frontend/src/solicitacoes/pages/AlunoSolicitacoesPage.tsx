import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { listarTurmas } from '../../turmas/services/turmaService'
import type { Turma } from '../../turmas/types/turma.types'
import { SolicitacaoCard } from '../components/SolicitacaoCard'
import { SolicitarEntradaForm } from '../components/SolicitarEntradaForm'
import {
  listarMinhasSolicitacoes,
  solicitarEntrada,
} from '../services/solicitacaoService'
import type { SolicitacaoEntrada } from '../types/solicitacao.types'

interface ApiErrorResponse {
  message?: string
}

export function AlunoSolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoEntrada[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingTurmas, setIsLoadingTurmas] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const carregarSolicitacoes = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const data = await listarMinhasSolicitacoes()
      setSolicitacoes(data)
    } catch {
      setLoadError('Não foi possível carregar suas solicitações.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const carregarTurmas = useCallback(async () => {
    setIsLoadingTurmas(true)

    try {
      const data = await listarTurmas()
      setTurmas(data)
    } catch {
      setTurmas([])
    } finally {
      setIsLoadingTurmas(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    async function carregar() {
      try {
        const [solicitacoesData, turmasData] = await Promise.all([
          listarMinhasSolicitacoes(),
          listarTurmas(),
        ])

        if (isActive) {
          setSolicitacoes(solicitacoesData)
          setTurmas(turmasData)
        }
      } catch {
        if (isActive) {
          setLoadError('Não foi possível carregar suas solicitações.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
          setIsLoadingTurmas(false)
        }
      }
    }

    void carregar()

    return () => {
      isActive = false
    }
  }, [])

  async function handleSolicitarEntrada(turmaId: number) {
    setIsSubmitting(true)
    setSubmitError(null)
    setFeedbackMessage(null)

    try {
      const solicitacaoCriada = await solicitarEntrada(turmaId)
      setSolicitacoes((solicitacoesAtuais) => [
        solicitacaoCriada,
        ...solicitacoesAtuais,
      ])
      setFeedbackMessage('Solicitação enviada com sucesso.')
    } catch (error: unknown) {
      setSubmitError(getSolicitarErrorMessage(error))
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Solicitações</h1>
          <p>Acompanhe seus pedidos de entrada nas turmas.</p>
        </div>
      </header>

      <section className="section-panel">
        <h2>Nova solicitação</h2>
        <p>Selecione uma turma disponível para solicitar entrada.</p>

        {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}
        {submitError ? <p className="form-error">{submitError}</p> : null}
        {!isLoadingTurmas && turmas.length === 0 ? (
          <p>Não há turmas disponíveis para solicitação no momento.</p>
        ) : null}

        <SolicitarEntradaForm
          turmas={turmas}
          isLoadingTurmas={isLoadingTurmas}
          isSubmitting={isSubmitting}
          onSubmit={handleSolicitarEntrada}
        />
      </section>

      <section className="section-panel">
        <h2>Minhas solicitações</h2>

        {isLoading ? <p>Carregando solicitações...</p> : null}

        {!isLoading && loadError ? (
          <>
            <p className="form-error">{loadError}</p>
            <button
              type="button"
              onClick={() => {
                void carregarSolicitacoes()
                void carregarTurmas()
              }}
            >
              Tentar novamente
            </button>
          </>
        ) : null}

        {!isLoading && !loadError && solicitacoes.length === 0 ? (
          <p>Você ainda não realizou nenhuma solicitação de entrada.</p>
        ) : null}

        {!isLoading && !loadError && solicitacoes.length > 0 ? (
          <div className="turmas-grid" aria-label="Lista de solicitações">
            {solicitacoes.map((solicitacao) => (
              <SolicitacaoCard key={solicitacao.id} solicitacao={solicitacao} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}

function getSolicitarErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message

    if (error.response?.status === 400) {
      return 'Verifique os dados informados.'
    }

    if (error.response?.status === 403) {
      return 'Você não possui permissão para realizar esta solicitação.'
    }

    if (error.response?.status === 404) {
      return 'Turma não encontrada.'
    }

    if (error.response?.status === 409) {
      if (message?.toLowerCase().includes('matriculado')) {
        return 'Você já está matriculado nesta turma.'
      }

      return 'Já existe uma solicitação pendente para esta turma.'
    }
  }

  return 'Não foi possível realizar a solicitação.'
}
