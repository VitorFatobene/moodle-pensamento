import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { AvisoCard } from '../../avisos/components/AvisoCard'
import { AvisoForm } from '../../avisos/components/AvisoForm'
import {
  atualizarAviso,
  criarAviso,
  excluirAviso,
  listarAvisosDaTurma,
} from '../../avisos/services/avisoService'
import type { Aviso, AvisoRequest } from '../../avisos/types/aviso.types'
import { TurmaPlaceholderNav } from '../components/TurmaPlaceholderNav'

export function ProfessorTurmaAvisosPage() {
  const { turmaId } = useParams()
  const id = parseTurmaId(turmaId)
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAviso, setEditingAviso] = useState<Aviso | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingAvisoId, setProcessingAvisoId] = useState<number | null>(null)
  const [loadError, setLoadError] = useState<string | null>(
    id ? null : 'Identificador da turma inválido.',
  )
  const [operationError, setOperationError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

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

  async function handleCriarAviso(dados: AvisoRequest) {
    if (!id) {
      return
    }

    setIsSubmitting(true)
    setOperationError(null)
    setFeedbackMessage(null)

    try {
      const avisoCriado = await criarAviso(id, dados)
      setAvisos((avisosAtuais) => [avisoCriado, ...avisosAtuais])
      setIsFormOpen(false)
      setFeedbackMessage('Aviso criado com sucesso.')
    } catch (error: unknown) {
      setOperationError(getOperationErrorMessage(error))
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleAtualizarAviso(dados: AvisoRequest) {
    if (!editingAviso) {
      return
    }

    setIsSubmitting(true)
    setOperationError(null)
    setFeedbackMessage(null)

    try {
      const avisoAtualizado = await atualizarAviso(editingAviso.id, dados)
      setAvisos((avisosAtuais) =>
        avisosAtuais.map((aviso) =>
          aviso.id === avisoAtualizado.id ? avisoAtualizado : aviso,
        ),
      )
      setEditingAviso(null)
      setIsFormOpen(false)
      setFeedbackMessage('Aviso atualizado com sucesso.')
    } catch (error: unknown) {
      setOperationError(getOperationErrorMessage(error))
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleExcluirAviso(avisoId: number) {
    if (processingAvisoId === avisoId) {
      return
    }

    const confirmado = window.confirm('Tem certeza que deseja excluir este aviso?')

    if (!confirmado) {
      return
    }

    setProcessingAvisoId(avisoId)
    setOperationError(null)
    setFeedbackMessage(null)

    try {
      await excluirAviso(avisoId)
      setAvisos((avisosAtuais) => avisosAtuais.filter((aviso) => aviso.id !== avisoId))
      setFeedbackMessage('Aviso excluído com sucesso.')
    } catch (error: unknown) {
      setOperationError(getOperationErrorMessage(error))
    } finally {
      setProcessingAvisoId(null)
    }
  }

  function abrirCriacao() {
    setEditingAviso(null)
    setOperationError(null)
    setFeedbackMessage(null)
    setIsFormOpen(true)
  }

  function abrirEdicao(aviso: Aviso) {
    setEditingAviso(aviso)
    setOperationError(null)
    setFeedbackMessage(null)
    setIsFormOpen(true)
  }

  function fecharFormulario() {
    setEditingAviso(null)
    setIsFormOpen(false)
    setOperationError(null)
  }

  const initialFormValues = editingAviso
    ? {
        titulo: editingAviso.titulo,
        conteudo: editingAviso.conteudo,
      }
    : undefined

  return (
    <main className="page-shell">
      <TurmaPlaceholderNav />

      <section className="section-panel">
        <h1>Avisos da turma</h1>

        {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}
        {operationError ? <p className="form-error">{operationError}</p> : null}

        {!isFormOpen && !loadError && avisos.length > 0 ? (
          <div className="form-actions">
            <button type="button" onClick={abrirCriacao}>
              Novo aviso
            </button>
          </div>
        ) : null}

        {isFormOpen ? (
          <>
            <h2>{editingAviso ? 'Editar aviso' : 'Novo aviso'}</h2>
            <AvisoForm
              key={editingAviso?.id ?? 'new'}
              initialValues={initialFormValues}
              isSubmitting={isSubmitting}
              submitLabel={editingAviso ? 'Salvar alterações' : 'Criar aviso'}
              onCancel={fecharFormulario}
              onSubmit={editingAviso ? handleAtualizarAviso : handleCriarAviso}
            />
          </>
        ) : null}

        {isLoading ? <p>Carregando avisos...</p> : null}

        {!isLoading && loadError ? (
          <>
            <p className="form-error">{loadError}</p>
            {id ? (
              <button type="button" onClick={() => void carregarAvisos()}>
                Tentar novamente
              </button>
            ) : null}
          </>
        ) : null}

        {!isLoading && !loadError && avisos.length === 0 ? (
          <section className="empty-state">
            <p>Não há avisos publicados nesta turma.</p>
            {!isFormOpen ? (
              <button type="button" onClick={abrirCriacao}>
                Novo aviso
              </button>
            ) : null}
          </section>
        ) : null}

        {!isLoading && !loadError && avisos.length > 0 ? (
          <div className="turmas-grid" aria-label="Lista de avisos">
            {avisos.map((aviso) => (
              <AvisoCard
                key={aviso.id}
                aviso={aviso}
                isProcessing={processingAvisoId === aviso.id}
                onEdit={abrirEdicao}
                onDelete={(avisoId) => void handleExcluirAviso(avisoId)}
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
  if (isAxiosError(error) && error.response?.status === 403) {
    return 'Você não possui permissão para gerenciar os avisos desta turma.'
  }

  return 'Não foi possível carregar os avisos da turma.'
}

function getOperationErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 403) {
      return 'Você não possui permissão para gerenciar os avisos desta turma.'
    }

    if (error.response?.status === 404) {
      return 'Aviso não encontrado.'
    }

    if (error.response?.status === 409) {
      return 'Não foi possível concluir a operação devido ao estado atual do aviso.'
    }
  }

  return 'Não foi possível concluir a operação.'
}
