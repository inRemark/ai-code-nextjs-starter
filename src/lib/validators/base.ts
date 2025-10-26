import { z } from 'zod';

/**
 * 基础验证模式
 * 包含清理和验证功能，供各功能模块复用
 */

// 基础验证模式
export const baseSchemas = {
  // 验证文本
  text: z.string()
    .trim()
    .min(1, '文本不能为空')
    .max(1000, '文本长度不能超过1000字符'),
  
  // 验证长文本
  longText: z.string()
    .trim()
    .min(1, '内容不能为空')
    .max(10000, '内容长度不能超过10000字符'),
  
  // 验证可选文本
  optionalText: z.string()
    .trim()
    .max(1000, '文本长度不能超过1000字符')
    .optional(),
  
  // 验证邮箱
  email: z.string()
    .trim()
    .toLowerCase()
    .email('请输入有效的邮箱地址')
    .max(255, '邮箱长度不能超过255字符'),
  
  // 验证URL
  url: z.string()
    .trim()
    .url('请输入有效的URL')
    .max(500, 'URL长度不能超过500字符')
    .optional()
    .or(z.literal('')),
  
  // 验证搜索查询
  searchQuery: z.string()
    .trim()
    .max(100, '搜索查询长度不能超过100字符')
    .optional(),
  
  // 验证密码
  password: z.string()
    .min(8, '密码长度至少8位')
    .max(128, '密码长度不能超过128位')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  
  // 验证确认密码
  confirmPassword: z.string(),
  
  // 验证标签数组
  tags: z.array(
    z.string()
      .trim()
      .min(1, '标签不能为空')
      .max(50, '标签长度不能超过50字符')
  ).max(20, '标签数量不能超过20个').optional(),
  
  // 验证分页参数
  pagination: z.object({
    page: z.coerce.number().int().min(1, '页码必须大于0').default(1),
    limit: z.coerce.number().int().min(1, '每页数量必须大于0').max(100, '每页数量不能超过100').default(20),
  }),
  
  // 验证排序参数
  sorting: z.object({
    sortBy: z.string().max(50, '排序字段名长度不能超过50字符').optional(),
    sortOrder: z.enum(['asc', 'desc'], { message: '排序顺序必须是asc或desc' }).default('desc'),
  }),
};

// 通用验证辅助函数
export const validationHelpers = {
  // 验证ID格式
  validateId: (id: string): boolean => {
    return z.string().cuid().safeParse(id).success;
  },
  
  // 验证邮箱格式
  validateEmail: (email: string): boolean => {
    return z.string().email().safeParse(email).success;
  },
  
  // 验证URL格式
  validateUrl: (url: string): boolean => {
    return z.string().url().safeParse(url).success;
  },
  
  // 验证密码强度
  validatePasswordStrength: (password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } => {
    const feedback: string[] = [];
    let score = 0;
    
    if (password.length >= 8) score += 1;
    else feedback.push('密码长度至少8位');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('密码应包含小写字母');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('密码应包含大写字母');
    
    if (/\d/.test(password)) score += 1;
    else feedback.push('密码应包含数字');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('密码应包含特殊字符');
    
    return {
      isValid: score >= 3,
      score,
      feedback,
    };
  },
  
  // 验证文件大小
  validateFileSize: (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },
  
  // 验证文件类型
  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },
};

// 错误消息国际化
export const validationMessages = {
  required: '此字段为必填项',
  invalid: '输入格式不正确',
  tooShort: (min: number) => `长度至少需要${min}个字符`,
  tooLong: (max: number) => `长度不能超过${max}个字符`,
  invalidEmail: '请输入有效的邮箱地址',
  invalidUrl: '请输入有效的URL',
  passwordMismatch: '确认密码与密码不匹配',
  invalidFileType: '不支持的文件类型',
  fileTooLarge: '文件大小超过限制',
  invalidRating: '评分必须在1-5之间',
  tooManyItems: (max: number) => `最多只能选择${max}个项目`,
  tooFewItems: (min: number) => `至少需要选择${min}个项目`,
};
