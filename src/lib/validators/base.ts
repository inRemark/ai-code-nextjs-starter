import { z } from 'zod';

/**
 * 基础验证模式
 * 包含清理和验证功能，供各功能模块复用
 * 
 * @module validators/base
 * @description 提供统一的验证规则和辅助函数，确保前后端验证逻辑一致
 */

/**
 * 验证正则表达式常量
 * 集中管理所有正则表达式，便于维护和复用
 */
const REGEX_PATTERNS = {
  /** 邮箱格式：xxx@xxx.xxx */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** URL格式：http(s)://... */
  url: /^https?:\/\/.+/,
  /** CUID2格式：24-32位小写字母+数字 */
  cuid: /^[a-z0-9]{24,32}$/,
  /** 小写字母 */
  lowercase: /[a-z]/,
  /** 大写字母 */
  uppercase: /[A-Z]/,
  /** 数字 */
  digit: /\d/,
  /** 特殊字符 */
  specialChar: /[!@#$%^&*(),.?":{}|<>]/,
} as const;

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
    .regex(REGEX_PATTERNS.email, '请输入有效的邮箱地址')
    .max(255, '邮箱长度不能超过255字符'),
  
  // 验证URL
  url: z.string()
    .trim()
    .regex(REGEX_PATTERNS.url, '请输入有效的URL')
    .max(500, 'URL长度不能超过500字符')
    .optional()
    .or(z.literal('')),
  
  // 验证搜索查询
  searchQuery: z.string()
    .trim()
    .max(100, '搜索查询长度不能超过100字符')
    .optional(),
  
  // 验证密码 - 与 PasswordStrength 组件规则保持一致
  password: z.string()
    .min(8, '密码长度至少8位')
    .max(128, '密码长度不能超过128位')
    .regex(REGEX_PATTERNS.lowercase, '密码必须包含小写字母')
    .regex(REGEX_PATTERNS.uppercase, '密码必须包含大写字母')
    .regex(REGEX_PATTERNS.digit, '密码必须包含数字')
    .regex(REGEX_PATTERNS.specialChar, '密码必须包含特殊字符'),
  
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
  // 验证ID格式 (CUID2 格式: 24-32个字符，由a-z0-9组成)
  validateId: (id: string): boolean => {
    return REGEX_PATTERNS.cuid.test(id);
  },
  
  // 验证邮箱格式
  validateEmail: (email: string): boolean => {
    return REGEX_PATTERNS.email.test(email);
  },
  
  // 验证URL格式
  validateUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  // 验证密码强度
  validatePasswordStrength: (password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } => {
    const feedback: string[] = [];
    let score = 0;
    
    const checks = [
      { test: password.length >= 8, message: '密码长度至少8位' },
      { test: REGEX_PATTERNS.lowercase.test(password), message: '密码应包含小写字母' },
      { test: REGEX_PATTERNS.uppercase.test(password), message: '密码应包含大写字母' },
      { test: REGEX_PATTERNS.digit.test(password), message: '密码应包含数字' },
      { test: REGEX_PATTERNS.specialChar.test(password), message: '密码应包含特殊字符' },
    ];
    
    for (const check of checks) {
      if (check.test) {
        score += 1;
      } else {
        feedback.push(check.message);
      }
    }
    
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
