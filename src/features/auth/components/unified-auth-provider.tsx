'use client';

import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import type { MeResponse } from '@features/auth/types/auth.types';
import type { Session } from 'next-auth';

interface AuthContextType {
  user: MeResponse | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 将 NextAuth Session 转换为业务层 MeResponse 格式
 */
function transformSessionToUser(session: Session | null): MeResponse | null {
  if (!session?.user) return null;

  return {
    id: session.user.id || '',
    email: session.user.email || '',
    name: session.user.name || null,
    avatar: null,
    role: ((session.user as { role?: string }).role || 'USER') as MeResponse['role'],
    createdAt: new Date(),
  };
}

/**
 * 统一认证Provider - 封装NextAuth，提供业务级认证API
 * 
 * 职责：
 * 1. 将NextAuth session转换为业务MeResponse格式
 * 2. 提供统一的login/register/logout方法
 * 3. 管理认证状态（user/loading/isAuthenticated）
 * 
 * 注意：路由跳转逻辑应由各组件自行处理，不在Provider中处理
 */
export function UnifiedAuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { data: session, status } = useSession();

  // 转换 session 为业务用户对象
  const user = useMemo(() => transformSessionToUser(session), [session]);

  const loading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  /**
   * 登录方法 - 使用 NextAuth credentials provider
   * @throws {Error} 登录失败时抛出错误
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    if (!result?.ok) {
      throw new Error('Login failed');
    }
  }, []);

  /**
   * 注册方法 - 调用注册API后自动登录
   * @throws {Error} 注册或登录失败时抛出错误
   */
  const register = useCallback(async (email: string, password: string, name: string): Promise<void> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Registration failed');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Registration failed');
    }

    // 注册成功后自动登录
    const loginResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (loginResult?.error || !loginResult?.ok) {
      throw new Error('Auto-login after registration failed');
    }
  }, []);

  /**
   * 登出方法 - 使用 NextAuth signOut
   * 注意：不在这里处理路由跳转，由调用组件决定跳转逻辑
   */
  const logout = useCallback(async (): Promise<void> => {
    await signOut({ redirect: false });
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [user, loading, isAuthenticated, login, register, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook - 获取认证上下文
 * @throws {Error} 必须在 UnifiedAuthProvider 内部使用
 * 
 * @example
 * ```tsx
 * const { user, loading, isAuthenticated, login, logout } = useAuth();
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UnifiedAuthProvider');
  }
  return context;
}
