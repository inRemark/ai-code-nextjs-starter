import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, getBlogPost, searchPosts } from '@/lib/markdown/blog';

const mockCategories = [
  {
    id: 'tutorials',
    name: '教程指南',
    description: '详细的使用教程和操作指南',
    slug: 'tutorials',
    postCount: 0,
    color: '#3b82f6',
  },
  {
    id: 'best-practices',
    name: '最佳实践',
    description: '邮件营销的技巧和最佳实践',
    slug: 'best-practices', 
    postCount: 0,
    color: '#10b981',
  },
];

const mockTags = [
  { name: '入门', slug: 'getting-started', postCount: 0 },
  { name: '邮件营销', slug: 'email-marketing', postCount: 0 },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'zh';
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const search = searchParams.get('search');
    
    if (slug) {
      const post = await getBlogPost(locale, slug);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({
        posts: [post],
        pagination: { currentPage: 1, totalPages: 1, totalPosts: 1, postsPerPage: 1, hasNext: false, hasPrevious: false },
      });
    }
    
    let posts = search ? await searchPosts(locale, search) : await getBlogPosts(locale);
    
    if (category && category !== 'all') {
      posts = posts.filter(post => post.frontmatter.category === category);
    }
    
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const paginatedPosts = posts.slice(startIndex, startIndex + limit);
    const featuredPosts = posts.filter(post => post.frontmatter.featured).slice(0, 3);
    
    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        postsPerPage: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
      categories: mockCategories,
      tags: mockTags,
      featuredPosts,
    });
  } catch (error) {
    logger.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
