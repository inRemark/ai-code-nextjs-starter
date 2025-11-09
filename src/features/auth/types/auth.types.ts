import { User, UserRole } from '@prisma/client';

// 注册请求体
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

// 登录请求体
export interface LoginRequest {
  email: string;
  password: string;
}

// 认证响应（现在只返回用户信息，不包含token）
export interface AuthResponse {
  user: Pick<User, 'id' | 'email' | 'name' | 'role'>;
}

// Session Token响应（用于移动端）
export interface SessionTokenResponse {
  sessionToken: string;
  expiresAt: Date;
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
 * 适用于Web端（NextAuth）和移动端（Session Token）
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

/**
 * @deprecated 使用 AuthUser 替代
 * 为保持向后兼容暂时保留
 */
export type AuthenticatedUser = AuthUser;