import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL } from "./endpoints";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token retrieval utility
const getToken = (): string | null => {
  // Check if localStorage is available (client-side only)
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("auth_token");
  }
  return null;
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Note: Merchant context is now managed by user state, not storage

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Clear auth token from localStorage
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("auth_token");
      }

      // Redirect to login
      window.location.href = "/_auth/login";
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error("Access forbidden:", error.response.data.message);
    }

    if (error.response?.status >= 500) {
      // Server error
      console.error(
        "Server error:",
        error.response.data.message || "Internal server error"
      );
    }

    return Promise.reject(error);
  }
);

// API response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// Generic API methods
export const api = {
  // GET request
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.get(url, config).then((response) => response.data),

  // POST request
  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.post(url, data, config).then((response) => response.data),

  // PUT request
  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.put(url, data, config).then((response) => response.data),

  // PATCH request
  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.patch(url, data, config).then((response) => response.data),

  // DELETE request
  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient.delete(url, config).then((response) => response.data),

  // Upload file
  upload: <T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    apiClient
      .post(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data),
};

// Export the axios instance for direct use if needed
export { apiClient };
export default api;
