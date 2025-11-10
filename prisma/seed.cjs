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
        name: 'Administrator',
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
        name: 'Company User',
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
        name: 'Regular User',
        role: 'USER',
        password: hashedPassword,
        emailVerified: new Date(),
      },
    }),
  ]);

  console.log('✅ Created users:');
  console.log('   - admin@test.com (password: password123) - Administrator');
  console.log('   - company@test.com (password: password123) - Company User');
  console.log('   - user@test.com (password: password123) - Regular User');

  const articles = await Promise.all([
    prisma.article.upsert({
      where: { slug: 'welcome-to-nextjs-template' },
      update: {},
      create: {
        title: 'Welcome to the Next.js Template Project',
        slug: 'welcome-to-nextjs-template',
        content: '<h1>Welcome to the Next.js Template Project</h1><p>This is a fully featured Next.js 15 + React 19 starter template, including core modules like authentication and authorization.</p><h2>Main Features</h2><ul><li>Based on Next.js 15 App Router</li><li>Strict TypeScript checking</li><li>Prisma ORM + PostgreSQL</li><li>NextAuth.js v5 authentication</li><li>Tailwind CSS + Radix UI</li></ul>',
        excerpt: 'This is a fully featured Next.js 15 + React 19 starter template, including core modules like authentication and authorization.',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        authorId: users[0].id,
        published: true,
        publishedAt: new Date('2025-10-26'),
        tags: ['Next.js', 'React', 'TypeScript', 'Template'],
        viewCount: 156,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'features-module-guide' },
      update: {},
      create: {
        title: 'Features Module Development Guide',
        slug: 'features-module-guide',
        content: '<h1>Features Module Development Guide</h1><p>This template uses a Features modular architecture, where each business feature is an independent module.</p><h2>Standard Directory Structure</h2><pre>features/[module]/\n  ├── services/      # Business logic services\n  ├── types/         # Type definitions\n  ├── validators/    # Data validation\n  ├── components/    # UI components\n  ├── hooks/         # React Hooks\n  ├── index.ts       # Unified exports\n  └── README.md      # Module documentation</pre>',
        excerpt: 'This template uses a Features modular architecture, where each business feature is an independent module. Learn how to create standardized business modules.',
        coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec',
        authorId: users[0].id,
        published: true,
        publishedAt: new Date('2025-10-25'),
        tags: ['Development Guide', 'Features', 'Modularization'],
        viewCount: 89,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'authentication-setup' },
      update: {},
      create: {
        title: 'How to Configure Authentication',
        slug: 'authentication-setup',
        content: '<h1>How to Configure Authentication</h1><p>This template uses NextAuth.js v5 to provide powerful authentication features.</p><h2>Supported Authentication Methods</h2><ul><li>Email and password login</li><li>Google OAuth</li><li>GitHub OAuth</li></ul><h2>Configuration Steps</h2><ol><li>Set environment variables</li><li>Configure OAuth providers</li><li>Customize login page</li><li>Implement access control</li></ol>',
        excerpt: 'Learn how to configure and use NextAuth.js v5 for authentication in the template project, supporting multiple OAuth login methods.',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        authorId: users[1].id,
        published: true,
        publishedAt: new Date('2025-10-24'),
        tags: ['Authentication', 'NextAuth', 'OAuth'],
        viewCount: 124,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'my-first-blog-draft' },
      update: {},
      create: {
        title: 'My First Blog (Draft)',
        slug: 'my-first-blog-draft',
        content: '<p>This is my first blog post on this platform, currently still being edited...</p>',
        excerpt: 'This is a draft article, showcasing the draft status of the article.',
        authorId: users[2].id,
        published: false,
        tags: ['Test', 'Draft'],
        viewCount: 0,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'prisma-best-practices' },
      update: {},
      create: {
        title: 'Prisma ORM Best Practices',
        slug: 'prisma-best-practices',
        content: '<h1>Prisma ORM Best Practices</h1><p>Sharing experiences and tips for using Prisma ORM in production environments.</p><h2>Schema Design</h2><ul><li>Proper use of indexes</li><li>Setting up cascade deletes</li><li>Application of enum types</li></ul><h2>Query Optimization</h2><ul><li>Using include and select</li><li>Avoiding N+1 queries</li><li>Batch operation optimization</li></ul>',
        excerpt: 'Sharing experiences and tips for using Prisma ORM in production environments, including schema design and query optimization.',
        coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
        authorId: users[0].id,
        published: true,
        publishedAt: new Date('2025-10-23'),
        tags: ['Prisma', 'Database', 'Best Practices'],
        viewCount: 67,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'company-user-article' },
      update: {},
      create: {
        title: 'Technical Sharing by Enterprise Users',
        slug: 'company-user-article',
        content: '<h1>Technical Sharing</h1><p>Sharing some experiences in enterprise application development.</p>',
        excerpt: 'Sharing experiences in enterprise application development.',
        authorId: users[1].id,
        published: true,
        publishedAt: new Date('2025-10-22'),
        tags: ['Enterprise', 'Technology'],
        viewCount: 45,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'user-article-1' },
      update: {},
      create: {
        title: 'Regular User Article 1',
        slug: 'user-article-1',
        content: '<p>This is the first article by a regular user.</p>',
        excerpt: 'The first article by a regular user.',
        authorId: users[2].id,
        published: true,
        publishedAt: new Date('2025-10-21'),
        tags: ['User', 'Sharing'],
        viewCount: 23,
      },
    }),
    prisma.article.upsert({
      where: { slug: 'user-article-2' },
      update: {},
      create: {
        title: 'Regular User Article 2',
        slug: 'user-article-2',
        content: '<p>This is the second article by a regular user.</p>',
        excerpt: 'The second article by a regular user.',
        authorId: users[2].id,
        published: true,
        publishedAt: new Date('2025-10-20'),
        tags: ['Learning', 'Notes'],
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
  console.log('   admin@test.com / password123 - Admin Dashboard Access');
  console.log('   company@test.com / password123 - Console Access');
  console.log('   user@test.com / password123 - Profile Access');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
