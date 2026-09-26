export type TipoUsuario = 'PROFESSOR' | 'ALUNO'

export interface UsuarioAutenticado {
  id: number
  nome: string
  email: string
  tipoUsuario: TipoUsuario
}

export interface LoginResponse {
  token: string
  tipo: string
  usuarioId: number
  nome: string
  email: string
  tipoUsuario: TipoUsuario
}

export interface LoginRequest {
  email: string
  senha: string
}
