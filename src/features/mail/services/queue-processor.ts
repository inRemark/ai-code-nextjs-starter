/**
 * 邮件队列定时处理器
 * 自动处理队列中的邮件任务
 */

import { getQueueService } from './queue-service';
import { logger } from '@logger';

const queueService = getQueueService();

class QueueProcessor {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private processingInterval = 60 * 1000; // 默认60秒处理一次

  /**
   * 启动定时处理
   */
  start(intervalSeconds: number = 60): void {
    if (this.isRunning) {
      logger.warn('队列处理器已经在运行中');
      return;
    }

    this.processingInterval = intervalSeconds * 1000;
    this.isRunning = true;

    if (process.env.NODE_ENV === 'development') {
      logger.info(`启动队列处理器 (间隔: ${intervalSeconds}s)`);
    }

    // 立即执行一次
    this.processQueue();

    // 设置定时器
    this.intervalId = setInterval(() => {
      this.processQueue();
    }, this.processingInterval);
  }

  /**
   * 停止定时处理
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    if (process.env.NODE_ENV === 'development') {
      logger.info('队列处理器已停止');
    }
  }

  /**
   * 处理队列
   */
  private async processQueue(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      const result = await queueService.processQueue(10);
      
      if (result.processed > 0 && process.env.NODE_ENV === 'development') {
        logger.info(
          `处理了 ${result.processed} 封邮件: ${result.succeeded} 成功, ${result.failed} 失败`
        );
      }

      // 清理30天前的旧任务
      if (Math.random() < 0.1) {
        const deleted = await queueService.cleanupOldTasks(30);
        if (deleted > 0 && process.env.NODE_ENV === 'development') {
          logger.info(`清理了 ${deleted} 条旧任务`);
        }
      }
    } catch (error) {
      logger.error('处理队列错误', error);
    }
  }

  /**
   * 获取运行状态
   */
  getStatus(): {
    isRunning: boolean;
    interval: number;
  } {
    return {
      isRunning: this.isRunning,
      interval: this.processingInterval / 1000,
    };
  }

  /**
   * 手动触发处理
   */
  async trigger(): Promise<void> {
    await this.processQueue();
  }
}

let queueProcessor: QueueProcessor;

export function getQueueProcessor(): QueueProcessor {
  if (!queueProcessor) {
    queueProcessor = new QueueProcessor();
  }
  return queueProcessor;
}

export default QueueProcessor;
