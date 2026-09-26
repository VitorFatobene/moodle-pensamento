import type { SolicitacaoEntrada } from '../types/solicitacao.types'

interface SolicitacaoCardProps {
  solicitacao: SolicitacaoEntrada
}

export function SolicitacaoCard({ solicitacao }: SolicitacaoCardProps) {
  return (
    <article className="turma-card">
      <div className="turma-card-header">
        <h2>{solicitacao.turmaNome}</h2>
        <span className="turma-status">{solicitacao.status}</span>
      </div>

      <dl className="turma-meta">
        <div>
          <dt>Solicitada em</dt>
          <dd>{formatarData(solicitacao.dataSolicitacao)}</dd>
        </div>
        {solicitacao.dataResposta ? (
          <div>
            <dt>Respondida em</dt>
            <dd>{formatarData(solicitacao.dataResposta)}</dd>
          </div>
        ) : null}
      </dl>
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
