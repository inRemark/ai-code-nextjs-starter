/**
 * Redis Cache Configuration
 * Redis缓存配置和工具函数
 */

import { Redis } from 'ioredis';
import { logger } from '@logger';

// Redis客户端配置
const redisConfig = {
  url: process.env.REDIS_URL,
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
};

// 创建Redis客户端
let redisClient: Redis | null = null;

export async function getRedisClient(): Promise<Redis | null> {
  if (!redisClient) {
    try {
      // 优先使用REDIS_URL，如果没有则使用分离的配置
      if (redisConfig.url) {
        redisClient = new Redis(redisConfig.url, {
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });
      } else {
        redisClient = new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          db: redisConfig.db,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });
      }

      redisClient.on('error', (err: Error) => {
        logger.error('Redis 客户端错误', err);
      });

      redisClient.on('connect', () => {
        logger.success('Redis 客户端连接成功');
      });

      // 测试连接
      await redisClient.ping();
    } catch (error) {
      logger.error('连接 Redis 失败', error);
      // 在Redis不可用时，返回null，使用内存缓存作为降级方案
      return null;
    }
  }

  return redisClient;
}

// 缓存键前缀
export const CACHE_KEYS = {
  SEARCH_RESULTS: 'search:results',
} as const;

// 缓存过期时间（秒）
export const CACHE_TTL = {
  SHORT: 60 * 5,        // 5分钟
  MEDIUM: 60 * 30,      // 30分钟
  LONG: 60 * 60,        // 1小时
  DAILY: 60 * 60 * 24,  // 24小时
} as const;

// 内存缓存作为降级方案
const memoryCache = new Map<string, { data: any; expiry: number }>();

/**
 * 缓存管理类
 */
export class CacheManager {
  private redis: any = null;

  constructor() {
    this.initRedis();
  }

  private async initRedis() {
    try {
      this.redis = await getRedisClient();
    } catch (error) {
      logger.error('Redis initialization failed, using memory cache:', error);
    }
  }

  /**
   * 设置缓存
   */
  async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    const serializedValue = JSON.stringify(value);

    try {
      if (this.redis) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        // 降级到内存缓存
        memoryCache.set(key, {
          data: value,
          expiry: Date.now() + ttl * 1000,
        });
        this.cleanupMemoryCache();
      }
    } catch (error) {
      logger.error('Cache set error:', error);
      // 静默失败，不影响业务逻辑
    }
  }

  /**
   * 获取缓存
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.redis) {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // 从内存缓存获取
        const cached = memoryCache.get(key);
        if (cached && cached.expiry > Date.now()) {
          return cached.data;
        } else if (cached) {
          memoryCache.delete(key);
        }
        return null;
      }
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.del(key);
      } else {
        memoryCache.delete(key);
      }
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }

  /**
   * 批量删除缓存（按模式）
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      if (this.redis) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(keys);
        }
      } else {
        // 内存缓存批量删除
        const keysToDelete = Array.from(memoryCache.keys()).filter(key =>
          this.matchPattern(key, pattern)
        );
        keysToDelete.forEach(key => memoryCache.delete(key));
      }
    } catch (error) {
      logger.error('Cache delete pattern error:', error);
    }
  }

  /**
   * 检查缓存是否存在
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (this.redis) {
        return (await this.redis.exists(key)) === 1;
      } else {
        const cached = memoryCache.get(key);
        return cached ? cached.expiry > Date.now() : false;
      }
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * 设置缓存过期时间
   */
  async expire(key: string, ttl: number): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.expire(key, ttl);
      } else {
        const cached = memoryCache.get(key);
        if (cached) {
          cached.expiry = Date.now() + ttl * 1000;
        }
      }
    } catch (error) {
      logger.error('Cache expire error:', error);
    }
  }

  /**
   * 获取缓存状态信息
   */
  async getStats(): Promise<{
    type: 'redis' | 'memory';
    connected: boolean;
    keyCount: number;
  }> {
    if (this.redis) {
      try {
        const info = await this.redis.info('keyspace');
        const keyCount = this.parseKeyCount(info);
        return {
          type: 'redis',
          connected: true,
          keyCount,
        };
      } catch (error) {
        return {
          type: 'redis',
          connected: false,
          keyCount: 0,
        };
      }
    } else {
      return {
        type: 'memory',
        connected: true,
        keyCount: memoryCache.size,
      };
    }
  }

  /**
   * 清理过期的内存缓存
   */
  private cleanupMemoryCache(): void {
    const now = Date.now();
    for (const [key, value] of memoryCache.entries()) {
      if (value.expiry <= now) {
        memoryCache.delete(key);
      }
    }
  }

  /**
   * 简单的模式匹配
   */
  private matchPattern(key: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(key);
  }

  /**
   * 解析Redis keyspace信息获取键数量
   */
  private parseKeyCount(info: string): number {
    const match = info.match(/keys=(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}

// 导出单例实例
export const cacheManager = new CacheManager();

/**
 * 缓存装饰器工具函数
 */
export function withCache<T extends any[], R>(
  keyGenerator: (...args: T) => string,
  ttl: number = CACHE_TTL.MEDIUM
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: T): Promise<R> {
      const cacheKey = keyGenerator(...args);
      
      // 尝试从缓存获取
      const cached = await cacheManager.get<R>(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // 执行原方法
      const result = await method.apply(this, args);
      
      // 缓存结果
      await cacheManager.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

/**
 * 生成缓存键的工具函数
 */
export function generateCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`;
}