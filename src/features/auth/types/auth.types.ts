import { User, UserRole } from '@prisma/client';

// 认证响应（现在只返回用户信息，不包含token）
export interface AuthResponse {
  user: Pick<User, 'id' | 'email' | 'name' | 'role'>;
}

// 当前用户信息响应
export interface MeResponse {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// 更新用户信息请求
export interface UpdateMeRequest {
  name: string;
}

/**
 * 统一的认证用户类型
 * 用于中间件和API路由中的用户信息传递
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}
