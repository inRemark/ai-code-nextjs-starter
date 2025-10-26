import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { deleteSession } from '@features/auth/services/session-token';

// 移动端登出API - POST /api/auth/mobile/logout
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
