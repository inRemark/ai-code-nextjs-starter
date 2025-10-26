import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API错误详情类型
export interface ApiErrorDetails {
  [key: string]: unknown;
}

// API错误类型
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: ApiErrorDetails;
}

// 创建Axios实例
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: '/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  client.interceptors.request.use(
    (config) => {
      // 使用credentials: 'include'自动携带NextAuth session cookie
      config.withCredentials = true;

      // 添加请求ID用于追踪
      config.headers['X-Request-ID'] = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 开发环境日志
      if (process.env.NODE_ENV === 'development') {
        console.warn('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          params: config.params,
        });
      }

      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  client.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
      // 开发环境日志
      if (process.env.NODE_ENV === 'development') {
        console.warn('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }

      return response;
    },
    async (error) => {
      // 统一错误处理
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        status: error.response?.status,
      };

      if (error.response) {
        // 服务器返回错误状态码
        apiError.message = error.response.data?.message || error.response.data?.error || `HTTP ${error.response.status}`;
        apiError.status = error.response.status;
        apiError.code = error.response.data?.code;
        apiError.details = error.response.data?.details;

        // 处理特定状态码
        switch (error.response.status) {
          case 401:
            // 未授权，重定向到登录页
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            break;
          case 403:
            apiError.message = 'Access denied. You do not have permission to perform this action.';
            break;
          case 404:
            apiError.message = 'Resource not found.';
            break;
          case 422:
            apiError.message = 'Validation failed. Please check your input.';
            break;
          case 429:
            apiError.message = 'Too many requests. Please try again later.';
            break;
          case 500:
            apiError.message = 'Internal server error. Please try again later.';
            break;
        }
      } else if (error.request) {
        // 网络错误
        apiError.message = 'Network error. Please check your connection.';
      } else {
        // 其他错误
        apiError.message = error.message || 'An unexpected error occurred';
      }

      console.error('❌ API Error:', apiError);
      return Promise.reject(apiError);
    }
  );

  return client;
};

// 创建API客户端实例
export const apiClient = createApiClient();

// API方法包装器
export class ApiService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  // GET请求
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  // POST请求
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // PUT请求
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // PATCH请求
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // DELETE请求
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // 文件上传
  async upload<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });

    return response.data;
  }

  // 批量上传
  async uploadMultiple<T>(url: string, files: File[], config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });

    return response.data;
  }

  // 下载文件
  async download(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    const response = await this.client.get(url, {
      ...config,
      responseType: 'blob',
    });
    return response.data;
  }
}

// 创建API服务实例
export const api = new ApiService(apiClient);

// 模板API接口
interface TemplateCreateData {
  name: string;
  content: string;
  subject?: string;
  [key: string]: unknown;
}

interface TemplateUpdateData {
  name?: string;
  content?: string;
  subject?: string;
  [key: string]: unknown;
}

interface TemplatePreviewVariables {
  [key: string]: unknown;
}

interface TemplateValidateData {
  content: string;
  [key: string]: unknown;
}

// 邮件API接口
interface MailSendData {
  to: string;
  subject: string;
  html: string;
  [key: string]: unknown;
}

// 具体业务API服务
export const templateApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/templates', { params }),
  getById: (id: string) => api.get(`/templates/${id}`),
  create: (data: TemplateCreateData) => api.post('/templates', data),
  update: (id: string, data: TemplateUpdateData) => api.put(`/templates/${id}`, data),
  delete: (id: string) => api.delete(`/templates/${id}`),
  duplicate: (id: string, name?: string) => api.post(`/templates/${id}/duplicate`, { name }),
  preview: (id: string, variables: TemplatePreviewVariables) => api.post(`/templates/${id}/preview`, { variables }),
  validate: (data: TemplateValidateData) => api.post('/templates/validate', data),
  getPredefined: () => api.get('/templates/predefined'),
};

export const mailApi = {
  sendTest: (data: MailSendData) => api.post('/mail/test', data),
  sendNotification: (data: MailSendData) => api.post('/mail', data),
  getQueueStats: () => api.get('/mail/queue/stats'),
};

// 通用响应处理函数
async function handleResponse(response: Response) {
  try {
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON response');
    }
    throw error;
  }
}

// 认证相关API数据接口
interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateUserData {
  name: string;
}

interface UpdateUserRoleData {
  userId: string;
  role: string;
}

// 认证相关API - 现在主要用于移动端
export const authAPI = {
  // 注册（仍需要用于注册流程）
  register: async (email: string, password: string, name?: string) => {
    const data: RegisterData = { email, password, name };
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },

  // 移动端登录
  mobileLogin: async (email: string, password: string) => {
    const data: LoginData = { email, password };
    const response = await fetch('/api/auth/mobile/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },

  // 移动端刷新令牌
  mobileRefreshToken: async (sessionToken: string) => {
    const response = await fetch('/api/auth/mobile/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
      },
    });
    
    return handleResponse(response);
  },

  // 移动端登出
  mobileLogout: async (sessionToken: string) => {
    const response = await fetch('/api/auth/mobile/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
      },
    });
    
    return handleResponse(response);
  },

  // 获取当前用户信息（支持Web端和移动端）
  getMe: async () => {
    const response = await fetch('/api/auth/me', {
      credentials: 'include', // 自动携带NextAuth session cookie
    });
    
    return handleResponse(response);
  },

  // 更新当前用户信息
  updateMe: async (name: string) => {
    const data: UpdateUserData = { name };
    const response = await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 自动携带NextAuth session cookie
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
};

// 用户管理API
export const userAPI = {
  // 获取用户列表
  getUsers: async (page: number = 1, limit: number = 10) => {
    const response = await fetch(`/api/admin/users?page=${page}&limit=${limit}`, {
      credentials: 'include', // 自动携带NextAuth session cookie
    });
    
    return handleResponse(response);
  },

  // 更新用户角色
  updateUserRole: async (userId: string, role: string) => {
    const data: UpdateUserRoleData = { userId, role };
    const response = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 自动携带NextAuth session cookie
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
};

export default api;