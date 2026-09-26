import { api } from '../../services/api'
import type {
  EntregaAtividade,
  EntregaAtividadeRequest,
  NotaEntregaRequest,
} from '../types/entrega.types'

export async function listarEntregasDaAtividade(
  atividadeId: number,
): Promise<EntregaAtividade[]> {
  const response = await api.get<EntregaAtividade[]>(
    `/atividades/${atividadeId}/entregas`,
  )
  return response.data
}

export async function atribuirNota(
  entregaId: number,
  dados: NotaEntregaRequest,
): Promise<EntregaAtividade> {
  const response = await api.patch<EntregaAtividade>(
    `/entregas/${entregaId}/nota`,
    dados,
  )
  return response.data
}

export async function salvarEntrega(
  atividadeId: number,
  dados: EntregaAtividadeRequest,
): Promise<EntregaAtividade> {
  const response = await api.post<EntregaAtividade>(
    `/atividades/${atividadeId}/entregas`,
    dados,
  )
  return response.data
}

export async function concluirAtividade(
  atividadeId: number,
): Promise<EntregaAtividade> {
  const response = await api.patch<EntregaAtividade>(
    `/atividades/${atividadeId}/concluir`,
  )
  return response.data
}

export async function listarMinhasEntregas(): Promise<EntregaAtividade[]> {
  const response = await api.get<EntregaAtividade[]>('/minhas-entregas')
  return response.data
}

export async function buscarMinhaEntregaDaAtividade(
  atividadeId: number,
): Promise<EntregaAtividade | null> {
  const entregas = await listarMinhasEntregas()
  return entregas.find((entrega) => entrega.atividadeId === atividadeId) ?? null
}
