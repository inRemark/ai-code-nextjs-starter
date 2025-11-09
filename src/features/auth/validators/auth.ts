import { z } from 'zod';
import { baseSchemas } from '@/lib/validators/base';

/**
 * 认证相关验证模式
 */

// 用户注册验证 Schema（前端使用，包含 confirmPassword）
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

// API 注册验证 Schema（后端使用，不需要 confirmPassword）
export const registerApiSchema = z.object({
  email: baseSchemas.email,
  password: baseSchemas.password,
  name: z.string()
    .transform((val) => val.trim())
    .optional()
    .refine((val) => !val || val.length <= 100, '姓名长度不能超过100字符'),
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
export type RegisterApiData = z.infer<typeof registerApiSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type SettingsData = z.infer<typeof settingsSchema>;