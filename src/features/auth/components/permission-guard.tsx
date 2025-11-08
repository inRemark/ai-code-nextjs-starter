'use client';

import { usePermission } from '@features/auth/hooks/auth.hooks';
import { Permission } from '@features/auth/services/rbac.service';

interface PermissionGuardProps {
  readonly children: React.ReactNode;
  readonly permission: Permission;
  readonly fallback?: React.ReactNode;
}

export default function PermissionGuard({ 
  children, 
  permission,
  fallback = null
}: PermissionGuardProps) {
  const { hasPerm, loading } = usePermission(permission);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!hasPerm) {
    return fallback;
  }

  return children;
}