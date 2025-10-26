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
  avatar: string | null;
  role: UserRole;
  createdAt: Date;
}

// 更新用户信息请求
export interface UpdateMeRequest {
  name: string;
}