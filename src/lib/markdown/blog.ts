import path from 'node:path';
import { loadMarkdownFile, loadMarkdownFiles, fileExists } from './loader';

export interface BlogFrontmatter {
  title: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  excerpt: string;
  featured?: boolean;
  readTime?: number;
  coverImage?: string;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

/**
 * 获取所有博客文章
 */
export async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const blogDir = path.join(process.cwd(), 'docs/blog', locale);
  const posts = await loadMarkdownFiles<BlogFrontmatter>(blogDir);
  
  // 按日期降序排序
  return posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}

/**
 * 获取单篇博客文章
 */
export async function getBlogPost(
  locale: string, 
  slug: string
): Promise<BlogPost | null> {
  const filePath = path.join(process.cwd(), 'docs/blog', locale, `${slug}.md`);
  
  if (!(await fileExists(filePath))) {
    return null;
  }
  
  return loadMarkdownFile<BlogFrontmatter>(filePath);
}

/**
 * 获取博客文章（带回退机制）
 * 如果指定语言的文章不存在，回退到中文
 */
export async function getBlogPostWithFallback(
  locale: string,
  slug: string
): Promise<BlogPost | null> {
  let post = await getBlogPost(locale, slug);
  
  if (!post && locale !== 'zh') {
    post = await getBlogPost('zh', slug);
  }
  
  return post;
}

/**
 * 获取精选文章
 */
export async function getFeaturedPosts(locale: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts(locale);
  return posts.filter(post => post.frontmatter.featured);
}

/**
 * 按分类获取文章
 */
export async function getPostsByCategory(
  locale: string,
  category: string
): Promise<BlogPost[]> {
  const posts = await getBlogPosts(locale);
  return posts.filter(post => post.frontmatter.category === category);
}

/**
 * 搜索文章
 */
export async function searchPosts(
  locale: string,
  query: string
): Promise<BlogPost[]> {
  const posts = await getBlogPosts(locale);
  const lowerQuery = query.toLowerCase();
  
  return posts.filter(post => {
    const titleMatch = post.frontmatter.title.toLowerCase().includes(lowerQuery);
    const excerptMatch = post.frontmatter.excerpt.toLowerCase().includes(lowerQuery);
    const contentMatch = post.content.toLowerCase().includes(lowerQuery);
    const tagsMatch = post.frontmatter.tags.some(tag => 
      tag.toLowerCase().includes(lowerQuery)
    );
    
    return titleMatch || excerptMatch || contentMatch || tagsMatch;
  });
}

/**
 * 获取所有分类
 */
export async function getAllCategories(locale: string): Promise<string[]> {
  const posts = await getBlogPosts(locale);
  const categories = new Set(posts.map(post => post.frontmatter.category));
  return Array.from(categories);
}

/**
 * 获取所有标签
 */
export async function getAllTags(locale: string): Promise<string[]> {
  const posts = await getBlogPosts(locale);
  const tags = new Set(posts.flatMap(post => post.frontmatter.tags));
  return Array.from(tags);
}
