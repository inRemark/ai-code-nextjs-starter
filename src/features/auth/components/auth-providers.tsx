'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface AuthProvidersProps {
  children: ReactNode;
}

/**
 * NextAuth SessionProvider 包装组件
 */
export function AuthProviders({ children }: AuthProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
