'use client';

import { SessionProvider } from 'next-auth/react';
import { UnifiedAuthProvider } from '@features/auth/components/unified-auth-provider';
import type { ReactNode } from 'react';

interface AuthProvidersProps {
  children: ReactNode;
}

/**
 * 认证相关的 Providers 包装组件
 * 将 SessionProvider 和 UnifiedAuthProvider 封装在一个 Client Component 中
 */
export function AuthProviders({ children }: AuthProvidersProps) {
  return (
    <SessionProvider>
      <UnifiedAuthProvider>{children}</UnifiedAuthProvider>
    </SessionProvider>
  );
}
