import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { AtividadeCard } from '../../atividades/components/AtividadeCard'
import { AtividadeForm } from '../../atividades/components/AtividadeForm'
import {
  atualizarAtividade,
  criarAtividade,
  excluirAtividade,
  listarAtividadesDaTurma,
} from '../../atividades/services/atividadeService'
import type {
  Atividade,
  AtividadeRequest,
} from '../../atividades/types/atividade.types'
import { TurmaPlaceholderNav } from '../components/TurmaPlaceholderNav'

export function ProfessorTurmaAtividadesPage() {
  const { turmaId } = useParams()
  const id = parseTurmaId(turmaId)
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAtividade, setEditingAtividade] = useState<Atividade | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingAtividadeId, setProcessingAtividadeId] = useState<number | null>(
    null,
  )
  const [loadError, setLoadError] = useState<string | null>(
    id ? null : 'Identificador da turma inválido.',
  )
  const [operationError, setOperationError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

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

  async function handleCriarAtividade(dados: AtividadeRequest) {
    if (!id) {
      return
    }

    setIsSubmitting(true)
    setOperationError(null)
    setFeedbackMessage(null)

    try {
      const atividadeCriada = await criarAtividade(id, dados)
      setAtividades((atividadesAtuais) => [atividadeCriada, ...atividadesAtuais])
      setIsFormOpen(false)
      setFeedbackMessage('Atividade criada com sucesso.')
    } catch (error: unknown) {
      setOperationError(getOperationErrorMessage(error))
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleAtualizarAtividade(dados: AtividadeRequest) {
    if (!editingAtividade) {
      return
    }

    setIsSubmitting(true)
    setOperationError(null)
    setFeedbackMessage(null)

    try {
      const atividadeAtualizada = await atualizarAtividade(editingAtividade.id, dados)
      setAtividades((atividadesAtuais) =>
        atividadesAtuais.map((atividade) =>
          atividade.id === atividadeAtualizada.id ? atividadeAtualizada : atividade,
        ),
      )
      setEditingAtividade(null)
      setIsFormOpen(false)
      setFeedbackMessage('Atividade atualizada com sucesso.')
    } catch (error: unknown) {
      setOperationError(getOperationErrorMessage(error))
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleExcluirAtividade(atividadeId: number) {
    if (processingAtividadeId === atividadeId) {
      return
    }

    const confirmado = window.confirm('Tem certeza que deseja excluir esta atividade?')

    if (!confirmado) {
      return
    }

    setProcessingAtividadeId(atividadeId)
    setOperationError(null)
    setFeedbackMessage(null)

    try {
      await excluirAtividade(atividadeId)
      setAtividades((atividadesAtuais) =>
        atividadesAtuais.filter((atividade) => atividade.id !== atividadeId),
      )
      setFeedbackMessage('Atividade excluída com sucesso.')
    } catch (error: unknown) {
      setOperationError(getOperationErrorMessage(error))
    } finally {
      setProcessingAtividadeId(null)
    }
  }

  function abrirCriacao() {
    setEditingAtividade(null)
    setOperationError(null)
    setFeedbackMessage(null)
    setIsFormOpen(true)
  }

  function abrirEdicao(atividade: Atividade) {
    setEditingAtividade(atividade)
    setOperationError(null)
    setFeedbackMessage(null)
    setIsFormOpen(true)
  }

  function fecharFormulario() {
    setEditingAtividade(null)
    setIsFormOpen(false)
    setOperationError(null)
  }

  const initialFormValues = editingAtividade
    ? {
        titulo: editingAtividade.titulo,
        descricao: editingAtividade.descricao,
        dataLimite: editingAtividade.dataLimite,
        notaMaxima: editingAtividade.notaMaxima,
      }
    : undefined

  return (
    <main className="page-shell">
      <TurmaPlaceholderNav />

      <section className="section-panel">
        <h1>Atividades da turma</h1>

        {feedbackMessage ? <p className="success-message">{feedbackMessage}</p> : null}
        {operationError ? <p className="form-error">{operationError}</p> : null}

        {!isFormOpen && !loadError && atividades.length > 0 ? (
          <div className="form-actions">
            <button type="button" onClick={abrirCriacao}>
              Nova atividade
            </button>
          </div>
        ) : null}

        {isFormOpen ? (
          <>
            <h2>{editingAtividade ? 'Editar atividade' : 'Nova atividade'}</h2>
            <AtividadeForm
              key={editingAtividade?.id ?? 'new'}
              initialValues={initialFormValues}
              isSubmitting={isSubmitting}
              submitLabel={editingAtividade ? 'Salvar alterações' : 'Criar atividade'}
              onCancel={fecharFormulario}
              onSubmit={
                editingAtividade ? handleAtualizarAtividade : handleCriarAtividade
              }
            />
          </>
        ) : null}

        {isLoading ? <p>Carregando atividades...</p> : null}

        {!isLoading && loadError ? (
          <>
            <p className="form-error">{loadError}</p>
            {id ? (
              <button type="button" onClick={() => void carregarAtividades()}>
                Tentar novamente
              </button>
            ) : null}
          </>
        ) : null}

        {!isLoading && !loadError && atividades.length === 0 ? (
          <section className="empty-state">
            <p>Não há atividades cadastradas nesta turma.</p>
            {!isFormOpen ? (
              <button type="button" onClick={abrirCriacao}>
                Nova atividade
              </button>
            ) : null}
          </section>
        ) : null}

        {!isLoading && !loadError && atividades.length > 0 ? (
          <div className="turmas-grid" aria-label="Lista de atividades">
            {atividades.map((atividade) => (
              <AtividadeCard
                key={atividade.id}
                atividade={atividade}
                isProcessing={processingAtividadeId === atividade.id}
                entregasTo={`/professor/turmas/${atividade.turmaId}/atividades/${atividade.id}/entregas`}
                onEdit={abrirEdicao}
                onDelete={(atividadeId) => void handleExcluirAtividade(atividadeId)}
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
    return 'Você não possui permissão para gerenciar atividades desta turma.'
  }

  return 'Não foi possível carregar as atividades da turma.'
}

function getOperationErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 400) {
      return 'Verifique os dados da atividade.'
    }

    if (error.response?.status === 403) {
      return 'Você não possui permissão para gerenciar atividades desta turma.'
    }

    if (error.response?.status === 404) {
      return 'Atividade não encontrada.'
    }

    if (error.response?.status === 409) {
      return 'Não foi possível concluir a operação devido ao estado atual da atividade.'
    }
  }

  return 'Não foi possível concluir a operação.'
}
