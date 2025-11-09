/**
 * Articles API Route - List & Create
 * GET /api/articles - 获取文章列表
 * POST /api/articles - 创建文章
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@features/auth/services';
import { getArticles, createArticle } from '@/features/articles/services/article.service';
import { createArticleSchema } from '@/features/articles/validators/article.schema';

// GET /api/articles - 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      sortBy: (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'title',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      authorId: searchParams.get('authorId') || undefined,
      published: searchParams.get('published') ? searchParams.get('published') === 'true' : undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      search: searchParams.get('search') || undefined,
    };

    const result = await getArticles(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '获取文章列表失败',
      },
      { status: 500 }
    );
  }
}

// POST /api/articles - 创建文章
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: '未授权',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 验证数据
    const validationResult = createArticleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: '数据验证失败',
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const article = await createArticle(validationResult.data, session.user.id);

    return NextResponse.json(
      {
        success: true,
        data: article,
        message: '文章创建成功',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create article:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '创建文章失败',
      },
      { status: 500 }
    );
  }
}
