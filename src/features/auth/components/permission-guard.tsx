'use client';

import { usePermission } from '@features/auth/hooks/auth.hooks';
import { Permission } from '@features/auth/services/rbac.service';

export default function PermissionGuard({ 
  children, 
  permission,
  fallback = null
}: { 
  children: React.ReactNode; 
  permission: Permission;
  fallback?: React.ReactNode;
}) {
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