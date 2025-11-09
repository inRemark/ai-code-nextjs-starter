import { z } from 'zod';
import { baseSchemas } from '@/lib/validators/base';

/**
 * 认证相关验证模式
 */

// 用户注册验证 Schema
export const registerSchema = z.object({
  email: baseSchemas.email,
  password: baseSchemas.password,
  confirmPassword: baseSchemas.confirmPassword,
  name: z.string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, '姓名不能为空').max(100, '姓名长度不能超过100字符'))
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '确认密码与密码不匹配',
  path: ['confirmPassword'],
});

// 用户登录验证 Schema
export const loginSchema = z.object({
  email: baseSchemas.email,
  password: z.string().min(1, '密码不能为空'),
});

// 用户资料更新验证 Schema
export const profileSchema = z.object({
  name: z.string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, '姓名不能为空').max(100, '姓名长度不能超过100字符'))
    .optional(),
  bio: z.string()
    .transform((val) => val.trim())
    .pipe(z.string().max(500, '个人简介长度不能超过500字符'))
    .optional(),
});

// 用户设置验证 Schema
export const settingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  reviewReminders: z.boolean().default(true),
  comparisonUpdates: z.boolean().default(true),
});

// 类型导出
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type SettingsData = z.infer<typeof settingsSchema>;

/**
 * 注意：旧的函数式验证器已废弃
 * 
 * 迁移指南：
 * - validateEmail() → 使用 baseSchemas.email.safeParse()
 * - validatePassword() → 使用 baseSchemas.password.safeParse()
 * - validateRegisterRequest() → 使用 registerSchema.safeParse()
 * - validateLoginRequest() → 使用 loginSchema.safeParse()
 * 
 * 所有验证逻辑统一在 @/lib/validators/base.ts
 */
