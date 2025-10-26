/**
 * 认证系统统一导出
 * 提供统一的认证接口，支持NextAuth Session和Database Session Token双模式认证
 */

// NextAuth相关
export { authConfig } from './next-auth.config';
export { oauthAccountService } from './oauth.service';

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
} from './auth.middleware';

// Session Token工具函数
export {
  generateSessionToken,
  createSession,
  validateSessionToken,
  deleteSession,
  deleteUserSessions,
  cleanupExpiredSessions,
  getUserSessions,
  refreshSessionToken,
  extractDeviceInfo,
  type DeviceInfo,
  type SessionData
} from '@features/auth/services/session-token';

// 密码工具函数（仍需要）
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
export { AuthError } from './auth.error';
export type { MeResponse } from './auth.types';

// 认证Hooks（前端）
export {
  useAuth,
  usePermission
} from './auth.hooks';

/**
 * 使用建议：
 * 
 * 1. API开发：
 *    - 使用 requireAuth() 中间件进行基础认证
 *    - 使用 requireAdmin() 中间件进行管理员认证
 *    - 使用 requireRole(['ADMIN', 'EDITOR']) 进行角色认证
 *    - 自动支持Web端（NextAuth Session）和Mobile端（Session Token）
 * 
 * 2. Web端认证：
 *    - 使用 useSession() 获取NextAuth session
 *    - 使用 UnifiedAuthProvider 统一认证状态
 * 
 * 3. Mobile端认证：
 *    - 使用 /api/auth/mobile/* 端点进行认证
 *    - 在请求头中携带 Authorization: Bearer <sessionToken>
 * 
 * 4. OAuth功能：
 *    - 使用 oauthAccountService 管理OAuth账户
 *    - 通过NextAuth处理OAuth登录流程
 * 
 * 5. Session管理：
 *    - 使用 session-token.ts 中的工具函数
 *    - 支持多设备session管理
 *    - 自动清理过期session
 */
