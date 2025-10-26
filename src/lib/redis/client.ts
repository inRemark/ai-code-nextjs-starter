import { Redis } from 'ioredis';
import { logger } from '@logger';

// Redis配置从环境变量读取
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
};

class RedisService {
  private client: Redis;
  private isConnected: boolean = false;

  constructor() {
    // 优先使用REDIS_URL，如果没有则使用分离的配置
    if (redisConfig.url) {
      this.client = new Redis(redisConfig.url, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
    } else {
      this.client = new Redis({
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
        db: redisConfig.db,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
    }

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('connect', () => {
      logger.success('Redis 连接成功');
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      logger.error('Redis 连接错误', error);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      logger.info('Redis 连接已关闭');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
    }
  }

  getClient(): Redis {
    return this.client;
  }

  isReady(): boolean {
    return this.isConnected;
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }

  // 缓存操作
  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.client.setex(key, ttl, value);
    }
    return this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  // 队列操作
  async lpush(key: string, value: string): Promise<number> {
    return this.client.lpush(key, value);
  }

  async rpop(key: string): Promise<string | null> {
    return this.client.rpop(key);
  }

  async llen(key: string): Promise<number> {
    return this.client.llen(key);
  }
}

// 单例模式
let redisService: RedisService;

export function getRedisService(): RedisService {
  if (!redisService) {
    redisService = new RedisService();
  }
  return redisService;
}

export default RedisService;