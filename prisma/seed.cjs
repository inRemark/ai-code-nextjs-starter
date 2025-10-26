const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        name: '管理员',
        role: 'ADMIN',
        password: hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'company@test.com' },
      update: {},
      create: {
        email: 'company@test.com',
        name: '企业用户',
        role: 'USER',
        password: hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        email: 'user@test.com',
        name: '普通用户',
        role: 'USER',
        password: hashedPassword,
        emailVerified: new Date(),
      },
    }),
  ]);

  console.log('✅ Created users:');
  console.log('   - admin@test.com (password: password123) - 管理员');
  console.log('   - company@test.com (password: password123) - 企业用户');
  console.log('   - user@test.com (password: password123) - 普通用户');

  const articles = await Promise.all([
    prisma.article.upsert({
      where: { slug: 'welcome-to-nextjs-template' },
      update: {},
      create: {
        title: '欢迎使用 Next.js 模板项目',
        slug: 'welcome-to-nextjs-template',
        content: '<h1>欢迎使用 Next.js 模板项目</h1><p>这是一个功能完整的 Next.js 15 + React 19 开发模板，包含了认证、权限等核心功能模块。</p><h2>主要特性</h2><ul><li>基于 Next.js 15 App Router</li><li>TypeScript 严格类型检查</li><li>Prisma ORM + PostgreSQL</li><li>NextAuth.js v5 认证</li><li>Tailwind CSS + Radix UI</li></ul>',
        excerpt: '这是一个功能完整的 Next.js 15 + React 19 开发模板，包含了认证、权限等核心功能模块。',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        authorId: users[0].id,
        published: true,
        publishedAt: new Date('2025-10-26'),
        tags: ['Next.js', 'React', 'TypeScript', '模板'],
        viewCount: 156,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'features-module-guide' },
      update: {},
      create: {
        title: 'Features 模块开发指南',
        slug: 'features-module-guide',
        content: '<h1>Features 模块开发指南</h1><p>本模板采用 Features 模块化架构，每个业务功能都是独立的模块。</p><h2>标准目录结构</h2><pre>features/[module]/\n  ├── services/      # 业务逻辑服务\n  ├── types/         # 类型定义\n  ├── validators/    # 数据验证\n  ├── components/    # UI 组件\n  ├── hooks/         # React Hooks\n  ├── index.ts       # 统一导出\n  └── README.md      # 模块文档</pre>',
        excerpt: '本模板采用 Features 模块化架构，每个业务功能都是独立的模块。了解如何创建标准化的业务模块。',
        coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec',
        authorId: users[0].id,
        published: true,
        publishedAt: new Date('2025-10-25'),
        tags: ['开发指南', 'Features', '模块化'],
        viewCount: 89,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'authentication-setup' },
      update: {},
      create: {
        title: '如何配置身份认证',
        slug: 'authentication-setup',
        content: '<h1>如何配置身份认证</h1><p>本模板使用 NextAuth.js v5 提供强大的身份认证功能。</p><h2>支持的认证方式</h2><ul><li>邮箱密码登录</li><li>Google OAuth</li><li>GitHub OAuth</li></ul><h2>配置步骤</h2><ol><li>设置环境变量</li><li>配置 OAuth 提供商</li><li>自定义登录页面</li><li>实现权限控制</li></ol>',
        excerpt: '了解如何在模板项目中配置和使用 NextAuth.js v5 进行身份认证，支持多种 OAuth 登录方式。',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        authorId: users[1].id,
        published: true,
        publishedAt: new Date('2025-10-24'),
        tags: ['认证', 'NextAuth', 'OAuth'],
        viewCount: 124,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'my-first-blog-draft' },
      update: {},
      create: {
        title: '我的第一篇博客（草稿）',
        slug: 'my-first-blog-draft',
        content: '<p>这是我在这个平台上的第一篇博客文章，目前还在编辑中...</p>',
        excerpt: '这是一篇草稿文章，展示文章的草稿状态。',
        authorId: users[2].id,
        published: false,
        tags: ['测试', '草稿'],
        viewCount: 0,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'prisma-best-practices' },
      update: {},
      create: {
        title: 'Prisma ORM 最佳实践',
        slug: 'prisma-best-practices',
        content: '<h1>Prisma ORM 最佳实践</h1><p>分享在生产环境中使用 Prisma ORM 的经验和技巧。</p><h2>Schema 设计</h2><ul><li>合理使用索引</li><li>设置级联删除</li><li>枚举类型的应用</li></ul><h2>查询优化</h2><ul><li>使用 include 和 select</li><li>避免 N+1 查询</li><li>批量操作优化</li></ul>',
        excerpt: '分享在生产环境中使用 Prisma ORM 的经验和技巧，包括 Schema 设计和查询优化。',
        coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
        authorId: users[0].id,
        published: true,
        publishedAt: new Date('2025-10-23'),
        tags: ['Prisma', 'Database', '最佳实践'],
        viewCount: 67,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'company-user-article' },
      update: {},
      create: {
        title: '企业用户的技术分享',
        slug: 'company-user-article',
        content: '<h1>技术分享</h1><p>分享一些企业级应用开发的经验。</p>',
        excerpt: '企业级应用开发经验分享。',
        authorId: users[1].id,
        published: true,
        publishedAt: new Date('2025-10-22'),
        tags: ['企业', '技术'],
        viewCount: 45,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'user-article-1' },
      update: {},
      create: {
        title: '普通用户的文章 1',
        slug: 'user-article-1',
        content: '<p>这是普通用户的第一篇文章。</p>',
        excerpt: '普通用户的第一篇文章。',
        authorId: users[2].id,
        published: true,
        publishedAt: new Date('2025-10-21'),
        tags: ['用户', '分享'],
        viewCount: 23,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'user-article-2' },
      update: {},
      create: {
        title: '普通用户的文章 2',
        slug: 'user-article-2',
        content: '<p>这是普通用户的第二篇文章。</p>',
        excerpt: '普通用户的第二篇文章。',
        authorId: users[2].id,
        published: true,
        publishedAt: new Date('2025-10-20'),
        tags: ['学习', '笔记'],
        viewCount: 18,
      },
    }),
  ]);

  console.log('✅ Created articles:', articles.length);

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - ${users.length} users (admin, company, user)`);
  console.log(`   - ${articles.length} articles`);
  console.log('\n💡 Test Accounts:');
  console.log('   admin@test.com / password123 - 管理后台访问');
  console.log('   company@test.com / password123 - Console 控制台');
  console.log('   user@test.com / password123 - Profile 个人中心');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
