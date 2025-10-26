/**
 * 共享验证器统一导出
 */

// 基础验证模式
export * from './base';

// 通用验证函数
export const commonValidators = {
  // 验证ID格式
  validateId: (id: string): boolean => {
    return /^c[a-z0-9]{24}$/.test(id);
  },
  
  // 验证邮箱格式
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
