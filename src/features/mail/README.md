# 邮件服务模块

这是一个简化的邮件发送服务模块，支持立即发送和队列发送两种模式，专门为后端模块提供邮件发送能力。

## 核心特性

- ✅ **单一表设计**：只使用一个 `EmailSendTask` 表存储所有邮件信息
- ✅ **双模式发送**：支持立即发送和队列发送
- ✅ **定时任务处理**：自动读取和处理队列中的邮件
- ✅ **重试机制**：失败邮件自动重试
- ✅ **优先级支持**：支持高/普通/低优先级
- ✅ **批量发送**：支持大量邮件的批量处理
- ✅ **模板支持**：支持 HTML 模板和变量替换
- ✅ **队列管理**：完整的队列控制和管理功能

## 快速开始

### 1. 基础使用

```typescript
import { emailServiceAPI } from '@/lib/email';

// 发送简单邮件
const result = await emailServiceAPI.sendEmail(
  'user@example.com',
  '测试邮件',
  '<h1>Hello World</h1>'
);

// 发送模板邮件
const templateResult = await emailServiceAPI.sendTemplateEmail(
  'user@example.com',
  'welcome', // 模板ID
  { name: '张三', company: 'AICoder' } // 模板变量
);
```

### 2. 批量发送

```typescript
import { batchEmailService } from '@/lib/email';

const emails = [
  { to: 'user1@example.com', subject: '测试1', content: '内容1' },
  { to: 'user2@example.com', subject: '测试2', content: '内容2' },
  // ... 更多邮件
];

const result = await batchEmailService.sendBatchEmails(emails, {
  batchSize: 10, // 每批处理10封
  delayBetweenBatches: 1000, // 批次间延迟1秒
  onProgress: (progress) => {
    console.log(`进度: ${progress.percentage}%`);
  }
});
```

### 3. 队列管理

```typescript
import { queueControlService } from '@/lib/email';

// 获取队列状态
const status = await queueControlService.getQueueStatus();

// 启动/暂停/停止队列
await queueControlService.startQueue();
await queueControlService.pauseQueue();
await queueControlService.stopQueue();

// 清空队列
await queueControlService.clearQueue();
```

## API 参考

### EmailServiceAPI

#### sendEmail(to, subject, content, options?)
发送单个邮件

**参数：**
- `to: string` - 收件人邮箱
- `subject: string` - 邮件主题
- `content: string` - 邮件内容（HTML）
- `options: EmailSendOptions` - 发送选项（可选）

**返回：**
```typescript
{
  success: boolean;
  taskId?: string;
  message: string;
  error?: string;
}
```

#### sendTemplateEmail(to, templateId, variables, options?)
发送模板邮件

**参数：**
- `to: string` - 收件人邮箱
- `templateId: string` - 模板ID
- `variables: Record<string, any>` - 模板变量
- `options: EmailSendOptions` - 发送选项（可选）

#### getQueueStats()
获取队列统计信息

**返回：**
```typescript
{
  total: number;
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  queueStatus: 'running' | 'paused' | 'stopped';
}
```

### BatchEmailService

#### sendBatchEmails(emails, config?)
批量发送邮件

**参数：**
- `emails: Array<{to, subject, content, variables?}>` - 邮件列表
- `config: BatchEmailConfig` - 批量发送配置

**返回：**
```typescript
{
  success: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
  taskIds: string[];
  errors: Array<{email, error, batchIndex, emailIndex}>;
  processingTime: number;
  averageTimePerEmail: number;
}
```

### QueueControlService

#### getQueueStatus()
获取队列状态信息

#### startQueue() / pauseQueue() / stopQueue()
启动/暂停/停止队列处理

#### clearQueue()
清空队列中的已完成和失败任务

## 数据库表结构

```sql
-- 邮件发送任务表
CREATE TABLE email_send_tasks (
  id          VARCHAR PRIMARY KEY,
  to          VARCHAR NOT NULL,        -- 收件人邮箱
  subject     VARCHAR NOT NULL,        -- 邮件主题
  content     TEXT NOT NULL,           -- 邮件内容（HTML）
  text_content TEXT,                   -- 纯文本内容
  template_id VARCHAR,                 -- 模板ID（可选）
  variables   JSONB DEFAULT '{}',      -- 模板变量
  priority    TaskPriority DEFAULT 'NORMAL', -- 优先级
  status      EmailTaskStatus DEFAULT 'PENDING', -- 状态
  attempts    INTEGER DEFAULT 0,       -- 尝试次数
  max_attempts INTEGER DEFAULT 3,      -- 最大尝试次数
  scheduled_at TIMESTAMP DEFAULT NOW(), -- 计划发送时间
  sent_at     TIMESTAMP,               -- 实际发送时间
  error       VARCHAR,                 -- 错误信息
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

## 配置选项

### 邮件配置 (src/lib/email/config.ts)
```typescript
export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  from: {
    name: process.env.SMTP_FROM_NAME || 'AICoder',
    email: process.env.SMTP_FROM_EMAIL || 'noreply@AICoder.com'
  }
};
```

### 队列配置 (src/lib/email/queue-config.ts)
```typescript
export const queueConfig = {
  concurrency: parseInt(process.env.EMAIL_QUEUE_CONCURRENCY || '5'),
  processInterval: parseInt(process.env.EMAIL_QUEUE_INTERVAL || '5000'),
  retryAttempts: parseInt(process.env.EMAIL_QUEUE_RETRY_ATTEMPTS || '3'),
  retryDelay: parseInt(process.env.EMAIL_QUEUE_RETRY_DELAY || '60000')
};
```

## 使用场景

### 1. 用户注册欢迎邮件
```typescript
import { emailServiceAPI } from '@/lib/email';

// 用户注册后发送欢迎邮件
await emailServiceAPI.sendTemplateEmail(
  user.email,
  'welcome',
  { name: user.name, loginUrl: 'https://AICoder.com/login' }
);
```

### 2. 密码重置邮件
```typescript
import { emailServiceAPI } from '@/lib/email';

// 发送密码重置邮件
await emailServiceAPI.sendTemplateEmail(
  user.email,
  'password-reset',
  { 
    name: user.name, 
    resetUrl: `https://AICoder.com/reset-password?token=${resetToken}`,
    expiresIn: '24小时'
  }
);
```

### 3. 批量营销邮件
```typescript
import { batchEmailService } from '@/lib/email';

// 批量发送营销邮件
const result = await batchEmailService.sendBatchTemplateEmails(
  userList.map(user => ({
    to: user.email,
    variables: { name: user.name, preferences: user.preferences }
  })),
  'marketing-newsletter',
  {
    batchSize: 50,
    delayBetweenBatches: 2000,
    priority: TaskPriority.LOW
  }
);
```

### 4. 系统通知邮件
```typescript
import { emailServiceAPI } from '@/lib/email';

// 发送系统维护通知
await emailServiceAPI.sendEmail(
  'admin@AICoder.com',
  '系统维护通知',
  '<h1>系统将在今晚进行维护</h1><p>预计维护时间：2小时</p>',
  {
    priority: TaskPriority.HIGH,
    scheduledAt: new Date(Date.now() + 3600000) // 1小时后发送
  }
);
```

## 最佳实践

1. **选择合适的发送模式**
   - 立即发送：适用于验证邮件、重要通知
   - 队列发送：适用于批量邮件、营销邮件

2. **合理设置优先级**
   - 高优先级：验证邮件、安全通知
   - 普通优先级：常规通知、提醒邮件
   - 低优先级：营销邮件、批量通知

3. **批量发送优化**
   - 大量邮件分批处理，避免服务器压力
   - 设置合适的延迟，避免被标记为垃圾邮件
   - 监控发送进度和错误率

4. **错误处理**
   - 实现重试机制
   - 记录失败原因
   - 提供手动重试功能

5. **性能监控**
   - 定期检查队列健康状态
   - 监控发送成功率和处理时间
   - 根据负载调整并发数量

## 故障排除

### 常见问题

1. **邮件发送失败**
   - 检查 SMTP 配置是否正确
   - 验证邮箱地址格式
   - 查看错误日志获取详细信息

2. **队列处理停止**
   - 检查定时服务是否启动
   - 查看数据库连接是否正常
   - 重启队列处理服务

3. **发送速度慢**
   - 调整并发数量
   - 减少批次间延迟
   - 检查网络连接状况

### 调试工具

```typescript
import { getEmailServiceStatus, checkEmailServiceHealth } from '@/lib/email';

// 检查服务状态
const status = getEmailServiceStatus();
console.log('邮件服务状态:', status);

// 健康检查
const health = await checkEmailServiceHealth();
console.log('健康状态:', health);
```
