import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/StatusBadge'
import type { Atividade } from '../types/atividade.types'

interface AtividadeCardProps {
  atividade: Atividade
  isProcessing?: boolean
  detalhesTo?: string
  entregasTo?: string
  onEdit?: (atividade: Atividade) => void
  onDelete?: (atividadeId: number) => void
}

export function AtividadeCard({
  atividade,
  isProcessing,
  detalhesTo,
  entregasTo,
  onEdit,
  onDelete,
}: AtividadeCardProps) {
  const prazoReference = usePrazoReference(atividade)
  const prazo = getPrazoInfo(atividade, prazoReference)

  return (
    <article
      className={`turma-card atividade-card atividade-card--${prazo.tone}`}
      role="listitem"
      aria-busy={isProcessing || undefined}
    >
      <div className="turma-card-header atividade-card__header">
        <div className="atividade-card__title">
          <h2>{atividade.titulo}</h2>
          <span className={`atividade-deadline atividade-deadline--${prazo.tone}`}>
            {prazo.label}
          </span>
        </div>
        <StatusBadge value={atividade.status} />
      </div>

      <p className="atividade-card__description">{atividade.descricao}</p>

      <dl className="turma-meta atividade-card__meta">
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
          <dd>{formatarNota(atividade.notaMaxima)}</dd>
        </div>
        <div className="atividade-card__created-meta">
          <dt>Criada em</dt>
          <dd>
            <time dateTime={atividade.dataCriacao}>
              {formatarData(atividade.dataCriacao)}
            </time>
          </dd>
        </div>
      </dl>

      <div className="form-actions atividade-card__actions">
        {detalhesTo ? (
          <Link className="atividade-card__primary-link" to={detalhesTo}>
            Ver atividade
          </Link>
        ) : null}
        {entregasTo ? (
          <Link className="atividade-card__primary-link" to={entregasTo}>
            Ver entregas
          </Link>
        ) : null}
        {onEdit ? (
          <button
            type="button"
            className="secondary-button"
            disabled={isProcessing}
            onClick={() => onEdit(atividade)}
          >
            Editar
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            className="danger-subtle-button"
            disabled={isProcessing}
            onClick={() => onDelete(atividade.id)}
          >
            {isProcessing ? 'Excluindo...' : 'Excluir'}
          </button>
        ) : null}
      </div>
    </article>
  )
}

function formatarData(value: string): string {
  const data = new Date(value)

  if (Number.isNaN(data.getTime())) {
    return value
  }

  return data.toLocaleString('pt-BR')
}

function formatarNota(value: number | null): string {
  if (value === null) {
    return 'Sem nota definida'
  }

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

type PrazoTone = 'neutral' | 'scheduled' | 'soon' | 'overdue'

interface PrazoInfo {
  label: string
  tone: PrazoTone
}

function getPrazoInfo(atividade: Atividade, agora: Date): PrazoInfo {
  if (atividade.status === 'INATIVA') {
    return { label: 'Atividade encerrada', tone: 'neutral' }
  }

  if (!atividade.dataLimite) {
    return { label: 'Sem prazo', tone: 'neutral' }
  }

  const limite = new Date(atividade.dataLimite)

  if (Number.isNaN(limite.getTime())) {
    return { label: 'Prazo definido', tone: 'scheduled' }
  }

  const diferenca = limite.getTime() - agora.getTime()

  if (diferenca < 0) {
    return { label: 'Prazo encerrado', tone: 'overdue' }
  }

  const mesmoDia =
    limite.getFullYear() === agora.getFullYear() &&
    limite.getMonth() === agora.getMonth() &&
    limite.getDate() === agora.getDate()

  if (mesmoDia) {
    return { label: 'Encerra hoje', tone: 'soon' }
  }

  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
  const inicioLimite = new Date(
    limite.getFullYear(),
    limite.getMonth(),
    limite.getDate(),
  )
  const diasRestantes = Math.round(
    (inicioLimite.getTime() - inicioHoje.getTime()) / 86_400_000,
  )

  if (diasRestantes <= 7) {
    return {
      label:
        diasRestantes === 1
          ? 'Encerra em 1 dia'
          : `Encerra em ${diasRestantes} dias`,
      tone: 'soon',
    }
  }

  return { label: 'Prazo definido', tone: 'scheduled' }
}

function usePrazoReference(atividade: Atividade): Date {
  const [refreshVersion, setRefreshVersion] = useState(0)
  const reference = new Date()

  useEffect(() => {
    if (atividade.status === 'INATIVA' || !atividade.dataLimite) {
      return
    }

    const limite = new Date(atividade.dataLimite)
    const agora = new Date()

    if (Number.isNaN(limite.getTime()) || limite.getTime() <= agora.getTime()) {
      return
    }

    const proximaMeiaNoite = new Date(agora)
    proximaMeiaNoite.setHours(24, 0, 0, 50)

    const proximaAtualizacao = Math.min(
      proximaMeiaNoite.getTime(),
      limite.getTime() + 50,
    )
    const delay = Math.min(
      Math.max(proximaAtualizacao - agora.getTime(), 1_000),
      2_147_483_647,
    )
    const timeoutId = window.setTimeout(
      () => setRefreshVersion((currentVersion) => currentVersion + 1),
      delay,
    )

    return () => window.clearTimeout(timeoutId)
  }, [atividade.dataLimite, atividade.status, refreshVersion])

  return reference
}
