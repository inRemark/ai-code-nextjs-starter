"use client";

import React from "react";
import { cn } from "@shared/utils";
import { MenuGroup as MenuGroupType } from "./console-menu-config";
import { MenuItem } from "./menu-item";
import { Separator } from "@shared/ui/separator";

interface MenuGroupProps {
  group: MenuGroupType;
  collapsed: boolean;
  currentPath: string;
  showSeparator?: boolean;
  theme?: 'console' | 'admin';
  className?: string;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({
  group,
  collapsed,
  currentPath,
  showSeparator = false,
  theme = 'console',
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {/* 分组标题 */}
      {!collapsed && (
        <div className="px-1 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {group.title}
          </h3>
        </div>
      )}

      {/* 菜单项列表 */}
      <div className="space-y-1">
        {group.items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            isActive={currentPath === item.href}
            theme={theme}
          />
        ))}
      </div>

      {/* 分组分隔线 */}
      {showSeparator && !collapsed && (
        <div className="px-1 py-2">
          <Separator className="bg-border/50" />
        </div>
      )}
    </div>
  );
};