"use client";

import React, { useState, useCallback } from "react";
import { useBreakpointContext } from "@shared/theme/breakpoint-provider";
import { cn } from "@shared/utils";
import { TooltipProvider } from "@shared/ui/tooltip";
import { Sidebar } from "./sidebar";
import { MainLayout } from "./main-layout";
import { ConfigurableSidebarContent } from "@shared/layout/configurable-sidebar-content";
import { LayoutConfig } from "./layout-config";

interface UnifiedLayoutProps {
  children: React.ReactNode;
  config: LayoutConfig;
  className?: string;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ 
  children, 
  config,
  className 
}) => {
  const { isMobile, isDesktop } = useBreakpointContext();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarCollapse = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  }, []);

  // 在桌面端，如果侧边栏关闭，则自动设置为折叠模式
  const effectiveCollapsed = isDesktop ? (sidebarOpen ? sidebarCollapsed : true) : false;

  return (
    <TooltipProvider>
      <div className={cn("h-screen w-full flex overflow-hidden", config.className, className)}>
        {/* 侧边栏 */}
        <Sidebar 
          isOpen={sidebarOpen}
          collapsed={effectiveCollapsed}
          onToggle={handleSidebarToggle}
          onCollapse={handleSidebarCollapse}
          isMobile={isMobile}
        >
          <ConfigurableSidebarContent
            collapsed={effectiveCollapsed}
            onCollapse={handleSidebarCollapse}
            isMobile={isMobile}
            config={config}
          />
        </Sidebar>
        
        {/* 主内容区域 */}
        <MainLayout 
          onMenuToggle={handleSidebarToggle}
          showMenuButton={isMobile}
          sidebarOpen={sidebarOpen}
          theme={config.theme}
        >
          {children}
        </MainLayout>
      </div>
    </TooltipProvider>
  );
};
