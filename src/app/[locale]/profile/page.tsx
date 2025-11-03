"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PortalLayout } from "@shared/layout/portal-layout";
import { ProfileNavTabs, UserInfoSidebar, ProfileContent } from "@features/user";
import ProtectedRoute from "@features/auth/components/protected-route";

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const [currentSection, setCurrentSection] = useState('profile');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setCurrentSection(tab);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：内容区域 */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          {/* 横向菜单导航 - 桌面端 */}
          <div className="hidden lg:block">
            <ProfileNavTabs 
              currentSection={currentSection}
              onSectionChange={setCurrentSection}
            />
          </div>
          
          {/* 页面内容 */}
          <ProfileContent section={currentSection} />
        </div>
        
        {/* 右侧：用户信息区域 */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <UserInfoSidebar />
          
          {/* 横向菜单导航 - 移动端 */}
          <div className="lg:hidden mt-6">
            <ProfileNavTabs 
              currentSection={currentSection}
              onSectionChange={setCurrentSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <PortalLayout>
        <Suspense fallback={
          <div className="container mx-auto px-4 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        }>
          <ProfilePageContent />
        </Suspense>
      </PortalLayout>
    </ProtectedRoute>
  );
}