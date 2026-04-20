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
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          // HTTP error status from server
          const { status } = error.response;
          console.error('API Error:', status, error.message);
        } else if (error.request) {
          // Request sent but no response body
          console.error('Network Error:', error.message);
        } else {
          // Error while building the request
          console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
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
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
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
// Default shared client
export const apiClient = new ApiClient();
// Thin wrappers — return full AxiosResponse; callers shape `response.data`
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
 * Unwrap payload from common API envelopes, e.g. `{ code, data, message }`.
 * @param response - Axios response
 * @returns Inner `data` when present, otherwise `response.data`
 */
export function extractApiData<T = any>(response: AxiosResponse): T {
  const data = response.data;
  // Common `{ data: T }` envelope
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  return data;
}

export default ApiClient;
