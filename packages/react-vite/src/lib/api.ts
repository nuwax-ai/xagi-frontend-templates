import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

class ApiClient {
  private instance: AxiosInstance;
  constructor(baseURL: string = '') {
    this.instance = axios.create({
      baseURL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
  }
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          // 服务器返回错误状态码
          const { status } = error.response;
          console.error('API Error:', status, error.message);
        } else if (error.request) {
          // 请求已经发出，但没有收到响应
          console.error('Network Error:', error.message);
        } else {
          // 在设置请求时发生错误
          console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }
}
// 创建默认实例
export const apiClient = new ApiClient();
// 便捷方法 - 返回完整的 AxiosResponse，让调用方自行处理数据结构
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),
};
/**
 * 从 API 响应中提取数据
 * 适配常见后端格式：{ code: 0, data: {...}, message: 'ok' }
 * @param response - Axios 响应对象
 * @returns 提取的数据
 */
export function extractApiData<T = any>(response: AxiosResponse): T {
  const data = response.data;
  // 适配常见后端格式
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  return data;
}

export default ApiClient;