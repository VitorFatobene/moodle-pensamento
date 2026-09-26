import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { TurmaPlaceholderNav } from '../../turmas/components/TurmaPlaceholderNav'
import { EntregaCard } from '../components/EntregaCard'
import {
  atribuirNota,
  listarEntregasDaAtividade,
} from '../services/entregaService'
import type { EntregaAtividade, NotaEntregaRequest } from '../types/entrega.types'

export function ProfessorAtividadeEntregasPage() {
  const { atividadeId } = useParams()
  const id = parseId(atividadeId)
  const [entregas, setEntregas] = useState<EntregaAtividade[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [processingEntregaId, setProcessingEntregaId] = useState<number | null>(null)
  const [loadError, setLoadError] = useState<string | null>(
    id ? null : 'Identificador da atividade inválido.',
  )
  const [operationError, setOperationError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const carregarEntregas = useCallback(async () => {
    if (!id) {
      setLoadError('Identificador da atividade inválido.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const data = await listarEntregasDaAtividade(id)
      setEntregas(data)
    } catch {
      setLoadError('Não foi possível carregar as entregas da atividade.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    let isActive = true

    async function carregar() {
      if (!id) {
        if (isActive) {
          setLoadError('Identificador da atividade inválido.')
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      setLoadError(null)

      try {
        const data = await listarEntregasDaAtividade(id)

        if (isActive) {
          setEntregas(data)
        }
      } catch {
        if (isActive) {
          setLoadError('Não foi possível carregar as entregas da atividade.')
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

  async function handleAtribuirNota(
    entregaId: number,
    dados: NotaEntregaRequest,
  ): Promise<void> {
    setProcessingEntregaId(entregaId)
    setOperationError(null)
    setFeedbackMessage(null)

    try {
      const entregaAtualizada = await atribuirNota(entregaId, dados)
      setEntregas((entregasAtuais) =>
        entregasAtuais.map((entrega) =>
          entrega.id === entregaAtualizada.id ? entregaAtualizada : entrega,
        ),
      )
      setFeedbackMessage('Nota atualizada com sucesso.')
    } catch (error: unknown) {
      setOperationError(getNotaErrorMessage(error))
      throw error
    } finally {
      setProcessingEntregaId(null)
    }
  }

  const atividadeTitulo = entregas[0]?.atividadeTitulo

  return (
    <main className="page-shell">
      <TurmaPlaceholderNav />

      <section className="section-panel">
        <h1>Entregas da atividade</h1>
        {atividadeTitulo ? <p>{atividadeTitulo}</p> : null}

        {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}
        {operationError ? <p className="form-error">{operationError}</p> : null}

        {isLoading ? <p>Carregando entregas...</p> : null}

        {!isLoading && loadError ? (
          <>
            <p className="form-error">{loadError}</p>
            {id ? (
              <button type="button" onClick={() => void carregarEntregas()}>
                Tentar novamente
              </button>
            ) : null}
          </>
        ) : null}

        {!isLoading && !loadError && entregas.length === 0 ? (
          <p>Não há entregas para esta atividade.</p>
        ) : null}

        {!isLoading && !loadError && entregas.length > 0 ? (
          <div className="turmas-grid" aria-label="Lista de entregas">
            {entregas.map((entrega) => (
              <EntregaCard
                key={entrega.id}
                entrega={entrega}
                isSubmittingNota={processingEntregaId === entrega.id}
                onSubmitNota={handleAtribuirNota}
              />
            ))}
          </div>
        ) : null}
      </section>
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

function getNotaErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 400) {
      return 'Verifique o valor da nota.'
    }

    if (error.response?.status === 403) {
      return 'Você não possui permissão para atribuir nota nesta atividade.'
    }

    if (error.response?.status === 404) {
      return 'Entrega não encontrada.'
    }

    if (error.response?.status === 409) {
      return 'Não foi possível concluir a operação no estado atual.'
    }
  }

  return 'Não foi possível atualizar a nota.'
}
