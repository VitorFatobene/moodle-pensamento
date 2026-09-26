export type StatusEntrega = 'PENDENTE' | 'CONCLUIDA'

export interface EntregaAtividade {
  id: number
  atividadeId: number
  atividadeTitulo: string
  alunoId: number
  alunoNome: string
  status: StatusEntrega
  linkEntrega: string | null
  nota: number | null
  dataConclusao: string | null
}

export interface NotaEntregaRequest {
  nota: number
}

export interface EntregaAtividadeRequest {
  linkEntrega: string | null
}
