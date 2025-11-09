/**
 * 认证系统统一导出
 * 提供 NextAuth 认证接口
 */

// NextAuth相关
export { authConfig, auth, signIn, signOut } from './auth.config';

// 统一认证中间件（推荐使用）
export {
  requireAuth,
  requireAdmin,
  requireRole,
  withNextAuth,
  getCurrentSession,
  getAuthUserFromRequest,
} from '../middleware/auth.middleware';

// 密码工具函数
export {
  hashPassword,
  verifyPassword
} from './auth.service';

// RBAC权限系统
export {
  hasPermission,
  hasRole
} from './rbac.service';

// 认证类型和错误
export { AuthError } from '../types/auth.error';
export type { MeResponse } from '../types/auth.types';