import { PrismaClient } from '@prisma/client';
import { logger } from '@logger';
const prisma = new PrismaClient();

async function testConnection() {
  try {
    // 测试数据库连接
    await prisma.$connect();
    console.log('✅ 成功连接到数据库');

    // 获取所有表名
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log('📋 数据库中的表:');
    tables.forEach((table) => {
      console.log(`  - ${table.table_name}`);
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

    console.log('\n🔍 验证必需的表:');
    for (const table of requiredTables) {
      const exists = tables.some((t) => t.table_name === table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    }

    // 测试创建一个用户
    console.log('\n📝 测试创建用户...');
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: '测试用户',
        password: 'hashed_password_here',
      }
    });
    console.log(`  ✅ 创建用户成功: ${user.id}`);

    // 查询用户
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    console.log(`  🔍 查询用户成功: ${foundUser?.name}`);

    // 清理测试数据
    await prisma.user.delete({
      where: { id: user.id }
    });
    console.log('  🧹 清理测试数据成功');

    await prisma.$disconnect();
    console.log('\n🎉 数据库连接和表结构验证完成!');
  } catch (error) {
    console.error('❌ 数据库测试失败:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();