"use client";

import React from "react";
import { cn } from "@shared/utils";
import { TopHeader } from "./top-header";

interface MainLayoutProps {
  children: React.ReactNode;
  onMenuToggle: () => void;
  showMenuButton: boolean;
  sidebarOpen: boolean;
  theme?: 'console' | 'admin';
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  onMenuToggle,
  showMenuButton,
  sidebarOpen,
  theme = 'console',
  className
}) => {
  return (
    <div className={cn(
      "flex-1 min-w-0 flex flex-col",
      "bg-background",
      className
    )}>
      {/* 顶部标题栏 */}
      <TopHeader 
        onMenuToggle={onMenuToggle}
        showMenuButton={showMenuButton}
        sidebarOpen={sidebarOpen}
        theme={theme}
      />
      
      {/* 页面内容容器 */}
      <div className={cn(
        "flex-1 min-h-0 overflow-y-auto",
        theme === 'admin' 
          ? "p-6" 
          : "p-4 md:p-6"
      )}>
        {children}
      </div>
    </div>
  );
};