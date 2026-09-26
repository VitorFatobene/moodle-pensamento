import { api } from '../../services/api'
import type { Atividade, AtividadeRequest } from '../types/atividade.types'

export async function listarAtividadesDaTurma(
  turmaId: number,
): Promise<Atividade[]> {
  const response = await api.get<Atividade[]>(`/turmas/${turmaId}/atividades`)
  return response.data
}

export async function criarAtividade(
  turmaId: number,
  dados: AtividadeRequest,
): Promise<Atividade> {
  const response = await api.post<Atividade>(`/turmas/${turmaId}/atividades`, dados)
  return response.data
}

export async function atualizarAtividade(
  atividadeId: number,
  dados: AtividadeRequest,
): Promise<Atividade> {
  const response = await api.put<Atividade>(`/atividades/${atividadeId}`, dados)
  return response.data
}

export async function excluirAtividade(atividadeId: number): Promise<void> {
  await api.delete(`/atividades/${atividadeId}`)
}
