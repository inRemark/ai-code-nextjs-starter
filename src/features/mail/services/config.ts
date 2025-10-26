/**
 * 邮件服务配置
 */

export const emailConfig = {
  // SMTP 配置
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  
  // 发送者信息
  from: {
    name: process.env.SMTP_FROM_NAME || 'AICoder',
    email: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || '',
  },
  
  // 邮件队列配置
  queue: {
    concurrency: 5,
    retryAttempts: 3,
    retryDelay: 5000,
  },
  
  // 邮件模板配置
  templates: {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    defaultTheme: 'light',
  }
};

export default emailConfig;
