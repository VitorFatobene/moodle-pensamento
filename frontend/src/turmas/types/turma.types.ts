export type StatusTurma = 'ATIVA' | 'INATIVA'

export interface Turma {
  id: number
  nome: string
  descricao: string | null
  codigoEntrada: string
  professorId: number
  professorNome: string
  status: StatusTurma
}

export interface CriarTurmaRequest {
  nome: string
  descricao: string
}
