/**
 * Articles API Route - Statistics
 * GET /api/articles/stats - 获取文章统计信息
 */

import { NextRequest, NextResponse } from 'next/server';
import { getArticleStats } from '@/features/articles/services/article.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId') || undefined;

    const stats = await getArticleStats(authorId);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Failed to fetch article stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '获取统计信息失败',
      },
      { status: 500 }
    );
  }
}
