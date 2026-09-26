import { api } from '../../services/api'
import type { EntregaAtividade, NotaEntregaRequest } from '../types/entrega.types'

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
