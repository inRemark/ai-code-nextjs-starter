/**
 * NextAuth 类型扩展
 * 扩展 NextAuth 的 Session 和 JWT 类型以支持自定义字段
 */

import { UserRole } from '@shared/types/user';

declare module 'next-auth' {
  /**
   * Session 类型扩展
   * 添加用户的完整信息到 session.user
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }

  /**
   * User 类型扩展
   * 定义 authorize 回调返回的用户对象
   */
  interface User {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWT Token 类型扩展
   * 定义 JWT 中存储的用户信息
   */
  interface JWT {
    sub: string;
    email: string;
    name: string;
    role: UserRole;
  }
}
