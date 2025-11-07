'use client';

import { ConsoleLayout } from '@shared/layout/console-layout';
import { EnhancedPageContainer } from '@/shared/layout/app-page-container';
import { SettingsContent } from '@/features/console-common';
import ProtectedRoute from '@features/auth/components/protected-route';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <ConsoleLayout>
        <EnhancedPageContainer
          title="通知设置"
          description="管理您的通知偏好"
          showSearch={false}
        >
          <SettingsContent
            apiEndpoint="/api/settings"
          />
        </EnhancedPageContainer>
      </ConsoleLayout>
    </ProtectedRoute>
  );
}
