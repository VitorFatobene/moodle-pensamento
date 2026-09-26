export type StatusAtividade = 'ATIVA' | 'INATIVA'

export interface Atividade {
  id: number
  titulo: string
  descricao: string
  dataCriacao: string
  dataLimite: string | null
  notaMaxima: number | null
  turmaId: number
  turmaNome: string
  professorId: number
  professorNome: string
  status: StatusAtividade
}

export interface AtividadeRequest {
  titulo: string
  descricao: string
  dataLimite: string | null
  notaMaxima: number | null
}
