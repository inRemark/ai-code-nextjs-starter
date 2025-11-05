"use client";

import React from "react";
import { cn } from "@shared/utils";
import { TopHeader } from "./app-header";
import { HeaderConfig } from "./app-layout-config";

interface MainLayoutProps {
  children: React.ReactNode;
  onMenuToggle: () => void;
  showMenuButton: boolean;
  sidebarOpen: boolean;
  // theme?: 'console' | 'admin';
  headerConfig?: HeaderConfig;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  onMenuToggle,
  showMenuButton,
  sidebarOpen,
  // theme = 'console',
  headerConfig,
  className
}) => {
  return (
    <div className={cn(
      "flex-1 min-w-0 flex flex-col",
      "bg-background",
      className
    )}>
      
      <TopHeader 
        onMenuToggle={onMenuToggle}
        showMenuButton={showMenuButton}
        sidebarOpen={sidebarOpen}
        headerConfig={headerConfig}
      />
      
      <div className={cn(
        "flex-1 min-h-0 overflow-y-auto"
      )}>
        {children}
      </div>
    </div>
  );
};