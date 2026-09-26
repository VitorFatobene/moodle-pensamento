import { api } from '../../services/api'
import type { Aviso, AvisoRequest } from '../types/aviso.types'

export async function listarAvisosDaTurma(turmaId: number): Promise<Aviso[]> {
  const response = await api.get<Aviso[]>(`/turmas/${turmaId}/avisos`)
  return response.data
}

export async function criarAviso(
  turmaId: number,
  dados: AvisoRequest,
): Promise<Aviso> {
  const response = await api.post<Aviso>(`/turmas/${turmaId}/avisos`, dados)
  return response.data
}

export async function atualizarAviso(
  avisoId: number,
  dados: AvisoRequest,
): Promise<Aviso> {
  const response = await api.put<Aviso>(`/avisos/${avisoId}`, dados)
  return response.data
}

export async function excluirAviso(avisoId: number): Promise<void> {
  await api.delete(`/avisos/${avisoId}`)
}
