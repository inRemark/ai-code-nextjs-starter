/**
 * 认证系统统一导出
 * 提供 NextAuth 认证接口
 */

// NextAuth相关
export { authConfig } from './next-auth.config';

// 统一认证中间件（推荐使用）
export {
  requireAuth,
  requireAdmin,
  requireRole,
  withNextAuth,
  getCurrentSession,
  getAuthUserFromRequest,
  auth,
  type AuthenticatedUser,
  type AuthenticatedRequest
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

// 认证Hooks（前端）
export {
  useAuth,
  usePermission
} from '../hooks/auth.hooks';

/**
 * 使用指南：
 * 
 * 1. API路由认证：
 *    - 使用 requireAuth() 包装handler进行基础认证
 *    - 使用 requireRole(['ADMIN', 'EDITOR']) 进行角色认证
 * 
 * 2. Web端认证：
 *    - 使用 useSession() 获取NextAuth session
 *    - 使用 signIn/signOut 进行登录登出
 * 
 * 3. OAuth功能：
 *    - 通过NextAuth处理OAuth登录流程（Google, GitHub）
 *    - 自动关联OAuth账户到用户
 */
