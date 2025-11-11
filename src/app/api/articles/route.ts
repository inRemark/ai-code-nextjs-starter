/**
 * Articles API Route - List & Create
 * GET /api/articles - get articles list
 * POST /api/articles - create article
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { getArticles, createArticle } from '@/features/articles/services/article.service';
import { createArticleSchema } from '@/features/articles/validators/article.schema';
import { auth } from '@features/auth/services';

// GET /api/articles - get articles list (public or user-specific)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Handle authorId=me for current user's articles
    let authorId = searchParams.get('authorId') || undefined;
    if (authorId === 'me') {
      const session = await auth();
      // For 'me' parameter, authentication is required
      if (!session?.user?.id) {
        return NextResponse.json(
          {
            success: false,
            message: '未授权',
          },
          { status: 401 }
        );
      }
      authorId = session.user.id;
    }

    const params = {
      page: searchParams.get('page') ? Number.parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? Number.parseInt(searchParams.get('limit')!) : 10,
      sortBy: (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'title',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      authorId,
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
        message: error instanceof Error ? error.message : 'Failed to fetch articles',
      },
      { status: 500 }
    );
  }
}

// POST /api/articles - create article (requires authentication)
export const POST = requireAuth(async (user, request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate data
    const validationResult = createArticleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data validation failed',
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const article = await createArticle(validationResult.data, user.id);

    return NextResponse.json(
      {
        success: true,
        data: article,
        message: 'Article created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create article:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create article',
      },
      { status: 500 }
    );
  }
});
