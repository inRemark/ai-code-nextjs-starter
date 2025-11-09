/**
 * Articles API Route - Single Article Operations
 * GET /api/articles/[id] - 获取单篇文章
 * PATCH /api/articles/[id] - 更新文章
 * DELETE /api/articles/[id] - 删除文章
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@features/auth/services';
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from '@/features/articles/services/article.service';
import { updateArticleSchema } from '@/features/articles/validators/article.schema';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/articles/[id] - 获取单篇文章
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: '文章不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '获取文章失败',
      },
      { status: 500 }
    );
  }
}

// PATCH /api/articles/[id] - 更新文章
export async function PATCH(request: NextRequest, { params }: Params) {
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

    const { id } = await params;
    const body = await request.json();

    // 验证数据
    const validationResult = updateArticleSchema.safeParse(body);
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

    // 检查文章是否存在
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return NextResponse.json(
        {
          success: false,
          message: '文章不存在',
        },
        { status: 404 }
      );
    }

    // 检查权限
    if (existingArticle.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          message: '无权限修改此文章',
        },
        { status: 403 }
      );
    }

    const article = await updateArticle(id, validationResult.data);

    return NextResponse.json({
      success: true,
      data: article,
      message: '文章更新成功',
    });
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '更新文章失败',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] - 删除文章
export async function DELETE(request: NextRequest, { params }: Params) {
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

    const { id } = await params;

    // 检查文章是否存在
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return NextResponse.json(
        {
          success: false,
          message: '文章不存在',
        },
        { status: 404 }
      );
    }

    // 检查权限
    if (existingArticle.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          message: '无权限删除此文章',
        },
        { status: 403 }
      );
    }

    await deleteArticle(id);

    return NextResponse.json({
      success: true,
      message: '文章删除成功',
    });
  } catch (error) {
    console.error('Failed to delete article:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '删除文章失败',
      },
      { status: 500 }
    );
  }
}
