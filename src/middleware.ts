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

// 提取辅助函数以降低认知复杂度

function extractLocale(pathname: string): string {
  return pathname.split('/')[1] || 'zh';
}

function getPathWithoutLocale(pathname: string): string {
  return pathname.replace(/^\/(zh|en|ja)/, '') || '/';
}

function isPublicPath(pathWithoutLocale: string): boolean {
  return publicRoutes.some(route => 
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route)
  );
}

function isProtectedPath(pathWithoutLocale: string): boolean {
  const isUserProtected = userProtectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );
  const isAdminProtected = adminProtectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );
  const isOtherProtected = protectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );
  
  return isUserProtected || isAdminProtected || isOtherProtected;
}

function createRedirect(locale: string, path: string, requestUrl: string): NextResponse {
  return NextResponse.redirect(new URL(`/${locale}${path}`, requestUrl));
}

function handleUnauthenticated(
  pathWithoutLocale: string,
  locale: string,
  requestUrl: string,
  intlResponse: NextResponse
): NextResponse {
  if (pathWithoutLocale === '/login') {
    return intlResponse;
  }
  return createRedirect(locale, '/login', requestUrl);
}

function checkAuthorization(
  pathWithoutLocale: string,
  userRole: string,
  locale: string,
  requestUrl: string
): NextResponse | null {
  const isAdminRoute = adminProtectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );
  
  if (isAdminRoute && userRole !== 'ADMIN') {
    return createRedirect(locale, '/unauthorized', requestUrl);
  }
  
  const isConsoleRoute = pathWithoutLocale.startsWith('/console');
  const hasConsoleAccess = userRole === 'ADMIN' || userRole === 'EDITOR';
  
  if (isConsoleRoute && !hasConsoleAccess) {
    return createRedirect(locale, '/unauthorized', requestUrl);
  }
  
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(request);
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  if (isPublicPath(pathWithoutLocale)) {
    return intlResponse;
  }

  if (!isProtectedPath(pathWithoutLocale)) {
    return intlResponse;
  }

  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    logger.warn('Middleware token check:', {
      pathname,
      hasToken: !!token,
      userId: token?.sub,
      userRole: token?.role
    });
    
    const locale = extractLocale(pathname);
    
    if (!token?.sub) {
      logger.warn('No valid token found, redirecting to login');
      return handleUnauthenticated(pathWithoutLocale, locale, request.url, intlResponse);
    }
    
    if (pathWithoutLocale === '/login') {
      return createRedirect(locale, '/profile', request.url);
    }
    
    const userRole = (token.role as string) || '';
    const authResponse = checkAuthorization(pathWithoutLocale, userRole, locale, request.url);
    if (authResponse) {
      return authResponse;
    }
    
    return intlResponse;
  } catch (err) {
    logger.warn('Middleware auth error:', err);
    const locale = extractLocale(pathname);
    return handleUnauthenticated(pathWithoutLocale, locale, request.url, intlResponse);
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
