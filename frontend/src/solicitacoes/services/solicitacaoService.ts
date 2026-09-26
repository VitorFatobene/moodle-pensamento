import { api } from '../../services/api'
import type { SolicitacaoEntrada } from '../types/solicitacao.types'

export async function solicitarEntrada(turmaId: number): Promise<SolicitacaoEntrada> {
  const response = await api.post<SolicitacaoEntrada>(
    `/turmas/${turmaId}/solicitacoes`,
  )
  return response.data
}

export async function listarMinhasSolicitacoes(): Promise<SolicitacaoEntrada[]> {
  const response = await api.get<SolicitacaoEntrada[]>('/minhas-solicitacoes')
  return response.data
}

export async function listarSolicitacoesPendentesDaTurma(
  turmaId: number,
): Promise<SolicitacaoEntrada[]> {
  const response = await api.get<SolicitacaoEntrada[]>(
    `/turmas/${turmaId}/solicitacoes`,
  )
  return response.data
}

export async function aceitarSolicitacao(
  solicitacaoId: number,
): Promise<SolicitacaoEntrada> {
  const response = await api.patch<SolicitacaoEntrada>(
    `/solicitacoes/${solicitacaoId}/aceitar`,
  )
  return response.data
}

export async function recusarSolicitacao(
  solicitacaoId: number,
): Promise<SolicitacaoEntrada> {
  const response = await api.patch<SolicitacaoEntrada>(
    `/solicitacoes/${solicitacaoId}/recusar`,
  )
  return response.data
}
