import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { StaticBlogPost, BlogCategory, BlogTag } from '@features/blog/types/blog';

// 模拟博客文章数据
const mockBlogPosts: StaticBlogPost[] = [
  {
    slug: 'getting-started-with-sendmail',
    frontmatter: {
      title: 'AICoder 入门指南：从零开始的邮件营销',
      date: '2024-01-20',
      author: '产品团队',
      tags: ['入门', '邮件营销', '教程'],
      category: 'tutorials',
      excerpt: '了解如何使用 AICoder 开始您的第一个邮件营销活动，包括账户设置、客户导入和邮件发送的完整流程。',
      coverImage: '/images/blog/getting-started.jpg',
      featured: true,
      readTime: 8,
    },
    content: `# AICoder 入门指南

欢迎来到 AICoder！本文将带您了解如何从零开始使用我们的邮件营销平台。

## 第一步：创建账户

1. 访问我们的注册页面
2. 填写基本信息
3. 验证邮箱地址
4. 完成账户设置

## 第二步：导入客户数据

AICoder 支持多种方式导入客户数据：

- CSV 文件上传
- 手动添加
- API 集成

## 第三步：创建邮件模板

我们提供丰富的模板库，您也可以：

- 使用拖拽编辑器自定义模板
- 导入现有 HTML 模板
- 使用 AI 生成邮件内容

## 开始发送邮件

一切准备就绪后，您就可以开始发送邮件了！`,
  },
  {
    slug: 'email-deliverability-best-practices',
    frontmatter: {
      title: '提升邮件送达率的10个最佳实践',
      date: '2024-01-18',
      author: '技术团队',
      tags: ['送达率', '最佳实践', '技术'],
      category: 'best-practices',
      excerpt: '学习如何优化邮件内容、发送频率和列表质量，确保您的邮件能够成功送达收件人的收件箱。',
      coverImage: '/images/blog/deliverability.jpg',
      featured: true,
      readTime: 12,
    },
    content: `# 提升邮件送达率的10个最佳实践

邮件送达率是邮件营销成功的关键指标。本文分享10个实用技巧。

## 1. 维护良好的发件人声誉

- 使用专用IP地址
- 保持一致的发送模式
- 监控黑名单状态

## 2. 优化邮件内容

- 避免垃圾邮件关键词
- 平衡图片和文字比例
- 使用清晰的主题行

## 3. 管理邮件列表质量

- 定期清理无效邮箱
- 使用双重确认订阅
- 提供简单的退订方式`,
  },
  {
    slug: 'automation-workflow-guide',
    frontmatter: {
      title: '邮件自动化工作流完全指南',
      date: '2024-01-15',
      author: '营销团队',
      tags: ['自动化', '工作流', '营销'],
      category: 'automation',
      excerpt: '深入了解如何设置和优化邮件自动化工作流，从欢迎邮件到客户留存，提升营销效率。',
      coverImage: '/images/blog/automation.jpg',
      featured: false,
      readTime: 15,
    },
    content: `# 邮件自动化工作流完全指南

自动化是现代邮件营销的核心。本指南将教您如何构建高效的自动化工作流。

## 常见的自动化场景

### 1. 欢迎邮件序列
- 立即发送欢迎邮件
- 介绍产品和服务
- 提供有价值的内容

### 2. 客户生日祝福
- 自动收集生日信息
- 个性化祝福内容
- 附带特别优惠

### 3. 购物车放弃提醒
- 检测购物车状态
- 发送提醒邮件
- 提供购买激励`,
  },
];

const mockCategories: BlogCategory[] = [
  {
    id: 'tutorials',
    name: '教程指南',
    description: '详细的使用教程和操作指南',
    slug: 'tutorials',
    postCount: 8,
    color: '#3b82f6',
  },
  {
    id: 'best-practices',
    name: '最佳实践',
    description: '邮件营销的技巧和最佳实践',
    slug: 'best-practices', 
    postCount: 12,
    color: '#10b981',
  },
  {
    id: 'automation',
    name: '自动化营销',
    description: '邮件自动化和工作流设计',
    slug: 'automation',
    postCount: 6,
    color: '#8b5cf6',
  },
  {
    id: 'updates',
    name: '产品更新',
    description: '最新功能发布和产品动态',
    slug: 'updates',
    postCount: 15,
    color: '#f59e0b',
  },
];

const mockTags: BlogTag[] = [
  { name: '入门', slug: 'getting-started', postCount: 5 },
  { name: '邮件营销', slug: 'email-marketing', postCount: 18 },
  { name: '最佳实践', slug: 'best-practices', postCount: 12 },
  { name: '自动化', slug: 'automation', postCount: 8 },
  { name: '技术', slug: 'technical', postCount: 6 },
  { name: '营销', slug: 'marketing', postCount: 10 },
];

// GET /api/blog - 获取博客文章列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const author = searchParams.get('author');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // 过滤文章
    let filteredPosts = mockBlogPosts.filter(post => {
      if (category && post.frontmatter.category !== category) return false;
      if (tag && !post.frontmatter.tags.includes(tag)) return false;
      if (author && post.frontmatter.author !== author) return false;
      if (startDate && new Date(post.frontmatter.date) < new Date(startDate)) return false;
      if (endDate && new Date(post.frontmatter.date) > new Date(endDate)) return false;
      return true;
    });
    
    // 按日期排序
    filteredPosts.sort((a, b) => 
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
    
    // 分页
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
    
    // 获取特色文章
    const featuredPosts = mockBlogPosts
      .filter(post => post.frontmatter.featured)
      .slice(0, 3);
    
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
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' }, 
      { status: 500 }
    );
  }
}