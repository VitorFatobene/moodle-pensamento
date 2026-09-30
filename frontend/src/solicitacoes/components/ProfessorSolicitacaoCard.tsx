import { StatusBadge } from '../../components/StatusBadge'
import type { SolicitacaoEntrada } from '../types/solicitacao.types'

interface ProfessorSolicitacaoCardProps {
  solicitacao: SolicitacaoEntrada
  isProcessing: boolean
  onAccept: (solicitacaoId: number) => void
  onReject: (solicitacaoId: number) => void
}

export function ProfessorSolicitacaoCard({
  solicitacao,
  isProcessing,
  onAccept,
  onReject,
}: ProfessorSolicitacaoCardProps) {
  return (
    <article
      className={`turma-card solicitacao-card ${
        isProcessing ? 'solicitacao-card--processing' : ''
      }`}
      aria-busy={isProcessing}
    >
      <div className="turma-card-header solicitacao-card-header">
        <div className="solicitacao-card-title">
          <h2>{solicitacao.alunoNome}</h2>
          <p>Solicitou entrada em {solicitacao.turmaNome}</p>
        </div>
        <StatusBadge value={solicitacao.status} />
      </div>

      <dl className="turma-meta solicitacao-meta" aria-label="Dados da solicitação">
        <div>
          <dt>Turma</dt>
          <dd>{solicitacao.turmaNome}</dd>
        </div>
        <div>
          <dt>Solicitado em</dt>
          <dd>{formatarData(solicitacao.dataSolicitacao)}</dd>
        </div>
      </dl>

      {isProcessing ? (
        <p className="info-message solicitacao-processing" role="status">
          Processando solicitação...
        </p>
      ) : null}

      <div className="form-actions solicitacao-actions" aria-label="Ações da solicitação">
        <button
          type="button"
          className="danger-subtle-button"
          disabled={isProcessing}
          onClick={() => onReject(solicitacao.id)}
        >
          {isProcessing ? 'Processando...' : 'Recusar'}
        </button>
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => onAccept(solicitacao.id)}
        >
          {isProcessing ? 'Processando...' : 'Aceitar'}
        </button>
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
