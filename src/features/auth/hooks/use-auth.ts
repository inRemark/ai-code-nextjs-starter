'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * 统一的认证 Hook（仅支持 NextAuth）
 * 
 * 提供一致的 API 接口，封装 NextAuth 的 useSession
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  }, []);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/');
  }, [router]);

  return {
    // 用户信息
    user: session?.user || null,
    session,
    
    // 加载状态
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    
    // 认证方法
    login,
    logout,
    signIn, // 暴露 NextAuth 的 signIn 用于 OAuth
  };
}
