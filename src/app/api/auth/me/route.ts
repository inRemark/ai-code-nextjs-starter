import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/prisma';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { MeResponse, UpdateMeRequest } from '@features/auth/types/auth.types';

// 获取当前用户信息
export const GET = requireAuth(async (user) => {

  try {
    // 查询用户信息
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // 设置响应
    const response: MeResponse = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    logger.error('Get user info error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// 更新当前用户信息
export const PATCH = requireAuth(async (user, request: NextRequest) => {

  try {
    // 获取请求体
    const body: UpdateMeRequest = await request.json();

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 设置响应
    const response: MeResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    logger.error('Update user info error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});