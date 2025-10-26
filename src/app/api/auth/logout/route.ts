import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { deleteSession } from '@features/auth/services/session-token';

// 登出接口 - 支持双模式认证
export const POST = requireAuth(async (user, request: NextRequest) => {
  try {
    // 获取 token 用于删除会话
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (sessionToken) {
      // 删除Session Token
      await deleteSession(sessionToken);
    }
    
    // 对于NextAuth session，NextAuth会自动处理cookie清理

    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    logger.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});