export type StatusSolicitacao = 'PENDENTE' | 'ACEITA' | 'RECUSADA'

export interface SolicitacaoEntrada {
  id: number
  alunoId: number
  alunoNome: string
  turmaId: number
  turmaNome: string
  status: StatusSolicitacao
  dataSolicitacao: string
  dataResposta: string | null
}
