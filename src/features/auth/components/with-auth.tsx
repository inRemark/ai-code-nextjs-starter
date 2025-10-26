'use client';

import { useAuth } from '@features/auth/components/unified-auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// 高阶组件：用于包装需要认证的页面组件
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requireAdmin = false
) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      } else if (requireAdmin && user && user.role !== 'ADMIN') {
        router.push('/unauthorized');
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!user || (requireAdmin && user.role !== 'ADMIN')) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}