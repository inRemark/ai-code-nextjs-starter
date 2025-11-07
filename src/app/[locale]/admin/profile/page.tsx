'use client';

import { AdminLayout } from '@shared/layout/admin-layout';
import { EnhancedPageContainer } from '@/shared/layout/app-page-container';
import { ProfileContent } from '@/features/console-common';
import ProtectedRoute from '@features/auth/components/protected-route';

export default function AdminProfilePage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <EnhancedPageContainer
          title="个人资料"
          description="管理个人信息"
          showSearch={false}
        >
          <ProfileContent
            title="基本信息"
            description="您的个人资料信息"
          />
        </EnhancedPageContainer>
      </AdminLayout>
    </ProtectedRoute>
  );
}
