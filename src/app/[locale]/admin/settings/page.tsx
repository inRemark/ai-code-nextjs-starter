'use client';
import ProtectedRoute from '@/features/auth/components/protected-route';
import { SettingsContent } from '@/features/console-common';
import { AdminLayout, EnhancedPageContainer } from '@/shared/layout';


export default function AdminSettingsPage() {
    return (
        <ProtectedRoute>
            <AdminLayout>
                <EnhancedPageContainer
                    title="通知设置"
                    description="管理系统通知偏好"
                    showSearch={false}
                >
                    <SettingsContent
                        apiEndpoint="/api/settings" />
                </EnhancedPageContainer>
            </AdminLayout>
        </ProtectedRoute>
    );
}
