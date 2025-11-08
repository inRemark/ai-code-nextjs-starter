import { User, UserRole } from '@prisma/client';
import prisma from '@/lib/database/prisma';
import { PermissionError } from '../types/auth.error';

// 权限类型定义
export type Permission = 
  | 'read:customer'
  | 'write:customer'
  | 'delete:customer'
  | 'read:template'
  | 'write:template'
  | 'delete:template'
  | 'read:mail'
  | 'write:mail'
  | 'delete:mail'
  | 'read:user'
  | 'write:user'
  | 'delete:user'
  | 'read:report'
  | 'write:report'
  | 'read:settings'
  | 'write:settings';

// 检查用户是否有特定权限
export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return false;
  }

  // 使用工具函数检查角色是否具有权限
  return roleHasPermission(user.role, permission);
}

// 验证用户权限
export async function checkPermission(userId: string, permission: Permission): Promise<void> {
  const hasPerm = await hasPermission(userId, permission);
  
  if (!hasPerm) {
    throw new PermissionError(
      `User does not have permission: ${permission}`,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
}

// 检查用户是否具有角色
export function hasRole(user: User, role: UserRole): boolean {
  return user.role === role;
}

// 检查用户是否为管理员
export function isAdmin(user: User): boolean {
  return user.role === UserRole.ADMIN;
}

// 检查用户是否为普通用户
export function isUser(user: User): boolean {
  return user.role === UserRole.USER;
}

// 检查用户是否为超级管理员（与管理员相同，在需要时可以扩展）
export function isSuperAdmin(user: User): boolean {
  return user.role === UserRole.ADMIN;
}

// 检查用户是否为编辑者
export function isEditor(user: User): boolean {
  return user.role === UserRole.EDITOR;
}

// 检查用户是否可以管理内容（编辑者或管理员）
export function canManageContent(user: User): boolean {
  return user.role === UserRole.EDITOR || user.role === UserRole.ADMIN;
}

// ============================================
// 角色权限映射（从 auth.utils.ts 整合）
// ============================================

// 角色权限映射
export const rolePermissions: Record<UserRole, Permission[]> = {
  USER: [
    'read:customer',
    'write:customer',
    'read:template',
    'write:template',
    'read:mail',
    'write:mail',
    'read:report',
  ],
  EDITOR: [
    'read:customer',
    'write:customer',
    'read:template',
    'write:template',
    'delete:template',
    'read:mail',
    'write:mail',
    'read:report',
    'write:report',
  ],
  ADMIN: [
    'read:customer',
    'write:customer',
    'delete:customer',
    'read:template',
    'write:template',
    'delete:template',
    'read:mail',
    'write:mail',
    'delete:mail',
    'read:user',
    'write:user',
    'delete:user',
    'read:report',
    'write:report',
    'read:settings',
    'write:settings',
  ],
};

// 检查角色是否具有特定权限
export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
}

// 获取角色的所有权限
export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] || [];
}

// 获取所有角色
export function getAllRoles(): UserRole[] {
  return Object.values(UserRole);
}

// 获取角色描述
export function getRoleDescription(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrator with full access to all system features';
    case UserRole.EDITOR:
      return 'Editor with access to content management features';
    case UserRole.USER:
      return 'Standard user with access to basic features';
    default:
      return 'Unknown role';
  }
}

// ============================================
// 统一的权限服务
// ============================================

export const rbac = {
  // 权限检查
  hasPermission,
  roleHasPermission,
  canManageContent,
  
  // 角色管理
  getRolePermissions,
  getAllRoles,
  getRoleDescription,
  isAdmin,
  isEditor,
  
  // 权限验证
  requirePermission: async (userId: string, permission: Permission) => {
    const hasAccess = await hasPermission(userId, permission);
    if (!hasAccess) {
      throw new PermissionError(`Permission denied: ${permission}`, 'PERMISSION_DENIED');
    }
    return true;
  }
};