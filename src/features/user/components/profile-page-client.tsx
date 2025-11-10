"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProfileNavTabs, UserInfoSidebar, ProfileContent } from "@features/user";

export function ProfilePageClient() {
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
