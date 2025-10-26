/**
 * 简化的通知服务
 * 用于发送系统通知、推荐邀请、分享邮件等基础功能
 */

import { getEmailService } from './service';
import { templateService } from './template-service';

export interface NotificationData {
  type: 'system' | 'referral' | 'reward' | 'share' | 'verification' | 'subscription';
  title: string;
  content: string;
  recipientName?: string;
  variables?: Record<string, any>;
}

export interface ShareData {
  title: string;
  description: string;
  url: string;
  fromUserName: string;
}

export interface UpdateData {
  title: string;
  content: string;
  version?: string;
}

export class NotificationService {
  private emailService = getEmailService();

  /**
   * 发送系统通知
   */
  async sendSystemNotification(to: string, data: NotificationData): Promise<void> {
    const subject = await templateService.renderSubject('system-notification', {
      title: data.title,
      userName: data.variables?.userName || ''
    });

    const htmlContent = await templateService.renderTemplate('system-notification', {
      title: data.title,
      content: data.content,
      userName: data.variables?.userName || '',
      actionUrl: data.variables?.actionUrl || process.env.NEXT_PUBLIC_APP_URL || ''
    });

    const textContent = await templateService.renderTextTemplate('system-notification', {
      title: data.title,
      content: data.content,
      userName: data.variables?.userName || '',
      actionUrl: data.variables?.actionUrl || process.env.NEXT_PUBLIC_APP_URL || ''
    });

    await this.emailService.sendEmail({
      to,
      subject,
      html: htmlContent,
      text: textContent
    });
  }

  /**
   * 发送推荐邀请
   */
  async sendReferralInvitation(to: string, referralCode: string, inviterName?: string): Promise<void> {
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/referral/${referralCode}`;
    
    const subject = await templateService.renderSubject('referral-invitation', {
      referrerName: inviterName || '朋友'
    });

    const htmlContent = await templateService.renderTemplate('referral-invitation', {
      referrerName: inviterName || '朋友',
      referralCode,
      referralLink
    });

    const textContent = await templateService.renderTextTemplate('referral-invitation', {
      referrerName: inviterName || '朋友',
      referralCode,
      referralLink
    });

    await this.emailService.sendEmail({
      to,
      subject,
      html: htmlContent,
      text: textContent
    });
  }

  /**
   * 发送推荐奖励通知
   */
  async sendReferralReward(to: string, points: number, referrerName?: string): Promise<void> {
    const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL}/profile`;
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/profile`;
    
    const subject = await templateService.renderSubject('referral-reward', {
      rewardAmount: points
    });

    const htmlContent = await templateService.renderTemplate('referral-reward', {
      userName: referrerName || '',
      referredUserName: '您的好友',
      rewardAmount: points,
      rewardReason: '推荐好友成功注册',
      availablePoints: points,
      totalPoints: points,
      spentPoints: 0,
      totalReferrals: 1,
      successfulReferrals: 1,
      totalRewards: points,
      conversionRate: 100,
      referralLink,
      dashboardLink
    });

    const textContent = await templateService.renderTextTemplate('referral-reward', {
      userName: referrerName || '',
      referredUserName: '您的好友',
      rewardAmount: points,
      rewardReason: '推荐好友成功注册',
      availablePoints: points,
      totalPoints: points,
      spentPoints: 0,
      totalReferrals: 1,
      successfulReferrals: 1,
      totalRewards: points,
      conversionRate: 100,
      referralLink,
      dashboardLink
    });

    await this.emailService.sendEmail({
      to,
      subject,
      html: htmlContent,
      text: textContent
    });
  }

  /**
   * 发送分享邮件
   */
  async sendShareEmail(to: string, shareData: ShareData): Promise<void> {
    const subject = await templateService.renderSubject('share-email', {
      fromUserName: shareData.fromUserName,
      title: shareData.title
    });

    const htmlContent = await templateService.renderTemplate('share-email', {
      fromUserName: shareData.fromUserName,
      title: shareData.title,
      description: shareData.description,
      shareUrl: shareData.url
    });

    const textContent = await templateService.renderTextTemplate('share-email', {
      fromUserName: shareData.fromUserName,
      title: shareData.title,
      description: shareData.description,
      shareUrl: shareData.url
    });

    await this.emailService.sendEmail({
      to,
      subject,
      html: htmlContent,
      text: textContent
    });
  }

  /**
   * 发送验证邮件
   */
  async sendVerificationEmail(to: string, token: string, type: 'register' | 'reset' = 'register'): Promise<void> {
    const isRegister = type === 'register';
    const typeText = isRegister ? '验证' : '重置';
    const actionUrl = isRegister 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const subject = await templateService.renderSubject('verification', {
      type: typeText
    });

    const htmlContent = await templateService.renderTemplate('verification', {
      type: typeText,
      userName: '',
      verificationLink: actionUrl,
      expiryTime: '24小时'
    });

    const textContent = await templateService.renderTextTemplate('verification', {
      type: typeText,
      userName: '',
      verificationLink: actionUrl,
      expiryTime: '24小时'
    });

    await this.emailService.sendEmail({
      to,
      subject,
      html: htmlContent,
      text: textContent
    });
  }

  /**
   * 发送订阅更新
   */
  async sendSubscriptionUpdate(to: string, updateData: UpdateData): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const helpUrl = `${appUrl}/help`;
    const feedbackUrl = `${appUrl}/help#feedback`;

    const subject = await templateService.renderSubject('subscription-update', {
      title: updateData.title
    });

    const htmlContent = await templateService.renderTemplate('subscription-update', {
      title: updateData.title,
      content: updateData.content,
      version: updateData.version || '1.0.0',
      userName: '',
      appUrl,
      helpUrl,
      feedbackUrl
    });

    const textContent = await templateService.renderTextTemplate('subscription-update', {
      title: updateData.title,
      content: updateData.content,
      version: updateData.version || '1.0.0',
      userName: '',
      appUrl,
      helpUrl,
      feedbackUrl
    });

    await this.emailService.sendEmail({
      to,
      subject,
      html: htmlContent,
      text: textContent
    });
  }
}

// 导出单例实例
export const notificationService = new NotificationService();
