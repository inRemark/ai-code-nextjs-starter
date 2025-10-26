/**
 * Redis配置测试工具
 * 用于验证Redis配置是否正确从环境变量读取
 */

import { getRedisService } from './client';
import { getRedisClient } from '../cache/redis';
import { logger } from '@logger';
export async function testRedisConfig() {
  logger.info('=== Redis配置测试 ===');
  
  // 显示当前配置
  logger.info('环境变量配置:');
  logger.info(`REDIS_URL: ${process.env.REDIS_URL || '未设置'}`);
  logger.info(`REDIS_HOST: ${process.env.REDIS_HOST || '未设置'}`);
  logger.info(`REDIS_PORT: ${process.env.REDIS_PORT || '未设置'}`);
  logger.info(`REDIS_PASSWORD: ${process.env.REDIS_PASSWORD ? '***已设置***' : '未设置'}`);
  logger.info(`REDIS_DB: ${process.env.REDIS_DB || '未设置'}`);
  
  try {
    // 测试RedisService
    logger.info('\n--- 测试RedisService ---');
    const redisService = getRedisService();
    await redisService.connect();
    const pingResult = await redisService.ping();
    logger.info(`RedisService ping结果: ${pingResult}`);
    logger.info(`RedisService连接状态: ${redisService.isReady()}`);
    
    // 测试基本操作
    await redisService.set('test:config', 'Hello Redis!', 60);
    const value = await redisService.get('test:config');
    logger.info(`RedisService测试值: ${value}`);
    await redisService.del('test:config');
    
    await redisService.disconnect();
    
    // 测试CacheManager
    logger.info('\n--- 测试CacheManager ---');
    const redisClient = await getRedisClient();
    if (redisClient) {
      const pingResult2 = await redisClient.ping();
      logger.info(`CacheManager ping结果: ${pingResult2}`);
      
      // 测试基本操作
      await redisClient.setex('test:cache', 60, 'Hello Cache!');
      const value2 = await redisClient.get('test:cache');
      logger.info(`CacheManager测试值: ${value2}`);
      await redisClient.del('test:cache');
      
      await redisClient.disconnect();
    } else {
      logger.info('CacheManager: Redis不可用，使用内存缓存');
    }
    
    logger.info('\n✅ Redis配置测试完成');
    
  } catch (error) {
    logger.error('❌ Redis配置测试失败', error);
  }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  testRedisConfig().catch((error) => logger.error('执行失败', error));
}
