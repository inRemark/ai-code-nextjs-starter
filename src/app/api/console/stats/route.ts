import { logger } from '@logger';
import { NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { ConsoleService } from '@features/console/services/console.service';

export const GET = requireAuth(async (user) => {
  try {
    const stats = await ConsoleService.getDashboardStats(user.id);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch dashboard statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
});
