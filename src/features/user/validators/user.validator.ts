/**
 * User Feature - Validators
 * 
 * Zod schemas for user data validation
 */

import { z } from 'zod';

// ============================================
// 用户资料验证
// ============================================

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional().or(z.literal('')),
  company: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  title: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  timezone: z.string().optional(),
  language: z.string().min(2).max(10).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

// ============================================
// 用户设置验证
// ============================================

export const updateUserSettingsSchema = z.object({
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'team']).optional(),
    showEmail: z.boolean().optional(),
    showPhone: z.boolean().optional(),
    showLastSeen: z.boolean().optional(),
  }).optional(),
  
  notifications: z.object({
    email: z.object({
      enabled: z.boolean().optional(),
      emailSent: z.boolean().optional(),
      emailDelivered: z.boolean().optional(),
      emailOpened: z.boolean().optional(),
      systemUpdates: z.boolean().optional(),
      securityAlerts: z.boolean().optional(),
      weeklyReport: z.boolean().optional(),
    }).optional(),
    browser: z.object({
      enabled: z.boolean().optional(),
      emailSent: z.boolean().optional(),
      emailDelivered: z.boolean().optional(),
      emailOpened: z.boolean().optional(),
      systemUpdates: z.boolean().optional(),
      securityAlerts: z.boolean().optional(),
      weeklyReport: z.boolean().optional(),
    }).optional(),
    mobile: z.object({
      enabled: z.boolean().optional(),
      emailSent: z.boolean().optional(),
      emailDelivered: z.boolean().optional(),
      emailOpened: z.boolean().optional(),
      systemUpdates: z.boolean().optional(),
      securityAlerts: z.boolean().optional(),
      weeklyReport: z.boolean().optional(),
    }).optional(),
  }).optional(),
  
  workflow: z.object({
    defaultEmailTemplate: z.string().optional(),
    autoSaveInterval: z.number().int().min(10).max(300).optional(),
    defaultSendDelay: z.number().int().min(0).max(3600).optional(),
  }).optional(),
});

// ============================================
// 活动查询验证
// ============================================

export const activityQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  activityType: z.array(z.string()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// ============================================
// OAuth 连接验证
// ============================================

export const connectOAuthSchema = z.object({
  provider: z.enum(['google', 'github', 'wechat']),
  code: z.string().min(1),
  redirectUri: z.string().url(),
});

export const disconnectOAuthSchema = z.object({
  accountId: z.string().min(1),
});

// ============================================
// 头像上传验证
// ============================================

export const avatarUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'File size must be less than 5MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'File must be JPEG, PNG, or WebP'
  ),
});
