// 邮件服务相关的类型定义


export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: TemplateVariable[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'url';
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface MailTask {
  id: string;
  recipientList: string[];
  template: EmailTemplate;
  variables: Record<string, any>;
  sendTime: Date;
  priority: 'high' | 'normal' | 'low';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailJob {
  id: string;
  taskId: string;
  recipientEmail: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  attachments?: EmailAttachment[];
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
  size: number;
  cid?: string; // Content-ID for inline attachments
}

export interface EmailStats {
  taskId: string;
  totalEmails: number;
  sentEmails: number;
  deliveredEmails: number;
  openedEmails: number;
  clickedEmails: number;
  bouncedEmails: number;
  failedEmails: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SMTPConfig {
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

export interface BulkEmailRequest {
  templateId: string;
  recipientEmails?: string[];
  variables?: Record<string, any>;
  scheduledAt?: Date;
  priority?: 'high' | 'normal' | 'low';
}

export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  reason?: string;
}

export type EmailStatus = 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type TaskPriority = 'high' | 'normal' | 'low';