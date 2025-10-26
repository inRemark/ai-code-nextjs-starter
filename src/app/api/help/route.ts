import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { HelpCategory, HelpArticle, QuickAction, PopularArticle } from '@/features/help';

// 模拟帮助中心数据
const mockHelpCategories: HelpCategory[] = [
  {
    id: '1',
    name: '快速开始',
    icon: 'rocket',
    description: '新用户入门指南和基础操作',
    order: 1,
    articles: [
      {
        id: '1',
        title: '如何创建第一个邮件模板',
        content: '详细介绍如何创建和编辑邮件模板...',
        categoryId: '1',
        tags: ['模板', '入门', '新手'],
        difficulty: 'beginner',
        lastUpdated: new Date('2024-01-15'),
        views: 1250,
        helpful: 98,
        author: '产品团队',
        publishedAt: new Date('2024-01-10'),
      },
      {
        id: '2',
        title: '导入客户数据的完整指南',
        content: '学习如何导入和管理客户联系人...',
        categoryId: '1',
        tags: ['客户', '导入', '数据'],
        difficulty: 'beginner',
        lastUpdated: new Date('2024-01-12'),
        views: 890,
        helpful: 76,
        author: '产品团队',
        publishedAt: new Date('2024-01-08'),
      },
    ],
  },
  {
    id: '2',
    name: '邮件管理',
    icon: 'mail',
    description: '邮件发送、模板管理、统计分析',
    order: 2,
    articles: [
      {
        id: '3',
        title: '批量邮件发送最佳实践',
        content: '了解如何高效、安全地进行批量邮件发送...',
        categoryId: '2',
        tags: ['批量发送', '最佳实践', '效率'],
        difficulty: 'intermediate',
        lastUpdated: new Date('2024-01-20'),
        views: 2100,
        helpful: 167,
        videoUrl: 'https://example.com/video/batch-email',
        author: '技术团队',
        publishedAt: new Date('2024-01-15'),
      },
      {
        id: '4',
        title: '提升邮件打开率的策略',
        content: '学习如何优化邮件内容和发送时机...',
        categoryId: '2',
        tags: ['打开率', '优化', '策略'],
        difficulty: 'intermediate',
        lastUpdated: new Date('2024-01-18'),
        views: 1680,
        helpful: 134,
        author: '营销团队',
        publishedAt: new Date('2024-01-12'),
      },
    ],
  },
  {
    id: '3',
    name: '客户管理',
    icon: 'users',
    description: '客户分组、标签管理、数据维护',
    order: 3,
    articles: [
      {
        id: '5',
        title: '客户分组和标签系统',
        content: '了解如何有效组织和管理客户数据...',
        categoryId: '3',
        tags: ['分组', '标签', '管理'],
        difficulty: 'beginner',
        lastUpdated: new Date('2024-01-16'),
        views: 920,
        helpful: 82,
        author: '产品团队',
        publishedAt: new Date('2024-01-10'),
      },
    ],
  },
  {
    id: '4',
    name: '高级功能',
    icon: 'settings',
    description: 'API使用、自动化工作流、集成配置',
    order: 4,
    articles: [
      {
        id: '6',
        title: 'API集成开发指南',
        content: '详细的API文档和集成示例...',
        categoryId: '4',
        tags: ['API', '集成', '开发'],
        difficulty: 'advanced',
        lastUpdated: new Date('2024-01-22'),
        views: 560,
        helpful: 45,
        author: '技术团队',
        publishedAt: new Date('2024-01-18'),
      },
    ],
  },
  {
    id: '5',
    name: '故障排除',
    icon: 'alert-circle',
    description: '常见问题、错误代码、解决方案',
    order: 5,
    articles: [
      {
        id: '7',
        title: '邮件发送失败常见原因',
        content: '分析和解决邮件发送失败的问题...',
        categoryId: '5',
        tags: ['故障排除', '发送失败', '解决方案'],
        difficulty: 'intermediate',
        lastUpdated: new Date('2024-01-19'),
        views: 1340,
        helpful: 112,
        author: '技术支持团队',
        publishedAt: new Date('2024-01-14'),
      },
    ],
  },
  {
    id: '6',
    name: '账户安全',
    icon: 'shield',
    description: '密码管理、二次验证、权限设置',
    order: 6,
    articles: [
      {
        id: '8',
        title: '启用两步验证保护账户',
        content: '详细步骤设置两步验证增强安全性...',
        categoryId: '6',
        tags: ['安全', '两步验证', '账户保护'],
        difficulty: 'beginner',
        lastUpdated: new Date('2024-01-17'),
        views: 780,
        helpful: 65,
        author: '安全团队',
        publishedAt: new Date('2024-01-11'),
      },
    ],
  },
];

const mockQuickActions: QuickAction[] = [
  {
    id: '1',
    title: '创建邮件模板',
    description: '快速创建新的邮件模板',
    icon: 'plus',
    url: '/mail/templates',
    category: '邮件管理',
  },
  {
    id: '2',
    title: '导入客户数据',
    description: '批量导入客户联系人',
    icon: 'upload',
    url: '/customers/import',
    category: '客户管理',
  },
  {
    id: '3',
    title: '发送测试邮件',
    description: '查看通知发送历史',
    icon: 'history',
    url: '/mail/history',
    category: '通知管理',
  },
  {
    id: '4',
    title: '查看API文档',
    description: '集成开发参考文档',
    icon: 'book',
    url: '/help/api',
    category: '高级功能',
  },
];

// GET /api/help - 获取帮助中心首页数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (query) {
      // 搜索功能
      const allArticles = mockHelpCategories.flatMap(category => category.articles);
      const searchResults = allArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      return NextResponse.json({
        articles: searchResults,
        categories: [],
        totalCount: searchResults.length,
        searchQuery: query,
        suggestions: searchResults.length === 0 ? ['模板', '客户', '发送', 'API'] : [],
      });
    }
    
    // 获取首页数据
    const popularArticles: PopularArticle[] = mockHelpCategories
      .flatMap(category => category.articles)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((article, index) => ({
        article,
        rank: index + 1,
        trend: index < 2 ? 'up' : index < 4 ? 'stable' : 'down',
      }));
    
    const recentArticles = mockHelpCategories
      .flatMap(category => category.articles)
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      .slice(0, 5);
    
    const stats = {
      totalArticles: mockHelpCategories.reduce((sum, cat) => sum + cat.articles.length, 0),
      totalViews: mockHelpCategories.reduce((sum, cat) => 
        sum + cat.articles.reduce((catSum, article) => catSum + article.views, 0), 0
      ),
      averageRating: 4.8,
      popularTopics: ['邮件模板', '客户管理', '批量发送', 'API集成'],
      recentUpdates: recentArticles,
    };
    
    const contactSupport = {
      channels: [
        {
          type: 'email' as const,
          name: '邮件支持',
          description: '发送邮件获取帮助',
          contact: 'support@sendmail.com',
          available: true,
          icon: 'mail',
        },
        {
          type: 'chat' as const,
          name: '在线客服',
          description: '实时在线聊天',
          contact: '工作日 9:00-18:00',
          available: true,
          icon: 'message-circle',
        },
        {
          type: 'phone' as const,
          name: '电话支持',
          description: '电话技术支持',
          contact: '400-123-4567',
          available: false,
          icon: 'phone',
        },
      ],
      businessHours: '工作日 9:00-18:00 (UTC+8)',
      responseTime: '通常在 2-4 小时内回复',
      languages: ['中文', 'English'],
    };
    
    return NextResponse.json({
      categories: mockHelpCategories,
      popularArticles,
      quickActions: mockQuickActions,
      recentArticles,
      stats,
      contactSupport,
    });
  } catch (error) {
    logger.error('Error fetching help data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch help data' }, 
      { status: 500 }
    );
  }
}