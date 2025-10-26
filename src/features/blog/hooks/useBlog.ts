"use client";

import { useState, useEffect } from 'react';
import { StaticBlogPost, BlogCategory, BlogTag, BlogFilters, PaginationData } from '@features/blog/types/blog';

export function useBlog(filters: BlogFilters = {}, page: number = 1, limit: number = 10) {
  const [posts, setPosts] = useState<StaticBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [filters, page, limit]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters.category) params.append('category', filters.category);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.author) params.append('author', filters.author);
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      const response = await fetch(`/api/blog?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    pagination,
    refetch: fetchPosts,
  };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<StaticBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<StaticBlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }

      const data = await response.json();
      setPost(data.post);
      setRelatedPosts(data.relatedPosts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    post,
    relatedPosts,
    loading,
    error,
    refetch: fetchPost,
  };
}

export function useBlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

export function useBlogTags() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }

      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    tags,
    loading,
    error,
    refetch: fetchTags,
  };
}

export function useBlogSearch(query: string) {
  const [results, setResults] = useState<StaticBlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim()) {
      searchPosts();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search blog posts');
      }

      const data = await response.json();
      setResults(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
  };
}