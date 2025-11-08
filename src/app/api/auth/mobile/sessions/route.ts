import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { getUserSessions, deleteSession } from '@features/auth/services/session-token';

/**
 * 获取用户所有活跃Session
 * 
 * **用途：** 查看用户在哪些设备上登录，管理活跃会话
 * 
 * **返回信息：**
 * - 设备类型（iOS/Android/Web）
 * - 设备名称
 * - 登录IP地址
 * - User Agent
 * - 创建时间和过期时间
 * - 是否为当前设备
 * 
 * **使用场景：**
 * - 设备管理页面
 * - 安全审计
 * - 远程登出其他设备
 * 
 * **与Web端区别：**
 * - 仅显示移动端sessions（UserSession表）
 * - 不包含Web端的NextAuth sessions
 * 
 * @route GET /api/auth/mobile/sessions
 * @access Protected - 需要Bearer Token
 */
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

/**
 * 删除指定的Session（远程登出）
 * 
 * **用途：** 从其他设备登出，或移除可疑登录
 * 
 * **请求体：**
 * ```json
 * { "sessionToken": "sess_xxxxx" }
 * ```
 * 
 * **安全检查：**
 * - 验证session属于当前用户
 * - 防止删除其他用户的session
 * 
 * **使用场景：**
 * - 发现陌生设备登录，远程登出
 * - 更换设备后清理旧session
 * - 批量登出所有设备（循环调用）
 * 
 * **注意：** 可以删除当前设备的session（自己登出自己）
 * 
 * @route DELETE /api/auth/mobile/sessions
 * @access Protected - 需要Bearer Token
 */
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
