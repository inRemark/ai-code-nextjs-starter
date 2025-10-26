import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { getUserSessions, deleteSession } from '@features/auth/services/session-token';

// 获取用户所有Session - GET /api/auth/mobile/sessions
export const GET = requireAuth(async (user, request: NextRequest) => {
  try {
    const sessions = await getUserSessions(user.id);
    
    // 过滤敏感信息，只返回必要字段
    const sessionList = sessions.map(session => ({
      id: session.id,
      deviceType: session.deviceType,
      deviceName: session.deviceName,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      expires: session.expires,
      isCurrent: request.headers.get('authorization')?.includes(session.sessionToken) || false,
    }));
    
    return NextResponse.json({
      success: true,
      data: sessionList,
    });
  } catch (error) {
    logger.error('Get user sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// 删除指定Session - DELETE /api/auth/mobile/sessions
export const DELETE = requireAuth(async (user, request: NextRequest) => {
  try {
    const { sessionToken } = await request.json();
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Session token is required' },
        { status: 400 }
      );
    }

    // 验证session是否属于当前用户
    const sessions = await getUserSessions(user.id);
    const targetSession = sessions.find(s => s.sessionToken === sessionToken);
    
    if (!targetSession) {
      return NextResponse.json(
        { success: false, error: 'Session not found or not owned by user' },
        { status: 404 }
      );
    }

    // 删除session
    await deleteSession(sessionToken);
    
    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    logger.error('Delete session error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});
