import React, { Suspense } from 'react';
import { PortalLayout } from '@shared/layout/portal-layout';
import { PageContent } from '@/shared/layout/portal-page-content';
import { HelpPageClient } from '@/features/help';

export default async function HelpPage() {
  return (
    <PortalLayout 
      title="帮助中心" 
      description="寻找答案、学习教程和获取支持"
    >
      <PageContent maxWidth="xl">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">加载中...</p>
            </div>
          </div>
        }>
          <HelpPageClient />
        </Suspense>
      </PageContent>
    </PortalLayout>
  );
}