import { logger } from '@logger';
import { NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/user - Get current user full info (with stats)
 */
export const GET = requireAuth(async (user) => {
  try {
    // 获取用户基本信息
    const userInfo = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
      },
    });

    if (!userInfo) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // TODO: Get user stats from other tables
    // const [reviewCount, comparisonCount, favoriteCount] = await Promise.all([
    //   prisma.review.count({ where: { userId: user.id } }),
    //   prisma.comparison.count({ where: { userId: user.id } }),
    //   prisma.favorite.count({ where: { userId: user.id } }),
    // ]);

    return NextResponse.json({
      success: true,
      data: {
        ...userInfo,
        // stats: {
        //   reviews: reviewCount,
        //   comparisons: comparisonCount,
        //   favorites: favoriteCount,
        // },
      },
    });
  } catch (error) {
    logger.error('Error fetching user info:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user info',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
});
