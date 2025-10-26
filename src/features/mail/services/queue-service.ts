/**
 * 简化邮件队列服务
 * 支持异步发送、重试机制、优先级管理
 */

import prisma from '@/lib/database/prisma';
import { EmailTaskStatus, EmailPriority, Prisma } from '@prisma/client';
import { getEmailService } from './service';
import { templateService, TemplateVariables } from './template-service';
import { logger } from '@logger';
const emailService = getEmailService();

export interface QueueEmailOptions {
  to: string;
  subject: string;
  content: string;
  textContent?: string;
  templateId?: string;
  variables?: TemplateVariables;
  priority?: 'HIGH' | 'NORMAL';
  scheduledAt?: Date;
}

export interface QueueStats {
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  total: number;
}

export interface TaskDetails {
  id: string;
  to: string;
  subject: string;
  status: EmailTaskStatus;
  priority: EmailPriority;
  attempts: number;
  maxAttempts: number;
  scheduledAt: Date;
  sentAt?: Date | null;
  error?: string | null;
  createdAt: Date;
}

class QueueService {
  async addToQueue(options: QueueEmailOptions): Promise<string> {
    try {
      const task = await prisma.emailSendTask.create({
        data: {
          to: options.to,
          subject: options.subject,
          content: options.content,
          textContent: options.textContent,
          templateId: options.templateId,
          variables: (options.variables || {}) as Prisma.InputJsonValue,
          priority: options.priority === 'HIGH' ? EmailPriority.HIGH : EmailPriority.NORMAL,
          status: EmailTaskStatus.PENDING,
          scheduledAt: options.scheduledAt || new Date(),
          attempts: 0,
          maxAttempts: 3,
        },
      });

      return task.id;
    } catch (error) {
      logger.error('Failed to add email to queue:', error);
      throw new Error('Failed to add email to queue');
    }
  }

  async addBatchToQueue(emails: QueueEmailOptions[]): Promise<string[]> {
    const taskIds: string[] = [];

    for (const email of emails) {
      const taskId = await this.addToQueue(email);
      taskIds.push(taskId);
    }

    return taskIds;
  }

  async processQueue(limit: number = 10): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
  }> {
    const now = new Date();
    
    const tasks = await prisma.emailSendTask.findMany({
      where: {
        status: EmailTaskStatus.PENDING,
        scheduledAt: {
          lte: now,
        },
        attempts: {
          lt: prisma.emailSendTask.fields.maxAttempts,
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
      take: limit,
    });

    let succeeded = 0;
    let failed = 0;

    for (const task of tasks) {
      const result = await this.processTask(task.id);
      if (result) {
        succeeded++;
      } else {
        failed++;
      }
    }

    return {
      processed: tasks.length,
      succeeded,
      failed,
    };
  }

  private async processTask(taskId: string): Promise<boolean> {
    try {
      const task = await prisma.emailSendTask.update({
        where: { id: taskId },
        data: {
          status: EmailTaskStatus.PROCESSING,
          attempts: { increment: 1 },
        },
      });

      let htmlContent = task.content;
      let textContent = task.textContent || '';
      let subject = task.subject;

      if (task.templateId) {
        const variables = task.variables as TemplateVariables;
        htmlContent = await templateService.renderTemplate(task.templateId, variables);
        textContent = await templateService.renderTextTemplate(task.templateId, variables);
        subject = await templateService.renderSubject(task.templateId, variables);
      }

      const result = await emailService.sendEmail({
        to: task.to,
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (result.success) {
        await prisma.emailSendTask.update({
          where: { id: taskId },
          data: {
            status: EmailTaskStatus.SENT,
            sentAt: new Date(),
            error: null,
          },
        });
        return true;
      } else {
        await this.handleFailedTask(taskId, result.error || 'Unknown error');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.handleFailedTask(taskId, errorMessage);
      return false;
    }
  }

  private async handleFailedTask(taskId: string, errorMessage: string): Promise<void> {
    const task = await prisma.emailSendTask.findUnique({
      where: { id: taskId },
    });

    if (!task) return;

    if (task.attempts >= task.maxAttempts) {
      await prisma.emailSendTask.update({
        where: { id: taskId },
        data: {
          status: EmailTaskStatus.FAILED,
          error: errorMessage,
        },
      });
    } else {
      await prisma.emailSendTask.update({
        where: { id: taskId },
        data: {
          status: EmailTaskStatus.PENDING,
          error: errorMessage,
        },
      });
    }
  }

  async retryFailedTasks(limit: number = 10): Promise<number> {
    const tasks = await prisma.emailSendTask.findMany({
      where: {
        status: EmailTaskStatus.FAILED,
        attempts: {
          lt: prisma.emailSendTask.fields.maxAttempts,
        },
      },
      take: limit,
    });

    for (const task of tasks) {
      await prisma.emailSendTask.update({
        where: { id: task.id },
        data: {
          status: EmailTaskStatus.PENDING,
          scheduledAt: new Date(),
        },
      });
    }

    return tasks.length;
  }

  async getTaskStatus(taskId: string): Promise<TaskDetails | null> {
    const task = await prisma.emailSendTask.findUnique({
      where: { id: taskId },
    });

    if (!task) return null;

    return {
      id: task.id,
      to: task.to,
      subject: task.subject,
      status: task.status,
      priority: task.priority,
      attempts: task.attempts,
      maxAttempts: task.maxAttempts,
      scheduledAt: task.scheduledAt,
      sentAt: task.sentAt,
      error: task.error,
      createdAt: task.createdAt,
    };
  }

  async getQueueStats(): Promise<QueueStats> {
    const [pending, processing, sent, failed, total] = await Promise.all([
      prisma.emailSendTask.count({ where: { status: EmailTaskStatus.PENDING } }),
      prisma.emailSendTask.count({ where: { status: EmailTaskStatus.PROCESSING } }),
      prisma.emailSendTask.count({ where: { status: EmailTaskStatus.SENT } }),
      prisma.emailSendTask.count({ where: { status: EmailTaskStatus.FAILED } }),
      prisma.emailSendTask.count(),
    ]);

    return { pending, processing, sent, failed, total };
  }

  async getQueueTasks(
    status?: EmailTaskStatus,
    limit: number = 20,
    offset: number = 0
  ): Promise<TaskDetails[]> {
    const tasks = await prisma.emailSendTask.findMany({
      where: status ? { status } : {},
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    });

    return tasks.map(task => ({
      id: task.id,
      to: task.to,
      subject: task.subject,
      status: task.status,
      priority: task.priority,
      attempts: task.attempts,
      maxAttempts: task.maxAttempts,
      scheduledAt: task.scheduledAt,
      sentAt: task.sentAt,
      error: task.error,
      createdAt: task.createdAt,
    }));
  }

  async cleanupOldTasks(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.emailSendTask.deleteMany({
      where: {
        status: EmailTaskStatus.SENT,
        sentAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }

  async deleteTask(taskId: string): Promise<boolean> {
    try {
      await prisma.emailSendTask.delete({
        where: { id: taskId },
      });
      return true;
    } catch {
      return false;
    }
  }
}

let queueService: QueueService;

export function getQueueService(): QueueService {
  if (!queueService) {
    queueService = new QueueService();
  }
  return queueService;
}

export default QueueService;
