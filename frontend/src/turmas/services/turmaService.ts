import { api } from '../../services/api'
import type { CriarTurmaRequest, Turma } from '../types/turma.types'

export async function listarTurmas(): Promise<Turma[]> {
  const response = await api.get<Turma[]>('/turmas')
  return response.data
}

export async function listarTurmasDoProfessor(professorId: number): Promise<Turma[]> {
  const response = await api.get<Turma[]>(`/turmas/professor/${professorId}`)
  return response.data
}

export async function criarTurma(dados: CriarTurmaRequest): Promise<Turma> {
  const response = await api.post<Turma>('/turmas', dados)
  return response.data
}

export async function buscarTurmaPorId(id: number): Promise<Turma> {
  const response = await api.get<Turma>(`/turmas/${id}`)
  return response.data
}
