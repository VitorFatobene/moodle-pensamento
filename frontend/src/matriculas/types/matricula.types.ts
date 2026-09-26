export type StatusMatricula = 'ATIVA' | 'INATIVA'

export interface Matricula {
  id: number
  alunoId: number
  alunoNome: string
  turmaId: number
  turmaNome: string
  dataEntrada: string
  status: StatusMatricula
}
