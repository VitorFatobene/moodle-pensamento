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
    <article className="turma-card">
      <div className="turma-card-header">
        <h2>{solicitacao.alunoNome}</h2>
        <span className="turma-status">{solicitacao.status}</span>
      </div>

      <dl className="turma-meta">
        <div>
          <dt>Turma</dt>
          <dd>{solicitacao.turmaNome}</dd>
        </div>
        <div>
          <dt>Solicitada em</dt>
          <dd>{formatarData(solicitacao.dataSolicitacao)}</dd>
        </div>
      </dl>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
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
