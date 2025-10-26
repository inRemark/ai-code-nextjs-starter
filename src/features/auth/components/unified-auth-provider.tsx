'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MeResponse } from '@features/auth/types/auth.types';

interface AuthContextType {
  user: MeResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UnifiedAuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 从NextAuth session获取用户信息 - 按照文档架构只处理NextAuth
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // 将NextAuth session转换为MeResponse格式
      const authUser: MeResponse = {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || null,
        avatar: null, // NextAuth session中不包含avatar字段
        role: ((session.user as { role?: string }).role || 'USER') as MeResponse['role'],
        createdAt: new Date(),
      };
      setUser(authUser);
      setLoading(false);
      
      // 登录成功后跳转到profile
      if (window.location.pathname === '/auth/login') {
        router.push('/profile');
      }
    } else if (status === 'unauthenticated') {
      // 按照文档架构，Web端不再支持JWT，仅使用NextAuth
      setUser(null);
      setLoading(false);
      
      // 如果在受保护的页面但未认证，则跳转到登录页
      const protectedRoutes = ['/console', '/profile', '/mail', '/templates', '/reports'];
      if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
        router.push('/auth/login');
      }
    }
  }, [session, status, router]);

  // 按照文档架构，Web端仅使用NextAuth，不再需要JWT相关逻辑
  const refreshUser = async () => {
    // NextAuth会自动处理session刷新，无需手动操作
    router.refresh();
  };

    const login = async (email: string, password: string) => {
      // 使用NextAuth的signIn进行登录
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        // 登录成功，等待session更新后再跳转
        // 使用useSession hook监听session状态变化
        // 在LoginForm中处理跳转逻辑
        return Promise.resolve();
      } else {
        throw new Error('Login failed');
      }
    };

    const register = async (email: string, password: string, name: string) => {
      // 调用注册API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      // 注册成功后自动登录
      await login(email, password);
    };

  const logout = async () => {
    // 按照文档架构，Web端使用NextAuth登出
    await signOut({ redirect: false });
    
    // 清除本地状态
    setUser(null);
    
    // 跳转到登录页面
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UnifiedAuthProvider');
  }
  return context;
}
