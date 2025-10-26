/**
 * Article Feature - Validators
 * 文章模块数据验证
 */

import { z } from 'zod';

// ============================================
// 基础验证规则
// ============================================

export const articleSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(200, '标题不能超过200个字符'),
  
  slug: z.string()
    .min(1, 'Slug不能为空')
    .max(200, 'Slug不能超过200个字符')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug只能包含小写字母、数字和连字符'),
  
  content: z.string()
    .min(1, '内容不能为空'),
  
  excerpt: z.string()
    .max(500, '摘要不能超过500个字符')
    .optional(),
  
  coverImage: z.string()
    .url('封面图片必须是有效的URL')
    .optional(),
  
  tags: z.array(z.string())
    .max(10, '标签不能超过10个')
    .optional(),
  
  published: z.boolean()
    .optional(),
  
  publishedAt: z.date()
    .optional(),
});

export const createArticleSchema = articleSchema;

export const updateArticleSchema = articleSchema.partial();

// ============================================
// 查询参数验证
// ============================================

export const articleListParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'viewCount', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  authorId: z.string().optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// ============================================
// ID 验证
// ============================================

export const articleIdSchema = z.object({
  id: z.string().min(1, 'ID不能为空'),
});

export const articleSlugSchema = z.object({
  slug: z.string().min(1, 'Slug不能为空'),
});

// ============================================
// 导出类型
// ============================================

export type ArticleSchema = z.infer<typeof articleSchema>;
export type CreateArticleSchema = z.infer<typeof createArticleSchema>;
export type UpdateArticleSchema = z.infer<typeof updateArticleSchema>;
export type ArticleListParamsSchema = z.infer<typeof articleListParamsSchema>;
export type ArticleIdSchema = z.infer<typeof articleIdSchema>;
export type ArticleSlugSchema = z.infer<typeof articleSlugSchema>;
