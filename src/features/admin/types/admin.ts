// 管理后台专用类型定义

export interface ProblemFormData {
  title: string;
  slug: string;
  description?: string;
  categoryId: string;
  tags: string[];
}

export interface SolutionFormData {
  name: string;
  slug: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  pricingInfo: string;
  features: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  solutions?: ProblemSolution[];
  reviews?: UserReview[];
}

export interface Solution {
  id: string;
  name: string;
  slug: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  pricingInfo: Record<string, unknown>;
  features: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  problems?: ProblemSolution[];
  reviews?: UserReview[];
}

export interface ProblemSolution {
  id: string;
  problemId: string;
  solutionId: string;
  relevanceScore: number;
  rankingPosition: number;
  problem?: Problem;
  solution?: Solution;
  createdAt: string;
}

export interface UserReview {
  id: string;
  userId: string;
  solutionId: string;
  problemId: string;
  overallRating: number;
  reviewContent?: string;
  prosText?: string;
  consText?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  moderatedBy?: string;
  moderatedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  solution?: Solution;
  problem?: Problem;
  moderator?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface ProblemCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 查询参数类型
export interface ProblemsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SolutionsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewsQueryParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 文件上传类型
export interface FileUploadResult {
  success: boolean;
  message: string;
  errors?: string[];
  imported?: number;
  skipped?: number;
}

// 导出类型
export interface ExportOptions {
  type: 'problems' | 'solutions';
  format: 'xlsx' | 'csv';
  includeMetadata?: boolean;
}
