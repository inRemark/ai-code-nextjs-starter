'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api-client';
import { MeResponse } from '@features/auth/types/auth.types';
import { logger } from '@logger';
interface AuthContextType {
  user: MeResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token) {
      try {
        const response = await authAPI.getMe(token);
        if (response.success) {
          setUser(response.data);
        } else {
          // Access token无效，尝试刷新
          await tryRefreshToken();
        }
      } catch (error) {
        logger.error('Failed to refresh user:', error);
        // Access token无效，尝试刷新
        await tryRefreshToken();
      }
    }
    setLoading(false);
  };

  const tryRefreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await authAPI.refreshToken(refreshToken);
        if (response.success) {
          // 更新tokens
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          // 重新获取用户信息
          const userResponse = await authAPI.getMe(response.data.accessToken);
          if (userResponse.success) {
            setUser(userResponse.data);
          }
        } else {
          // 刷新失败，清除所有tokens
          clearTokens();
        }
      } catch (error) {
        logger.error('Failed to refresh token:', error);
        // 刷新失败，清除所有tokens
        clearTokens();
      }
    } else {
      // 没有refresh token，清除所有tokens
      clearTokens();
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setUser(response.data.user);
        
        // 根据用户角色跳转到不同页面
        if (response.data.user.role === 'ADMIN' || response.data.user.role === 'EDITOR') {
          router.push('/admin');
        } else {
          router.push('/profile');
        }
        router.refresh();
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register(email, password, name);
      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setUser(response.data);
        router.push('/profile');
        router.refresh();
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await authAPI.logout(token);
      } catch (error) {
        logger.error('Logout error:', error);
      }
    }
    
    // 清除本地存储
    clearTokens();
    router.push('/auth/login');
    router.refresh();
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}