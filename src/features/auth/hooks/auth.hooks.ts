import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MeResponse } from '../types/auth.types';
import { hasPermission, Permission } from '../services/rbac.service';
import { logger } from '@logger';

/**
 * 自定义Hook用于获取当前用户信息
 * 使用NextAuth session替代localStorage
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(status === 'loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(status === 'loading');
    
    if (status === 'unauthenticated') {
      setError('User is not authenticated');
    } else if (status === 'authenticated') {
      setError(null);
    }
  }, [status]);

  const user: MeResponse | null = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name || null,
    avatar: null, // NextAuth session不包含avatar
    role: session.user.role,
    createdAt: new Date(), // Session中没有createdAt，使用当前时间
  } : null;

  return { user, loading, error };
}

/**
 * 自定义Hook用于处理认证状态
 * 使用NextAuth session替代localStorage token检查
 */
export function useAuth() {
  const { status } = useSession();

  return {
    isAuthenticated: status === 'authenticated',
    loading: status === 'loading',
  };
}

// 自定义Hook用于检查用户权限
export function usePermission(permission: Permission) {
  const [hasPerm, setHasPerm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useCurrentUser();

  useEffect(() => {
    const checkPermission = async () => {
      if (user) {
        try {
          const result = await hasPermission(user.id, permission);
          setHasPerm(result);
        } catch (error) {
          logger.error('Permission check failed:', error);
          setHasPerm(false);
        }
      }
      setLoading(false);
    };

    checkPermission();
  }, [user, permission]);

  return { hasPerm, loading };
}