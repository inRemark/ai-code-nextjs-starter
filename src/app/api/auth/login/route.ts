import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/prisma';
import { verifyPassword } from '@features/auth/services/auth.service';
import { LoginRequest, AuthResponse } from '@features/auth/services/auth.types';
import { validateLoginRequest } from '@/features/auth/validators';

// 用户登录接口 - POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    
    // 验证输入
    const validation = validateLoginRequest(body.email, body.password);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 验证密码
    const isValidPassword = await verifyPassword(body.password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 设置响应（NextAuth会处理session）
    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    logger.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
