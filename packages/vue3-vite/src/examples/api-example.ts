/**
 * API usage reference for Vue template.
 * Mirrors react-vite conventions while keeping Vue-friendly consumption.
 */
import { api, extractApiData, type ApiResponse } from '@/lib/api'

type ID = string | number

export interface PaginatedResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface ListParams {
  page: number
  pageSize: number
  keyword?: string
}

export interface User {
  id: ID
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface CreateUserParams {
  name: string
  email: string
  password: string
  role?: 'admin' | 'user'
}

export interface UpdateUserParams {
  name?: string
  email?: string
  avatar?: string
}

export const userApi = {
  async getList(params: ListParams): Promise<PaginatedResult<User>> {
    const response = await api.get<ApiResponse<PaginatedResult<User>>>('/api/users', { params })
    return extractApiData<PaginatedResult<User>>(response)
  },
  async getById(id: ID): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/api/users/${id}`)
    return extractApiData<User>(response)
  },
  async create(data: CreateUserParams): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/api/users', data)
    return extractApiData<User>(response)
  },
  async update(id: ID, data: UpdateUserParams): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/api/users/${id}`, data)
    return extractApiData<User>(response)
  },
  async delete(id: ID): Promise<void> {
    await api.delete(`/api/users/${id}`)
  },
}
