/**
 * Article Feature - React Hooks
 * 文章模块 React Hooks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  Article,
  ArticleListParams,
  UseArticlesReturn,
  UseArticleReturn,
  UseArticleStatsReturn,
  ArticleStats,
} from '../types/article.types';

// ============================================
// useArticles - 获取文章列表
// ============================================

export function useArticles(params: ArticleListParams = {}): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseArticlesReturn['pagination']>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await fetch(`/api/articles?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '获取文章列表失败');
      }

      setArticles(data.data.articles);
      setPagination({
        page: data.data.page,
        limit: data.data.limit,
        total: data.data.total,
        totalPages: data.data.totalPages,
        hasNext: data.data.hasNext,
        hasPrevious: data.data.hasPrevious,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    pagination,
    refetch: fetchArticles,
  };
}

// ============================================
// useArticle - 获取单篇文章
// ============================================

export function useArticle(id: string): UseArticleReturn {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/articles/${id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '获取文章失败');
      }

      setArticle(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const incrementView = useCallback(async () => {
    if (!id) return;

    try {
      await fetch(`/api/articles/${id}/view`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to increment view:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    article,
    loading,
    error,
    refetch: fetchArticle,
    incrementView,
  };
}

// ============================================
// useArticleStats - 获取文章统计
// ============================================

export function useArticleStats(authorId?: string): UseArticleStatsReturn {
  const [stats, setStats] = useState<ArticleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = authorId
        ? `/api/articles/stats?authorId=${authorId}`
        : '/api/articles/stats';

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '获取统计数据失败');
      }

      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, [authorId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
