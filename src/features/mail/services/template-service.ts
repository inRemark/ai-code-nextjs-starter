/**
 * 简化的邮件模板服务
 * 使用静态 HTML 文件作为模板，支持变量替换
 */

import fs from 'fs';
import path from 'path';

export interface TemplateVariables {
  [key: string]: string | number;
}

export interface TemplateInfo {
  id: string;
  name: string;
  subject: string;
  description: string;
  variables: string[];
}

class TemplateService {
  private templatesDir = path.join(process.cwd(), 'src/lib/email/templates');

  /**
   * 获取所有可用的模板信息
   */
  getAvailableTemplates(): TemplateInfo[] {
    return [
      {
        id: 'referral-invitation',
        name: '推荐邀请',
        subject: '{{referrerName}} 邀请您加入 AICoder',
        description: '邀请好友注册的邮件模板',
        variables: ['referrerName', 'referralCode', 'referralLink']
      },
      {
        id: 'referral-reward',
        name: '推荐奖励',
        subject: '恭喜！您获得了 {{rewardAmount}} 积分奖励',
        description: '推荐奖励通知邮件模板',
        variables: ['userName', 'referredUserName', 'rewardAmount', 'rewardReason', 'availablePoints', 'totalPoints', 'spentPoints', 'totalReferrals', 'successfulReferrals', 'totalRewards', 'conversionRate', 'referralLink', 'dashboardLink']
      },
      {
        id: 'system-notification',
        name: '系统通知',
        subject: 'AICoder 系统通知 - {{title}}',
        description: '系统通知邮件模板',
        variables: ['title', 'content', 'userName']
      },
      {
        id: 'verification',
        name: '邮件验证',
        subject: '{{type}} 您的 AICoder 账户',
        description: '邮箱验证和密码重置邮件模板',
        variables: ['type', 'userName', 'verificationLink', 'expiryTime']
      },
      {
        id: 'share-email',
        name: '分享邮件',
        subject: '{{fromUserName}} 与您分享了：{{title}}',
        description: '分享内容的邮件模板',
        variables: ['fromUserName', 'title', 'description', 'shareUrl']
      },
      {
        id: 'subscription-update',
        name: '订阅更新',
        subject: 'AICoder 更新通知 - {{title}}',
        description: '订阅更新通知邮件模板',
        variables: ['title', 'content', 'version', 'userName']
      }
    ];
  }

  /**
   * 根据模板ID获取模板内容
   */
  async getTemplate(templateId: string): Promise<string> {
    const templatePath = path.join(this.templatesDir, `${templateId}.html`);
    
    try {
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      return templateContent;
    } catch (error) {
      throw new Error(`模板文件不存在: ${templateId}`);
    }
  }

  /**
   * 渲染模板，替换变量
   */
  async renderTemplate(templateId: string, variables: TemplateVariables): Promise<string> {
    const template = await this.getTemplate(templateId);
    
    // 简单的变量替换：{{variableName}} -> value
    let renderedTemplate = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      renderedTemplate = renderedTemplate.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return renderedTemplate;
  }

  /**
   * 生成纯文本版本的邮件内容
   */
  async renderTextTemplate(templateId: string, variables: TemplateVariables): Promise<string> {
    const htmlTemplate = await this.renderTemplate(templateId, variables);
    
    // 简单的 HTML 到文本转换
    let textContent = htmlTemplate
      // 移除 HTML 标签
      .replace(/<[^>]*>/g, '')
      // 替换 HTML 实体
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      // 清理多余的空行
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    return textContent;
  }

  /**
   * 验证模板所需的变量是否完整
   */
  validateTemplateVariables(templateId: string, variables: TemplateVariables): {
    isValid: boolean;
    missingVariables: string[];
    extraVariables: string[];
  } {
    const templateInfo = this.getAvailableTemplates().find(t => t.id === templateId);
    
    if (!templateInfo) {
      return {
        isValid: false,
        missingVariables: [],
        extraVariables: []
      };
    }

    const requiredVariables = templateInfo.variables;
    const providedVariables = Object.keys(variables);
    
    const missingVariables = requiredVariables.filter(v => !providedVariables.includes(v));
    const extraVariables = providedVariables.filter(v => !requiredVariables.includes(v));

    return {
      isValid: missingVariables.length === 0,
      missingVariables,
      extraVariables
    };
  }

  /**
   * 获取模板的主题行，替换变量
   */
  async renderSubject(templateId: string, variables: TemplateVariables): Promise<string> {
    const templateInfo = this.getAvailableTemplates().find(t => t.id === templateId);
    
    if (!templateInfo) {
      throw new Error(`模板不存在: ${templateId}`);
    }

    let subject = templateInfo.subject;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return subject;
  }
}

// 导出单例实例
export const templateService = new TemplateService();
