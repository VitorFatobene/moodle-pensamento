import { api } from '../../services/api'
import type { LoginRequest, LoginResponse } from '../types/auth.types'

export async function login(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials)
  return response.data
}
