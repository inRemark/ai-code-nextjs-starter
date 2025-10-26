import * as bcrypt from 'bcryptjs';

/**
 * 密码工具函数
 * 现在只保留密码相关的功能，JWT功能已移除
 */

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
