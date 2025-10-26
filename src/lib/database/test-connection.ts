import { PrismaClient } from '@prisma/client';
import { logger } from '@logger';

const prisma = new PrismaClient();

interface TableInfo {
  table_name: string;
}

async function testConnection() {
  try {
    // 测试数据库连接
    await prisma.$connect();
    logger.success('成功连接到数据库');

    // 获取所有表名
    const tables = await prisma.$queryRaw<TableInfo[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    logger.info('📋 数据库中的表:');
    tables.forEach((table) => {
      logger.info(`  - ${table.table_name}`);
    });

    // 检查特定表是否存在
    const requiredTables = [
      'users',
      'customers',
      'customer_groups',
      'customer_group_members',
      'email_templates',
      'template_variables',
      'mail_tasks',
      'email_jobs',
      'email_attachments',
      'email_stats',
      'email_open_tracking',
      'email_click_tracking',
      'unsubscribe_records'
    ];

    logger.info('\n🔍 验证必需的表:');
    for (const table of requiredTables) {
      const exists = tables.some((t) => t.table_name === table);
      logger.info(`  ${exists ? '✅' : '❌'} ${table}`);
    }

    // 测试创建一个用户
    logger.info('\n📝 测试创建用户...');
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: '测试用户',
        password: 'hashed_password_here',
      }
    });
    logger.success(`  创建用户成功: ${user.id}`);

    // 查询用户
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    logger.info(`  🔍 查询用户成功: ${foundUser?.name}`);

    // 清理测试数据
    await prisma.user.delete({
      where: { id: user.id }
    });
    logger.success('  🧹 清理测试数据成功');

    await prisma.$disconnect();
    logger.success('\n🎉 数据库连接和表结构验证完成!');
  } catch (error) {
    logger.error('数据库测试失败', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();