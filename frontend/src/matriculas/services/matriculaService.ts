import { api } from '../../services/api'
import type { Matricula } from '../types/matricula.types'

export async function listarAlunosDaTurma(turmaId: number): Promise<Matricula[]> {
  const response = await api.get<Matricula[]>(`/turmas/${turmaId}/alunos`)
  return response.data
}

export async function listarMinhasTurmas(): Promise<Matricula[]> {
  const response = await api.get<Matricula[]>('/minhas-turmas')
  return response.data
}

export async function removerAlunoDaTurma(
  turmaId: number,
  alunoId: number,
): Promise<void> {
  await api.delete(`/turmas/${turmaId}/alunos/${alunoId}`)
}
