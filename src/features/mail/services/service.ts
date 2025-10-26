import nodemailer from 'nodemailer';
import { emailConfig } from '@features/mail/services/config';
import { EmailAttachment } from '@features/mail/types/mail';
import { logger } from '@logger';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
      pool: true, // 使用连接池
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 10, // 每秒最多发送10封邮件
    });

    // 验证SMTP配置
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.success('SMTP 服务器连接验证成功');
    } catch (error) {
      logger.error('SMTP 服务器连接失败', error);
    }
  }

  /**
   * 发送单个邮件
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const mailOptions = {
        from: {
          name: emailConfig.from.name,
          address: emailConfig.from.email,
        },
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
          cid: att.cid,
        })),
        replyTo: options.replyTo,
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      logger.error('Failed to send email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 批量发送邮件
   */
  async sendBulkEmails(emails: SendEmailOptions[]): Promise<SendEmailResult[]> {
    const results: SendEmailResult[] = [];

    for (const email of emails) {
      const result = await this.sendEmail(email);
      results.push(result);
      
      // 添加延迟避免触发限流
      await this.delay(100);
    }

    return results;
  }

  /**
   * 验证邮件地址格式
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 清理HTML内容
   */
  sanitizeHtml(html: string): string {
    // 基础的HTML清理，移除潜在的恶意脚本
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\\w+=\"[^\"]*\"/gi, '')
      .replace(/on\\w+='[^']*'/gi, '');
  }

  /**
   * 添加退订链接
   */
  addUnsubscribeLink(html: string, unsubscribeUrl: string): string {
    const unsubscribeHtml = `
      <div style=\"margin-top: 30px; padding: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;\">
        <p>如果您不希望接收此类邮件，请 <a href=\"${unsubscribeUrl}\" style=\"color: #666;\">点击此处退订</a></p>
      </div>
    `;

    // 在</body>标签前插入退订链接
    if (html.includes('</body>')) {
      return html.replace('</body>', unsubscribeHtml + '</body>');
    } else {
      return html + unsubscribeHtml;
    }
  }

  /**
   * 替换邮件模板变量
   */
  replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value || ''));
    });

    return result;
  }

  /**
   * 关闭连接
   */
  async close(): Promise<void> {
    this.transporter.close();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 单例模式
let emailService: EmailService;

export function getEmailService(): EmailService {
  if (!emailService) {
    emailService = new EmailService();
  }
  return emailService;
}

export default EmailService;