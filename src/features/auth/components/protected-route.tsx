'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: Readonly<ProtectedRouteProps>) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === 'loading';
  const user = session?.user;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && requireAdmin && user.role !== 'ADMIN') {
      router.push('/unauthorized');
    }
  }, [user, loading, router, requireAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 如果需要管理员权限但用户不是管理员
  if (user && requireAdmin && user.role !== 'ADMIN') {
    return null;
  }

  // 如果用户已认证（且满足管理员要求，如果有的话）
  if (user && (!requireAdmin || user.role === 'ADMIN')) {
    return children;
  }

  return null;
}