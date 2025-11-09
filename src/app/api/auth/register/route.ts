import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/prisma';
import { hashPassword } from '@features/auth/services/auth.service';
import { AuthResponse } from '@features/auth/types/auth.types';
import { registerApiSchema } from '@/features/auth/validators/auth';
import { ZodError } from 'zod';

// 用户注册接口 - POST /api/auth/register
export async function POST(request: NextRequest) {
  let body: unknown;
  
  try {
    body = await request.json();
    
    // 使用 Zod Schema 验证输入（不需要 confirmPassword）
    const { email, password, name } = registerApiSchema.parse(body);

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 从邮箱自动生成姓名（取@前的部分）
    const emailName = email.split('@')[0];
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        name: name || emailName,
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
    // Zod 验证错误
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      logger.error('Zod validation error:', {
        path: firstError.path,
        message: firstError.message,
        code: firstError.code,
        received: body,
      });
      return NextResponse.json(
        { success: false, error: firstError.message },
        { status: 400 }
      );
    }
    
    // 其他错误
    logger.error('Registration error:', error);
    console.error('Full error details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
