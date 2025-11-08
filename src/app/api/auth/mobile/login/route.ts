import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/prisma';
import { verifyPassword } from '@features/auth/services/auth.service';
import { createSession, extractDeviceInfo } from '@features/auth/services/session-token';

/**
 * 移动端登录API
 * 
 * **用途：** 专为移动应用（iOS/Android）设计的认证端点
 * 
 * **认证方式：** 返回Session Token（存储在UserSession表中）
 * 
 * **与Web端区别：**
 * - Web端使用 `/api/auth/[...nextauth]` (NextAuth标准端点)
 * - Web端使用HTTP-only cookies进行session管理
 * - 移动端使用Bearer Token在Authorization header中传递
 * 
 * **返回数据：**
 * - `sessionToken`: 用于后续API调用的认证token
 * - `expiresAt`: Token过期时间（默认30天）
 * - `user`: 用户基本信息
 * 
 * **使用方式：**
 * ```typescript
 * // 移动端登录
 * const response = await fetch('/api/auth/mobile/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, password })
 * });
 * 
 * // 保存token并用于后续请求
 * const { sessionToken } = response.data;
 * fetch('/api/protected', {
 *   headers: { 'Authorization': `Bearer ${sessionToken}` }
 * });
 * ```
 * 
 * @route POST /api/auth/mobile/login
 * @access Public
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 验证密码
    if (!user.password) {
      return NextResponse.json(
        { success: false, error: 'Password not set. Please use OAuth login.' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 提取设备信息
    const deviceInfo = extractDeviceInfo(request);
    
    // 创建Session
    const session = await createSession(user.id, {
      ...deviceInfo,
      deviceType: deviceInfo.deviceType || 'android', // 默认移动端
    });

    // 返回响应
    return NextResponse.json({
      success: true,
      data: {
        sessionToken: session.sessionToken,
        expiresAt: session.expires,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error('Mobile login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
