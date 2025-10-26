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

// 兼容性：保持原有的函数式验证器
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one letter' };
  }
  
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true, message: 'Password is valid' };
}

export function validateRegisterRequest(email: string, password: string, name?: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Invalid email format');
  }
  
  if (!password) {
    errors.push('Password is required');
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.message);
    }
  }
  
  if (name && name.length > 50) {
    errors.push('Name must be less than 50 characters');
  }
  
  return { isValid: errors.length === 0, errors };
}

export function validateLoginRequest(email: string, password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Invalid email format');
  }
  
  if (!password) {
    errors.push('Password is required');
  }
  
  return { isValid: errors.length === 0, errors };
}
