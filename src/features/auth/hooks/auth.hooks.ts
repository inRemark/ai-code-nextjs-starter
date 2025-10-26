import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MeResponse } from './auth.types';
import { hasPermission, Permission } from './rbac.service';
import { logger } from '@logger';
// 自定义Hook用于获取当前用户信息
export function useCurrentUser() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        // 如果认证失败，重定向到登录页
        if (err instanceof Error && err.message.includes('Failed to fetch user')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [router]);

  return { user, loading, error };
}

// 自定义Hook用于处理认证状态
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          setIsAuthenticated(response.ok);
        } catch (error) {
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
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