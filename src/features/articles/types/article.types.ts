/**
 * Article Feature - Type Definitions
 * 文章模块类型定义
 */

// ============================================
// 基础类型
// ============================================

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  authorId: string;
  published: boolean;
  publishedAt?: Date | null;
  viewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

// ============================================
// API 请求类型
// ============================================

export interface CreateArticleRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
  publishedAt?: Date;
}

export interface UpdateArticleRequest {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
  publishedAt?: Date;
}

export interface ArticleFilters {
  authorId?: string;
  published?: boolean;
  tags?: string[];
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ArticleListParams extends ArticleFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// API 响应类型
// ============================================

export interface ArticleResponse {
  success: boolean;
  data?: Article;
  message?: string;
  error?: string;
}

export interface ArticleListResponse {
  success: boolean;
  data?: {
    articles: Article[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  message?: string;
  error?: string;
}

export interface DeleteArticleResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// ============================================
// 统计类型
// ============================================

export interface ArticleStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  averageViews: number;
  topTags: Array<{
    tag: string;
    count: number;
  }>;
  recentArticles: Article[];
}

export interface ArticleStatsResponse {
  success: boolean;
  data?: ArticleStats;
  message?: string;
  error?: string;
}

// ============================================
// 组件 Props 类型
// ============================================

export interface ArticleCardProps {
  article: Article;
  showAuthor?: boolean;
  showExcerpt?: boolean;
  className?: string;
  onClick?: (article: Article) => void;
}

export interface ArticleListProps {
  articles: Article[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onArticleClick?: (article: Article) => void;
}

export interface ArticleFormProps {
  article?: Article;
  onSubmit: (data: CreateArticleRequest | UpdateArticleRequest) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export interface ArticleFilterProps {
  filters: ArticleFilters;
  onFiltersChange: (filters: ArticleFilters) => void;
  availableTags?: string[];
  className?: string;
}

// ============================================
// Hook 返回类型
// ============================================

export interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } | null;
  refetch: () => Promise<void>;
}

export interface UseArticleReturn {
  article: Article | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  incrementView: () => Promise<void>;
}

export interface UseArticleStatsReturn {
  stats: ArticleStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================
// 工具函数类型
// ============================================

export type GenerateSlug = (title: string) => string;
export type ValidateSlug = (slug: string) => boolean;
export type FormatViewCount = (count: number) => string;
export type ExtractExcerpt = (content: string, length?: number) => string;
export type FormatPublishDate = (date: Date | string) => string;
