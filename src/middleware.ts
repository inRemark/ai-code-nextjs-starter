import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// 注意：在middleware中不能直接导入NextAuth配置，因为可能会导致Edge Runtime中的问题
// import { getServerSession } from 'next-auth/next';
// import { authConfig } from '@features/auth/services/next-auth.config';

// 在middleware中使用简化的认证检查
import { getToken } from 'next-auth/jwt';
import { logger } from '@logger';

// 定义开放页面路由（无需认证即可访问）
const publicRoutes = [
  '/',
  '/portal',
  '/about',
  '/help',
  '/blog',
  '/pricing',
  '/login',
  '/register',
  '/api/auth',
  // AICoder 相关页面（无需认证）
  '/explore',
];

// 定义用户受保护路由（需要登录用户访问）
const userProtectedRoutes = [
  '/profile',
  '/console',
  '/test-iframe',
  '/test-worker',
  '/test-routing',
  '/test-performance',
];

// 定义管理员受保护路由（需要超级管理员访问）
const adminProtectedRoutes = [
  '/admin',
];

// 定义需要保护的路由（除开放页面外的所有受保护路由）
const protectedRoutes = [
  '/profile',
  '/mail',
  '/templates',
  '/reports',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否为公共路由
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // 如果是公共路由，直接通过
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 检查是否为受保护路由
  const isUserProtectedRoute = userProtectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  const isAdminProtectedRoute = adminProtectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  const isOtherProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // 如果不是受保护的路由，直接通过
  if (!isUserProtectedRoute && !isAdminProtectedRoute && !isOtherProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // 使用简化的认证检查避免Edge Runtime问题
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Middleware token check:', {
        hasToken: !!token,
        userId: token?.sub,
        userRole: token?.role,
        pathname
      });
    }
    
    if (!token?.sub) {
      if (process.env.NODE_ENV === 'development') {
        logger.warn('No valid token found, redirecting to login');
      }
      // 检查是否已经在登录页面，避免重定向循环
      if (pathname === '/login') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // 如果用户已认证但试图访问登录页面，则重定向到profile
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
    
    const userRole = token.role;
    if (isAdminProtectedRoute && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    if (pathname.startsWith('/console') && userRole !== 'ADMIN' && userRole !== 'EDITOR') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      logger.error('Middleware auth error:', err);
    }
    // 检查是否已经在登录页面，避免重定向循环
    if (pathname === '/login') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// 配置匹配器
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了那些以特定前缀开头的路径:
     * - api (API路由)
     * - _next/static (静态文件)
     * - _next/image (图像优化文件)
     * - favicon.ico (favicon文件)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
