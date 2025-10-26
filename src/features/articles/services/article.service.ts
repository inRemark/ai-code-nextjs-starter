/**
 * Article Feature - Service Layer
 * 文章模块业务逻辑服务
 */

import prisma from '@/lib/database/prisma';
import type {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleListParams,
  ArticleStats,
} from '../types/article.types';

// ============================================
// 查询服务
// ============================================

/**
 * 获取文章列表
 */
export async function getArticles(params: ArticleListParams = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    authorId,
    published,
    tags,
    search,
    startDate,
    endDate,
  } = params;

  const skip = (page - 1) * limit;

  // 构建查询条件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};

  if (authorId) {
    where.authorId = authorId;
  }

  if (typeof published === 'boolean') {
    where.published = published;
  }

  if (tags && tags.length > 0) {
    where.tags = {
      hasSome: tags,
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (startDate || endDate) {
    where.publishedAt = {};
    if (startDate) {
      where.publishedAt.gte = startDate;
    }
    if (endDate) {
      where.publishedAt.lte = endDate;
    }
  }

  // 执行查询
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    articles,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}

/**
 * 根据 ID 获取文章
 */
export async function getArticleById(id: string): Promise<Article | null> {
  return prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

/**
 * 根据 Slug 获取文章
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

/**
 * 获取文章统计信息
 */
export async function getArticleStats(authorId?: string): Promise<ArticleStats> {
  const where = authorId ? { authorId } : {};

  const [totalArticles, publishedArticles, draftArticles, totalViewsData, recentArticles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.count({ where: { ...where, published: true } }),
    prisma.article.count({ where: { ...where, published: false } }),
    prisma.article.aggregate({
      where,
      _sum: { viewCount: true },
    }),
    prisma.article.findMany({
      where: { ...where, published: true },
      take: 5,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
  ]);

  const totalViews = totalViewsData._sum.viewCount || 0;
  const averageViews = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

  // 获取热门标签
  const articles = await prisma.article.findMany({
    where,
    select: { tags: true },
  });

  const tagCounts = new Map<string, number>();
  articles.forEach((article: { tags: string[] }) => {
    article.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const topTags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalArticles,
    publishedArticles,
    draftArticles,
    totalViews,
    averageViews,
    topTags,
    recentArticles,
  };
}

// ============================================
// 修改服务
// ============================================

/**
 * 创建文章
 */
export async function createArticle(data: CreateArticleRequest, authorId: string): Promise<Article> {
  return prisma.article.create({
    data: {
      ...data,
      authorId,
      tags: data.tags || [],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

/**
 * 更新文章
 */
export async function updateArticle(id: string, data: UpdateArticleRequest): Promise<Article | null> {
  return prisma.article.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

/**
 * 删除文章
 */
export async function deleteArticle(id: string): Promise<void> {
  await prisma.article.delete({
    where: { id },
  });
}

/**
 * 增加文章浏览次数
 */
export async function incrementArticleView(id: string): Promise<void> {
  await prisma.article.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
}

// ============================================
// 工具函数
// ============================================

/**
 * 生成 Slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 验证 Slug 唯一性
 */
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!article) return true;
  if (excludeId && article.id === excludeId) return true;
  return false;
}

/**
 * 提取摘要
 */
export function extractExcerpt(content: string, length: number = 200): string {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (plainText.length <= length) return plainText;
  return plainText.substring(0, length) + '...';
}

/**
 * 获取所有标签
 */
export async function getAllTags(): Promise<string[]> {
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { tags: true },
  });

  const tagsSet = new Set<string>();
  articles.forEach((article: { tags: string[] }) => {
    article.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}
