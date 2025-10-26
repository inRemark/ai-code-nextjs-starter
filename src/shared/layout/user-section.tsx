"use client";

import React from "react";
import { cn } from "@shared/utils";
import { Button } from "@shared/ui/button";
import { ThemeToggle } from "@shared/ui/theme-toggle";
import { 
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

interface UserSectionProps {
  collapsed: boolean;
  theme?: 'console' | 'admin';
  className?: string;
  showThemeToggle?: boolean;
  showCollapseButton?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const UserSection: React.FC<UserSectionProps> = ({
  collapsed,
  theme = 'console',
  className,
  showThemeToggle = false,
  showCollapseButton = false,
  onCollapse
}) => {


  // 主题切换和折叠按钮
  const controlButtons = (
    <div className="space-y-3">
      {/* 主题切换按钮
      {showThemeToggle && (
        <div className="flex flex-col items-center gap-2">
          {!collapsed && (
            <span className="text-sm font-medium text-muted-foreground">主题</span>
          )}
          <ThemeToggle />
        </div>
      )} */}
      
      {/* 折叠按钮 */}
      {showCollapseButton && onCollapse && (
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-9 h-9",
              "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              "transition-all duration-200"
            )}
            onClick={() => onCollapse(!collapsed)}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </Button>
        </div>
      )}
    </div>
  );

  // 只显示控制按钮
  return (
    <div className={cn(
      "space-y-3",
      collapsed ? "px-2 py-3" : "px-4 py-3",
      className
    )}>
      {controlButtons}
    </div>
  );
};