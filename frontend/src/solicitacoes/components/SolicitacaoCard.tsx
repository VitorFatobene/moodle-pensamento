import { StatusBadge } from '../../components/StatusBadge'
import type { SolicitacaoEntrada } from '../types/solicitacao.types'

interface SolicitacaoCardProps {
  solicitacao: SolicitacaoEntrada
}

export function SolicitacaoCard({ solicitacao }: SolicitacaoCardProps) {
  const status = solicitacao.status.trim().toUpperCase()

  return (
    <article
      className={`turma-card solicitacao-card solicitacao-card--${status.toLowerCase()}`}
    >
      <div className="turma-card-header solicitacao-card-header">
        <div className="solicitacao-card-title">
          <h2>{solicitacao.turmaNome}</h2>
          <p>{getStatusDescription(status)}</p>
        </div>
        <StatusBadge value={solicitacao.status} />
      </div>

      <dl className="turma-meta solicitacao-meta" aria-label="Histórico da solicitação">
        <div>
          <dt>Solicitado em</dt>
          <dd>{formatarData(solicitacao.dataSolicitacao)}</dd>
        </div>
        {solicitacao.dataResposta ? (
          <div>
            <dt>Resposta em</dt>
            <dd>{formatarData(solicitacao.dataResposta)}</dd>
          </div>
        ) : (
          <div>
            <dt>Resposta</dt>
            <dd>Aguardando análise</dd>
          </div>
        )}
      </dl>
    </article>
  )
}

function getStatusDescription(status: string): string {
  if (status === 'PENDENTE') {
    return 'Aguardando análise do professor.'
  }

  if (status === 'ACEITA') {
    return 'Entrada aprovada.'
  }

  if (status === 'RECUSADA') {
    return 'Entrada não aprovada.'
  }

  return 'Solicitação registrada.'
}

function formatarData(value: string): string {
  const data = new Date(value)

  if (Number.isNaN(data.getTime())) {
    return value
  }

  return data.toLocaleString('pt-BR')
}
