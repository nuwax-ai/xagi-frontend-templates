// React Hook 封装示例
import { useState, useEffect, useCallback } from 'react';
import { fetchEventSource, EventSourceMessage } from '@microsoft/fetch-event-source';

/**
 * 通用 API 请求 Hook
 * 主要用于处理 GET 请求等需要获取数据的场景，自动处理 loading 和 error 状态。
 * 
 * 特性：
 * 1. 自动处理 loading 状态
 * 2. 统一错误处理：将各种错误（包括 ApiError）标准化为 Error 对象
 * 3. 支持依赖刷新
 * 
 * @param apiCall - 返回 Promise 的 API 调用函数
 * @param deps - 依赖数组，类似 useEffect 的 deps。默认 []，即组件挂载时调用一次。
 * 
 * @example
 * const { data, loading, error } = useApi(() => userApi.getUserInfo());
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      // 统一错误处理：如果是 ApiError (plain object) 则转换为 Error 对象
      const errorObj = err instanceof Error ? err : new Error(err?.message || 'Unknown error');
      setError(errorObj);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * 流式响应数据结构 - 通用类型，可根据实际接口调整
 * 使用泛型 T 允许任意数据结构，不强制特定字段
 */
export type StreamResponse<T = any> = T;



/**
 * 流式接口调用示例
 * @param url 请求地址
 * @param data 请求数据
 * @param onData 接收到数据时的回调
 * @param onError 发生错误时的回调
 */
export async function streamRequest<T>(
  url: string,
  data: any,
  onData: (response: StreamResponse<T>) => void,
  onError?: (error: Error) => void
) {
  try {
    await fetchEventSource(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      onmessage(msg: EventSourceMessage) {
        if (msg.event === 'FatalError') {
          throw new Error(msg.data);
        }
        try {
          // 解析为任意结构，不强制特定格式
          const parsed = JSON.parse(msg.data) as StreamResponse<T>;
          onData(parsed);
        } catch (e) {
          console.warn('Failed to parse stream chunk:', msg.data);
        }
      },
      onerror(err: any) {
        if (onError) {
          onError(err as Error);
        } else {
          console.error('Stream request failed:', err);
        }
        // 抛出错误以停止重试
        throw err;
      }
    });
  } catch (error) {
    if (onError) {
      onError(error as Error);
    }
  }
}