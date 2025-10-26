import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { refreshSessionToken, extractDeviceInfo } from '@features/auth/services/session-token';

// 移动端刷新Token API - POST /api/auth/mobile/refresh
export const POST = requireAuth(async (user, request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization');
    const oldSessionToken = authHeader?.substring(7);
    
    if (!oldSessionToken) {
      return NextResponse.json(
        { success: false, error: 'No session token provided' },
        { status: 400 }
      );
    }

    // 提取设备信息
    const deviceInfo = extractDeviceInfo(request);
    
    // 刷新Session Token
    const newSession = await refreshSessionToken(oldSessionToken, {
      ...deviceInfo,
      deviceType: deviceInfo.deviceType || 'android', // 默认移动端
    });
    
    if (!newSession) {
      return NextResponse.json(
        { success: false, error: 'Invalid session token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionToken: newSession.sessionToken,
        expiresAt: newSession.expires,
      },
    });
  } catch (error) {
    logger.error('Mobile refresh token error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});
