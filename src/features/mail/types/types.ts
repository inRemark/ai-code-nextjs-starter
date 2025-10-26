/**
 * 邮件服务相关的 TypeScript 类型定义
 */

import { TaskPriority } from '@prisma/client';

// 基础邮件接口
export interface EmailData {
  to: string;
  subject: string;
  content: string;
  textContent?: string;
}

// 模板邮件接口
export interface TemplateEmailData {
  to: string;
  templateId: string;
  variables?: Record<string, any>;
}

// 邮件发送选项
export interface EmailSendOptions {
  priority?: TaskPriority;
  scheduledAt?: Date;
  templateId?: string;
  variables?: Record<string, any>;
}

// 批量邮件发送选项
export interface BatchEmailOptions extends EmailSendOptions {
  batchId?: string;
  delayBetweenEmails?: number; // 邮件之间的延迟（毫秒）
}

// 邮件发送结果
export interface EmailSendResult {
  success: boolean;
  taskId?: string;
  message: string;
  error?: string;
}

// 批量发送结果
export interface BatchEmailResult {
  success: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
  taskIds: string[];
  errors: Array<{ email: string; error: string }>;
}

// 队列统计信息
export interface EmailQueueStats {
  total: number;
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  queueStatus: 'running' | 'paused' | 'stopped';
}

// 队列任务项
export interface EmailTaskItem {
  id: string;
  to: string;
  subject: string;
  priority: TaskPriority;
  status: 'PENDING' | 'PROCESSING' | 'SENT' | 'FAILED';
  createdAt: Date;
  processedAt?: Date;
  error?: string;
  retryCount: number;
  maxRetries: number;
  templateId?: string;
  scheduledAt?: Date;
}

// 队列控制结果
export interface QueueControlResult {
  success: boolean;
  message: string;
  data?: any;
}

// 队列状态信息
export interface QueueStatusInfo {
  isProcessing: boolean;
  queueStatus: 'running' | 'paused' | 'stopped';
  stats: EmailQueueStats;
}

// 队列健康状态
export interface QueueHealthInfo {
  healthy: boolean;
  issues: string[];
  recommendations: string[];
}

// 队列性能指标
export interface QueueMetrics {
  avgProcessingTime?: number;
  throughput: number; // 每分钟处理的任务数
  errorRate: number; // 错误率
  queueDepth: number; // 队列深度
}

// 邮件模板接口
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables?: Record<string, any>;
}

// 邮件发送历史
export interface EmailSendHistory {
  id: string;
  to: string;
  subject: string;
  status: 'PENDING' | 'PROCESSING' | 'SENT' | 'FAILED';
  createdAt: Date;
  sentAt?: Date;
  error?: string;
  attempts: number;
}

// 邮件发送配置
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
}

// 队列配置
export interface QueueConfig {
  maxConcurrency: number;
  retryAttempts: number;
  retryDelay: number;
  processInterval: number;
}

// 邮件服务事件类型
export type EmailServiceEvent = 
  | 'task_created'
  | 'task_processing'
  | 'task_sent'
  | 'task_failed'
  | 'queue_started'
  | 'queue_paused'
  | 'queue_stopped';

// 邮件服务事件数据
export interface EmailServiceEventData {
  event: EmailServiceEvent;
  taskId?: string;
  timestamp: Date;
  data?: any;
}

// 邮件服务事件监听器
export type EmailServiceEventListener = (data: EmailServiceEventData) => void;

// 常用邮件类型枚举
export enum EmailType {
  WELCOME = 'welcome',
  VERIFICATION = 'verification',
  PASSWORD_RESET = 'password_reset',
  NOTIFICATION = 'notification',
  INVITATION = 'invitation',
  REMINDER = 'reminder',
  MARKETING = 'marketing',
  SYSTEM = 'system'
}

// 邮件优先级枚举（与 Prisma 的 TaskPriority 对应）
export enum EmailPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH'
}

// 邮件状态枚举（与 Prisma 的 EmailTaskStatus 对应）
export enum EmailTaskStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  FAILED = 'FAILED'
}
