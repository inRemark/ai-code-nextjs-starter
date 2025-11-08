import { NextRequest, NextResponse } from 'next/server';
import { validateSessionToken } from '@features/auth/services/session-token';
import { hasPermission, type Permission } from '@features/auth/services/rbac.service';
import { Session } from 'next-auth';
import { UserRole } from '@shared/types/user';
import { logger } from '@logger';
async function getServerSession() {
  try {
    const { authConfig } = await import('../services/next-auth.config');
    const { getServerSession } = await import('next-auth/next');
    return await getServerSession(authConfig);
  } catch (error) {
    logger.error('Failed to get server session:', error);
    return null;
  }
}

/**
 * 安全地从session中提取用户角色
 */
function extractUserRole(session: Session | null): UserRole {
  if (session?.user?.role && typeof session.user.role === 'string') {
    const role = session.user.role.toUpperCase();
    if (role === 'ADMIN' || role === 'EDITOR' || role === 'USER') {
      return role as UserRole;
    }
  }
  return 'USER';
}

/**
 * 从请求中提取已验证用户，优先NextAuth Session，其次移动端Session Token
 * 返回AuthUser和可选的原始session对象
 */
async function getUserFromRequest(request: NextRequest): Promise<{ user: AuthenticatedUser | null; session?: Session | null }> {
  // 1. NextAuth Session (Web)
  const session = await getServerSession();
  if (session?.user?.id) {
    const userRole = extractUserRole(session);
    return {
      user: { id: session.user.id, email: session.user.email || '', name: session.user.name || undefined, role: userRole },
      session,
    };
  }

  // 2. Session Token (Mobile)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const sessionToken = authHeader.substring(7);
    const dbUser = await validateSessionToken(sessionToken);
    if (dbUser) {
      return {
        user: { id: dbUser.id, email: dbUser.email, name: dbUser.name || undefined, role: dbUser.role as UserRole },
      };
    }
  }

  return { user: null };
}

/**
 * NextAuth认证中间件
 * 统一的认证验证逻辑，避免代码重复
 */
export async function withNextAuth(
  handler: (request: NextRequest, session: { user: { id: string; email: string; name: string; role: string } }) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      // 获取NextAuth session
      const session = await getServerSession();
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { message: 'Unauthorized', error: 'NO_SESSION' },
          { status: 401 }
        );
      }

      // 调用原始处理器，传入session
      return await handler(request, session);
    } catch (error) {
      logger.error('NextAuth middleware error:', error);
      return NextResponse.json(
        { message: 'Authentication failed', error: 'MIDDLEWARE_ERROR' },
        { status: 500 }
      );
    }
  };
}

/**
 * 获取当前用户的session
 * 用于在API路由中快速获取认证信息
 */
export async function getCurrentSession() {
  try {
    return await getServerSession();
  } catch (error) {
    logger.error('Get session error:', error);
    return null;
  }
}

/**
 * 验证用户是否有指定权限
 * 结合NextAuth session和RBAC系统
 */
export async function requirePermission(permission: Permission) {
  return async (
    handler: (request: NextRequest, session: { user: { id: string; email: string; name: string; role: string } }) => Promise<NextResponse>
  ) => {
    return async (request: NextRequest) => {
      try {
        // 优先使用NextAuth Session（Web端）
        const session = await getServerSession();

        if (session?.user?.id) {
          const userId = session.user.id;
          const ok = await hasPermission(userId, permission);
          if (!ok) {
            return NextResponse.json(
              { message: 'Insufficient permissions', error: 'INSUFFICIENT_PERMISSIONS' },
              { status: 403 }
            );
          }

          return await handler(request, session);
        }

        // 回退到Mobile端的Session Token验证
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          const sessionToken = authHeader.substring(7);
          const dbUser = await validateSessionToken(sessionToken);

          if (!dbUser) {
            return NextResponse.json(
              { message: 'Unauthorized', error: 'NO_SESSION' },
              { status: 401 }
            );
          }

          const ok = await hasPermission(dbUser.id, permission);
          if (!ok) {
            return NextResponse.json(
              { message: 'Insufficient permissions', error: 'INSUFFICIENT_PERMISSIONS' },
              { status: 403 }
            );
          }

          // 构造与NextAuth session兼容的简易对象传递给handler
          const pseudoSession = { user: { id: dbUser.id, email: dbUser.email, name: dbUser.name || '', role: dbUser.role } } as unknown as Session;
          return await handler(request, pseudoSession);
        }

        // 都没有认证信息
        return NextResponse.json(
          { message: 'Unauthorized', error: 'NO_SESSION' },
          { status: 401 }
        );
      } catch (error) {
        logger.error('Permission middleware error:', error);
        return NextResponse.json(
          { message: 'Permission check failed', error: 'PERMISSION_ERROR' },
          { status: 500 }
        );
      }
    };
  };
}

/**
 * 验证用户角色
 * 支持双模式验证：NextAuth Session (Web端) + Session Token (Mobile端)
 */
export async function requireRole(roles: string[]) {
  return async (
    handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
  ) => {
    return async (request: NextRequest) => {
      try {
        const { user } = await getUserFromRequest(request);

        if (!user || !roles.includes(user.role)) {
          return NextResponse.json(
            { message: 'Insufficient role', error: 'INSUFFICIENT_ROLE' },
            { status: 403 }
          );
        }

        return await handler(request, user);
      } catch (error) {
        logger.error('Role middleware error:', error);
        return NextResponse.json(
          { message: 'Role check failed', error: 'ROLE_ERROR' },
          { status: 500 }
        );
      }
    };
  };
}

/**
 * 管理员权限验证 - 专用中间件
 * 支持双模式验证：NextAuth Session (Web端) + Session Token (Mobile端)
 */
export function requireAdmin<T extends unknown[]>(
  handler: (request: NextRequest, user: AuthenticatedUser, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const { user } = await getUserFromRequest(request);

      if (user?.role !== 'ADMIN') {
        return NextResponse.json(
          { message: 'Admin privileges required', error: 'INSUFFICIENT_PERMISSIONS' },
          { status: 403 }
        );
      }

      return await handler(request, user, ...args);
    } catch (error) {
      logger.error('Admin middleware error:', error);
      return NextResponse.json(
        { message: 'Admin check failed', error: 'ADMIN_ERROR' },
        { status: 500 }
      );
    }
  };
}

/**
 * 基础认证验证 - 兼容现有API签名
 * 支持双模式验证：NextAuth Session (Web端) + Session Token (Mobile端)
 */
export function requireAuth<T extends unknown[]>(
  handler: (user: AuthenticatedUser, request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const { user } = await getUserFromRequest(request);

      if (!user) {
        return NextResponse.json(
          { message: 'Unauthorized', error: 'NO_SESSION' },
          { status: 401 }
        );
      }

      return await handler(user, request, ...args);
    } catch (error) {
      logger.error('Auth middleware error:', error);
      return NextResponse.json(
        { message: 'Authentication failed', error: 'AUTH_ERROR' },
        { status: 500 }
      );
    }
  };
}

/**
 * 获取用户信息 - 兼容现有API
 * 支持双模式验证：NextAuth Session (Web端) + Session Token (Mobile端)
 */
export async function getAuthUserFromRequest(request: NextRequest): Promise<AuthenticatedUser> {
  // 方式1: NextAuth Session (Web端)
  const session = await getServerSession();
  if (session?.user?.id) {
    const userRole = extractUserRole(session);
    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name || undefined,
      role: userRole,
    };
  }
  
  // 方式2: Session Token (Mobile端)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const sessionToken = authHeader.substring(7);
    const dbUser = await validateSessionToken(sessionToken);
    
    if (dbUser) {
      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name || undefined,
        role: dbUser.role as UserRole,
      };
    }
  }
  
  throw new Error('No authentication session found');
}

/**
 * 统一的用户信息类型 - 兼容现有API
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

/**
 * 扩展的认证请求类型
 */
export interface AuthenticatedRequest extends NextRequest {
  session: {
    user: AuthenticatedUser;
  };
}

/**
 * 统一的认证中间件集合 - 完全兼容auth-request.ts的API
 */
export const auth = {
  /**
   * 基础认证 - 需要登录
   */
  require: requireAuth,
  
  /**
   * 管理员认证 - 需要 ADMIN 角色
   */
  requireAdmin: requireAdmin,
  
  /**
   * 角色认证 - 需要指定角色
   */
  requireRole: requireRole,
  
  /**
   * 获取用户信息
   */
  getUser: getAuthUserFromRequest,
  
};