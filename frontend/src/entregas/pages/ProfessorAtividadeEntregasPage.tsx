import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { buscarAtividadePorId } from '../../atividades/services/atividadeService'
import type { Atividade } from '../../atividades/types/atividade.types'
import { EmptyState } from '../../components/EmptyState'
import { LoadingState } from '../../components/LoadingState'
import { TurmaPlaceholderNav } from '../../turmas/components/TurmaPlaceholderNav'
import { EntregaCard } from '../components/EntregaCard'
import {
  atribuirNota,
  listarEntregasDaAtividade,
} from '../services/entregaService'
import type { EntregaAtividade, NotaEntregaRequest } from '../types/entrega.types'

interface OperationFeedback {
  entregaId: number
  type: 'success' | 'error'
  message: string
}

export function ProfessorAtividadeEntregasPage() {
  const { turmaId, atividadeId } = useParams()
  const turmaIdParsed = parseId(turmaId)
  const atividadeIdParsed = parseId(atividadeId)

  return (
    <ProfessorAtividadeEntregasContent
      key={`${turmaId ?? 'turma-invalida'}-${atividadeId ?? 'atividade-invalida'}`}
      turmaId={turmaIdParsed}
      atividadeId={atividadeIdParsed}
    />
  )
}

interface ProfessorAtividadeEntregasContentProps {
  turmaId: number | null
  atividadeId: number | null
}

function ProfessorAtividadeEntregasContent({
  turmaId,
  atividadeId,
}: ProfessorAtividadeEntregasContentProps) {
  const [atividade, setAtividade] = useState<Atividade | null>(null)
  const [entregas, setEntregas] = useState<EntregaAtividade[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(turmaId && atividadeId))
  const [processingEntregaId, setProcessingEntregaId] = useState<number | null>(null)
  const [loadError, setLoadError] = useState<string | null>(
    turmaId && atividadeId ? null : 'Identificador da turma ou da atividade inválido.',
  )
  const [operationFeedback, setOperationFeedback] = useState<OperationFeedback | null>(null)
  const [reloadVersion, setReloadVersion] = useState(0)

  useEffect(() => {
    let isActive = true

    async function carregar() {
      if (!turmaId || !atividadeId) {
        if (isActive) {
          setLoadError('Identificador da turma ou da atividade inválido.')
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      setLoadError(null)
      setAtividade(null)
      setEntregas([])

      try {
        const [atividadeData, entregasData] = await Promise.all([
          buscarAtividadePorId(atividadeId),
          listarEntregasDaAtividade(atividadeId),
        ])

        if (!isActive) {
          return
        }

        if (atividadeData.turmaId !== turmaId) {
          setLoadError('A atividade não pertence à turma informada.')
          return
        }

        setAtividade(atividadeData)
        setEntregas(entregasData)
      } catch {
        if (isActive) {
          setLoadError('Não foi possível carregar a atividade e suas entregas.')
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
  }, [atividadeId, reloadVersion, turmaId])

  async function handleAtribuirNota(
    entregaId: number,
    dados: NotaEntregaRequest,
  ): Promise<void> {
    if (processingEntregaId !== null) {
      return
    }

    setProcessingEntregaId(entregaId)
    setOperationFeedback(null)

    try {
      const entregaAtualizada = await atribuirNota(entregaId, dados)
      setEntregas((entregasAtuais) =>
        entregasAtuais.map((entrega) =>
          entrega.id === entregaAtualizada.id ? entregaAtualizada : entrega,
        ),
      )
      setOperationFeedback({
        entregaId,
        type: 'success',
        message: `Nota de ${entregaAtualizada.alunoNome} atualizada com sucesso.`,
      })
    } catch (error: unknown) {
      setOperationFeedback({
        entregaId,
        type: 'error',
        message: getNotaErrorMessage(error),
      })
      throw error
    } finally {
      setProcessingEntregaId(null)
    }
  }

  const totalEntregas = entregas.length
  const totalConcluidas = entregas.filter((entrega) => entrega.status === 'CONCLUIDA').length
  const totalPendentes = totalEntregas - totalConcluidas
  const totalComNota = entregas.filter((entrega) => entrega.nota !== null).length

  return (
    <main className="page-shell">
      <TurmaPlaceholderNav />

      <header className="page-header entregas-page-header">
        <div>
          <h1>{atividade?.titulo ?? 'Entregas da atividade'}</h1>
          <p>
            Entregas e notas — revise o material enviado pelos alunos e registre cada correção.
          </p>
        </div>
      </header>

      {atividade && !isLoading && !loadError ? (
        <section className="entregas-summary" aria-label="Resumo das entregas">
          <div>
            <strong>{totalEntregas}</strong>
            <span>{totalEntregas === 1 ? 'entrega' : 'entregas'}</span>
          </div>
          <div>
            <strong>{totalPendentes}</strong>
            <span>{totalPendentes === 1 ? 'pendente' : 'pendentes'}</span>
          </div>
          <div>
            <strong>{totalConcluidas}</strong>
            <span>{totalConcluidas === 1 ? 'concluída' : 'concluídas'}</span>
          </div>
          <div>
            <strong>{totalComNota}</strong>
            <span>{totalComNota === 1 ? 'com nota' : 'com nota'}</span>
          </div>
          <div className="entregas-summary__limit">
            <span>Nota máxima</span>
            <strong>{formatarNotaMaxima(atividade.notaMaxima)}</strong>
          </div>
        </section>
      ) : null}

      {isLoading ? (
        <section className="section-panel state-panel entregas-workspace">
          <LoadingState>Carregando atividade e entregas...</LoadingState>
        </section>
      ) : null}

      {!isLoading && loadError ? (
        <section className="section-panel state-panel state-panel--error entregas-workspace">
          <p className="form-error" role="alert">
            {loadError}
          </p>
          {turmaId && atividadeId ? (
            <button type="button" onClick={() => setReloadVersion((version) => version + 1)}>
              Tentar novamente
            </button>
          ) : null}
        </section>
      ) : null}

      {!isLoading && !loadError && entregas.length === 0 ? (
        <section className="section-panel entregas-workspace entrega-empty">
          <EmptyState>
            Ainda não há entregas para esta atividade. Elas aparecerão aqui quando os alunos
            salvarem ou concluírem o envio.
          </EmptyState>
        </section>
      ) : null}

      {!isLoading && !loadError && entregas.length > 0 ? (
        <section className="entregas-workspace" aria-labelledby="entregas-list-title">
          <div className="entregas-list-header">
            <div>
              <h2 id="entregas-list-title">Fila de correção</h2>
              <p>Abra cada entrega, confira o conteúdo e registre a nota correspondente.</p>
            </div>
            <span className="atividades-count">
              {totalComNota} de {totalEntregas} corrigidas
            </span>
          </div>

          <div className="entregas-list" role="list">
            {entregas.map((entrega) => {
              const feedback = operationFeedback?.entregaId === entrega.id ? operationFeedback : null

              return (
                <EntregaCard
                  key={entrega.id}
                  entrega={entrega}
                  notaMaxima={atividade?.notaMaxima ?? null}
                  isSubmittingNota={processingEntregaId === entrega.id}
                  isOperationBlocked={processingEntregaId !== null}
                  feedbackMessage={feedback?.type === 'success' ? feedback.message : null}
                  errorMessage={feedback?.type === 'error' ? feedback.message : null}
                  onSubmitNota={handleAtribuirNota}
                />
              )
            })}
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

function getNotaErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 400) {
      return 'Verifique o valor da nota e tente novamente.'
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

  return 'Não foi possível atualizar a nota. Tente novamente.'
}

function formatarNotaMaxima(value: number | null): string {
  if (value === null) {
    return 'Não definida'
  }

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}
