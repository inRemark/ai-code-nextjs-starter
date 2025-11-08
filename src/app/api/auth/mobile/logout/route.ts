import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { deleteSession } from '@features/auth/services/session-token';

/**
 * 移动端登出API
 * 
 * **用途：** 销毁移动端的Session Token，登出用户
 * 
 * **认证要求：** 需要有效的Bearer Token
 * 
 * **行为：**
 * - 从数据库中删除对应的UserSession记录
 * - Token立即失效，无法再用于API调用
 * - 不影响Web端的NextAuth session（独立系统）
 * 
 * **与Web端区别：**
 * - Web端使用 `signOut()` from 'next-auth/react'
 * - Web端登出会清除HTTP-only cookies
 * 
 * **使用方式：**
 * ```typescript
 * await fetch('/api/auth/mobile/logout', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': `Bearer ${sessionToken}`
 *   }
 * });
 * ```
 * 
 * @route POST /api/auth/mobile/logout
 * @access Protected - 需要Bearer Token
 */
export const POST = requireAuth(async (user, request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.substring(7);
    
    if (sessionToken) {
      await deleteSession(sessionToken);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Mobile logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});
