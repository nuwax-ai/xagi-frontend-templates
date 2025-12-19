/**
 * API 调用示例
 * Code Agent 可参考此文件生成类似的 API 调用代码
 */

import { api, extractApiData } from '@/lib/api';

// ============================================
// 1. 定义通用类型（根据后端实际响应格式调整）
// ============================================

/** 通用 API 响应结构 */
interface ApiResponse<T = any> {
    code: number;
    data: T;
    message: string;
}

/** 分页结果 */
interface PaginatedResult<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}

/** 分页查询参数 */
interface ListParams {
    page: number;
    pageSize: number;
    keyword?: string;
}

/** 通用 ID 类型 */
type ID = string | number;

// ============================================
// 2. 定义业务实体类型
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
// 2. 定义 API 调用函数
// ============================================

export const userApi = {
    /**
     * 获取用户列表（分页）
     */
    getList: async (params: ListParams): Promise<PaginatedResult<User>> => {
        const response = await api.get<ApiResponse<PaginatedResult<User>>>('/api/users', { params });
        return extractApiData(response);
    },

    /**
     * 获取单个用户详情
     */
    getById: async (id: ID): Promise<User> => {
        const response = await api.get<ApiResponse<User>>(`/api/users/${id}`);
        return extractApiData(response);
    },

    /**
     * 创建用户
     */
    create: async (data: CreateUserParams): Promise<User> => {
        const response = await api.post<ApiResponse<User>>('/api/users', data);
        return extractApiData(response);
    },

    /**
     * 更新用户
     */
    update: async (id: ID, data: UpdateUserParams): Promise<User> => {
        const response = await api.put<ApiResponse<User>>(`/api/users/${id}`, data);
        return extractApiData(response);
    },

    /**
     * 删除用户
     */
    delete: async (id: ID): Promise<void> => {
        await api.delete(`/api/users/${id}`);
    },
};

// ============================================
// 3. 在组件中使用示例
// ============================================

/*
import { useApi } from '@/lib/services';
import { userApi } from '@/examples/api-example';

function UserListPage() {
  const { data, loading, error, refetch } = useApi(
    () => userApi.getList({ page: 1, pageSize: 10 }),
    []
  );

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <ul>
      {data?.list.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
*/
