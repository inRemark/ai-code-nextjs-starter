"use client";

import React from "react";
import { cn } from "@shared/utils";

interface SidebarProps {
  isOpen: boolean;
  collapsed: boolean;
  onToggle: (open: boolean) => void;
  onCollapse: (collapsed: boolean) => void;
  isMobile: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  collapsed,
  onToggle,
  onCollapse,
  isMobile,
  children,
  className
}) => {
  return (
    <>
      {/* 移动端遮罩 */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => onToggle(false)}
        />
      )}
      
      {/* 侧边栏主体 */}
      <div className={cn(
        "fixed lg:relative z-50 h-full flex-shrink-0",
        "bg-background border-r border-border",
        "transition-all duration-300 ease-in-out",
        // 移动端响应式
        isMobile && [
          "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full"
        ],
        // 桌面端响应式
        !isMobile && [
          collapsed ? "w-16" : "w-64",
          "translate-x-0"
        ],
        className
      )}>
        {children}
      </div>
    </>
  );
};