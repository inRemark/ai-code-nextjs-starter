import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/prisma';
import { hashPassword } from '@features/auth/services/auth.service';
import { RegisterRequest, AuthResponse } from '@features/auth/types/auth.types';
import { validateRegisterRequest } from '@/features/auth/validators';

// 用户注册接口 - POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    
    // 验证输入
    const validation = validateRegisterRequest(body.email, body.password, body.name);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] },
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }

    // 加密密码
    const hashedPassword = await hashPassword(body.password);

    // 从邮箱自动生成姓名（取@前的部分）
    const emailName = body.email.split('@')[0];
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name || emailName,
        password: hashedPassword,
        role: 'USER', // 默认角色为普通用户
      },
    });

    // 设置响应（不再生成JWT token）
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
    logger.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
