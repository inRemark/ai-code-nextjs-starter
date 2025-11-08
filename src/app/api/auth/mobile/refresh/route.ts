import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { refreshSessionToken, extractDeviceInfo } from '@features/auth/services/session-token';

/**
 * 移动端刷新Token API
 * 
 * **用途：** 在Session Token即将过期前刷新，获取新的token
 * 
 * **认证要求：** 需要有效的Bearer Token（即使快过期也可以）
 * 
 * **行为：**
 * - 验证旧token的有效性
 * - 生成新的sessionToken
 * - 更新UserSession记录（保留设备信息）
 * - 删除旧token（可选，取决于实现）
 * 
 * **建议刷新时机：**
 * - Token过期前1-3天
 * - 或在API调用返回401时尝试刷新
 * 
 * **与Web端区别：**
 * - Web端的session由NextAuth自动管理
 * - Web端不需要手动刷新token
 * 
 * **使用方式：**
 * ```typescript
 * const response = await fetch('/api/auth/mobile/refresh', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': `Bearer ${oldToken}`
 *   }
 * });
 * 
 * const { sessionToken, expiresAt } = response.data;
 * // 保存新token替换旧token
 * ```
 * 
 * @route POST /api/auth/mobile/refresh
 * @access Protected - 需要Bearer Token
 */
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
