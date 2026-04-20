import {
  fetchEventSource,
  type EventSourceMessage,
} from '@microsoft/fetch-event-source';
import { onMounted, ref, type Ref, watch, type WatchSource } from 'vue';
import { api, extractApiData, type ApiResponse } from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface ListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

export interface ListResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const userApi = {
  async getUserInfo(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/user/info');
    return extractApiData<User>(response);
  },
  async updateUserInfo(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/user/info', data);
    return extractApiData<User>(response);
  },
};

export const exampleApi = {
  async getList(params: ListParams): Promise<ListResult<unknown>> {
    const response = await api.get<ApiResponse<ListResult<unknown>>>(
      '/example/list',
      { params }
    );
    return extractApiData<ListResult<unknown>>(response);
  },
  async create(data: unknown): Promise<unknown> {
    const response = await api.post<ApiResponse<unknown>>(
      '/example/create',
      data
    );
    return extractApiData(response);
  },
  async update(id: number, data: unknown): Promise<unknown> {
    const response = await api.put<ApiResponse<unknown>>(
      `/example/update/${id}`,
      data
    );
    return extractApiData(response);
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/example/delete/${id}`);
  },
  async getDetail(id: number): Promise<unknown> {
    const response = await api.get<ApiResponse<unknown>>(
      `/example/detail/${id}`
    );
    return extractApiData(response);
  },
};

interface UseApiOptions {
  immediate?: boolean;
  watchSources?: WatchSource[];
}

/**
 * Vue-friendly async state helper aligned with react-vite semantics:
 * - loading / error state
 * - explicit execute()
 * - refetch alias
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: () => Promise<void>;
  refetch: () => Promise<void>;
} {
  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      data.value = await apiCall();
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
    } finally {
      loading.value = false;
    }
  };

  if (options.immediate ?? true) {
    onMounted(execute);
  }

  if (options.watchSources && options.watchSources.length > 0) {
    watch(options.watchSources, () => {
      void execute();
    });
  }

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
}

export type StreamResponse<T = unknown> = T;

export async function streamRequest<T>(
  url: string,
  payload: unknown,
  onData: (response: StreamResponse<T>) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    await fetchEventSource(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      onmessage(msg: EventSourceMessage) {
        if (msg.event === 'FatalError') {
          throw new Error(msg.data);
        }
        try {
          onData(JSON.parse(msg.data) as StreamResponse<T>);
        } catch {
          console.warn('Failed to parse stream chunk:', msg.data);
        }
      },
      onerror(err) {
        if (onError) {
          onError(err as Error);
        }
        throw err;
      },
    });
  } catch (err) {
    if (onError) {
      onError(err as Error);
    }
  }
}
