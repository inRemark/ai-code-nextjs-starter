import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { deleteUserSessions } from '@features/auth/services/session-token';

// 登出所有设备接口
export const POST = requireAuth(async (user) => {
  try {
    // 删除用户所有Session
    await deleteUserSessions(user.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Logged out from all devices successfully' 
    });
  } catch (error) {
    logger.error('Logout all devices error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});