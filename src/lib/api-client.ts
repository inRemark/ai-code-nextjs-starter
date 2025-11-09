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

// 简化的 API 客户端（使用 fetch）
export const api = {
  // GET请求
  get: async <T = unknown>(url: string, params?: Record<string, string | number>): Promise<ApiResponse<T>> => {
    const queryString = params 
      ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
      : '';
    
    const response = await fetch(`/api${url}${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    return handleResponse(response);
  },

  // POST请求
  post: async <T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    const response = await fetch(`/api${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },

  // PUT请求
  put: async <T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    const response = await fetch(`/api${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },

  // PATCH请求
  patch: async <T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    const response = await fetch(`/api${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },

  // DELETE请求
  delete: async <T = unknown>(url: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`/api${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    return handleResponse(response);
  },
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
  referralCode?: string;
}

interface UpdateUserRoleData {
  userId: string;
  role: string;
}

// 认证相关API - 现在主要用于移动端
export const authAPI = {
  // 注册（仍需要用于注册流程）
  register: async (email: string, password: string, name?: string, referralCode?: string) => {
    const data: RegisterData = { email, password, name, referralCode };
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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