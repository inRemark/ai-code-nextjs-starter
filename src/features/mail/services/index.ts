/**
 * 邮件服务模块导出文件
 * 提供统一的邮件服务接口供其他模块使用
 */

import { getEmailService } from './service';
import { templateService } from './template-service';
import { notificationService } from './notification-service';
import { emailConfig } from './config';
import { getQueueService } from './queue-service';
import { getQueueProcessor } from './queue-processor';

// 核心服务
export { 
  getEmailService, 
  templateService, 
  notificationService, 
  emailConfig,
  getQueueService,
  getQueueProcessor
};

// 默认导出
export default {
  getEmailService,
  templateService,
  notificationService,
  emailConfig,
  getQueueService,
  getQueueProcessor
};
