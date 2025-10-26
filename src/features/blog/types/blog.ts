// 博客系统相关的类型定义

export interface StaticBlogPost {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    author: string;
    tags: string[];
    category: string;
    excerpt: string;
    coverImage?: string;
    featured?: boolean;
    readTime?: number;
  };
  content: string; // Markdown content
}

export interface BlogMetadata {
  posts: StaticBlogPost[];
  categories: string[];
  tags: string[];
  authors: string[];
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  email?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  postCount: number;
  color?: string;
}

export interface BlogTag {
  name: string;
  slug: string;
  postCount: number;
}

export interface TOCItem {
  id: string;
  title: string;
  level: number; // 1-6 for h1-h6
  children?: TOCItem[];
}

export interface BlogSearchResult {
  posts: StaticBlogPost[];
  totalCount: number;
  hasMore: boolean;
  searchQuery: string;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface MarkdownComponents {
  h1: React.ComponentType<any>;
  h2: React.ComponentType<any>;
  h3: React.ComponentType<any>;
  h4: React.ComponentType<any>;
  h5: React.ComponentType<any>;
  h6: React.ComponentType<any>;
  code: React.ComponentType<any>;
  pre: React.ComponentType<any>;
  img: React.ComponentType<any>;
  a: React.ComponentType<any>;
  blockquote: React.ComponentType<any>;
  table: React.ComponentType<any>;
}

export interface BlogPageData {
  posts: StaticBlogPost[];
  pagination: PaginationData;
  filters: BlogFilters;
  categories: BlogCategory[];
  tags: BlogTag[];
  featuredPosts: StaticBlogPost[];
}

export interface BlogPostPageData {
  post: StaticBlogPost;
  relatedPosts: StaticBlogPost[];
  tableOfContents: TOCItem[];
  author: BlogAuthor;
}

export type BlogLayout = 'grid' | 'list' | 'card';

export type BlogSortBy = 'date' | 'title' | 'popularity' | 'readTime';