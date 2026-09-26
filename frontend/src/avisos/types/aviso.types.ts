export type StatusAviso = 'ATIVO' | 'INATIVO'

export interface Aviso {
  id: number
  titulo: string
  conteudo: string
  turmaId: number
  turmaNome: string
  professorId: number
  professorNome: string
  dataCriacao: string
  dataAtualizacao: string | null
  status: StatusAviso
}

export interface AvisoRequest {
  titulo: string
  conteudo: string
}
