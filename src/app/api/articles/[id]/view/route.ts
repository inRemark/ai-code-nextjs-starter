/**
 * Articles API Route - Increment View Count
 * POST /api/articles/[id]/view - 增加浏览次数
 */

import { NextRequest, NextResponse } from 'next/server';
import { incrementArticleView } from '@/features/articles/services/article.service';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await incrementArticleView(id);

    return NextResponse.json({
      success: true,
      message: '浏览次数已更新',
    });
  } catch (error) {
    console.error('Failed to increment view:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '更新浏览次数失败',
      },
      { status: 500 }
    );
  }
}
