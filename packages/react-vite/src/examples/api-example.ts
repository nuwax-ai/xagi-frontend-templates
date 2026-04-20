/**
 * API usage reference — patterns for typed calls and `extractApiData`.
 * Agents can mirror this structure when generating API layers.
 */

import { api, extractApiData } from '@/lib/api';

// ============================================
// 1. Shared types (align with your backend contract)
// ============================================

/** Typical wrapped API response */
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

/** Paginated list payload */
interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** List query parameters */
interface ListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

/** Identifier accepted by the API */
type ID = string | number;

// ============================================
// 2. Domain entities
// ============================================

interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

interface UpdateUserParams {
  name?: string;
  email?: string;
  avatar?: string;
}

// ============================================
// 3. API functions
// ============================================

export const userApi = {
  /** Paginated user list */
  getList: async (params: ListParams): Promise<PaginatedResult<User>> => {
    const response = await api.get<ApiResponse<PaginatedResult<User>>>(
      '/api/users',
      { params }
    );
    return extractApiData(response);
  },

  /** Single user by id */
  getById: async (id: ID): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/api/users/${id}`);
    return extractApiData(response);
  },

  /** Create user */
  create: async (data: CreateUserParams): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/api/users', data);
    return extractApiData(response);
  },

  /** Update user */
  update: async (id: ID, data: UpdateUserParams): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/api/users/${id}`, data);
    return extractApiData(response);
  },

  /** Delete user */
  delete: async (id: ID): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  },
};

// ============================================
// 4. Usage inside a component (commented)
// ============================================

/*
import { useApi } from '@/lib/services';
import { userApi } from '@/examples/api-example';

function UserListPage() {
  const { data, loading, error, refetch } = useApi(
    () => userApi.getList({ page: 1, pageSize: 10 }),
    []
  );

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.list.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
*/
