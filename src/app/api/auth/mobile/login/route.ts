import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/prisma';
import { verifyPassword } from '@features/auth/services/auth.service';
import { createSession, extractDeviceInfo } from '@features/auth/services/session-token';

// 移动端登录API - POST /api/auth/mobile/login
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
