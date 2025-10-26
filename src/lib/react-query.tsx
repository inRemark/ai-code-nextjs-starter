'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

// 创建QueryClient实例的工厂函数
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // 数据保持新鲜的时间（5分钟）
      staleTime: 5 * 60 * 1000,
      // 缓存时间（10分钟）
      gcTime: 10 * 60 * 1000,
      // 重试次数
      retry: (failureCount, error: unknown) => {
        // 4xx错误不重试
        const httpError = error as { response?: { status?: number } };
        if (httpError?.response?.status && httpError.response.status >= 400 && httpError.response.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      // 重试延迟
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 不在窗口聚焦时自动重新获取
      refetchOnWindowFocus: false,
      // 不在重新连接时自动重新获取  
      refetchOnReconnect: true,
      // 网络错误时暂停重试
      networkMode: 'online',
    },
    mutations: {
      // 变更重试次数
      retry: 1,
      // 变更重试延迟
      retryDelay: 1000,
      // 网络错误时暂停重试
      networkMode: 'online',
    },
  },
});

// React Query Provider组件
interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}