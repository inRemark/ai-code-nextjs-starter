import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { logger } from '@logger';
import { routing } from './i18n/routing';

// 创建 next-intl 中间件
const intlMiddleware = createIntlMiddleware(routing);

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
  // 跳过 API 路由
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

    // 应用国际化中间件
  const intlResponse = intlMiddleware(request);

  // 提取语言前缀后的路径
  const pathWithoutLocale = pathname.replace(/^\/(zh|en|ja)/, '') || '/';

  // 检查是否为公共路由
  const isPublicRoute = publicRoutes.some(route => 
    // pathname.startsWith(route)
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route)
  );

  // 如果是公共路由，直接通过, 返回国际化响应
  if (isPublicRoute) {
    return intlResponse;
  }

  // 检查是否为受保护路由
  const isUserProtectedRoute = userProtectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );
  const isAdminProtectedRoute = adminProtectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );
  const isOtherProtectedRoute = protectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );

  // 如果不是受保护的路由，直接通过，返回国际化响应
  if (!isUserProtectedRoute && !isAdminProtectedRoute && !isOtherProtectedRoute) {
    return intlResponse;
  }

  try {
    // 使用简化的认证检查避免Edge Runtime问题
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('Middleware token check:', {
        pathname,
        hasToken: !!token,
        userId: token?.sub,
        userRole: token?.role
      });
    }
    
    if (!token?.sub) {
      if (process.env.NODE_ENV === 'development') {
        logger.warn('No valid token found, redirecting to login');
      }
      // 获取当前语言
      const locale = pathname.split('/')[1] || 'zh';

      // 检查是否已经在登录页面，避免重定向循环
      if (pathWithoutLocale === '/login') {
        return intlResponse;
      }
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
    
    // 如果用户已认证但试图访问登录页面，则重定向到profile
    if (pathWithoutLocale === '/login') {
      const locale = pathname.split('/')[1] || 'zh';
      return NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
    }
    
    const userRole = token.role;
    if (isAdminProtectedRoute && userRole !== 'ADMIN') {
      const locale = pathname.split('/')[1] || 'zh';
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
    }
    if (pathWithoutLocale.startsWith('/console') && userRole !== 'ADMIN' && userRole !== 'EDITOR') {
      const locale = pathname.split('/')[1] || 'zh';
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
    }
    return intlResponse;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      logger.error('Middleware auth error:', err);
    }
    // 获取当前语言
    const locale = pathname.split('/')[1] || 'zh';
    // 检查是否已经在登录页面，避免重定向循环
    if (pathWithoutLocale === '/login') {
      return intlResponse;
    }
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
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
     * - sitemap.xml (站点地图)
     * - robots.txt (爬虫协议)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
