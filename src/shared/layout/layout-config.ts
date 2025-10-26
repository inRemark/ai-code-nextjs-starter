import { LucideIcon, Settings, Search } from "lucide-react";
import { consoleMenuConfig } from "./console-menu-config";
import { adminMenuConfig } from "./admin-menu-config";

export interface LayoutBrand {
  name: string;
  icon: LucideIcon;
  description: string;
  href?: string;
}

export interface LayoutHeader {
  showTitle?: boolean;
  showBreadcrumb?: boolean;
  customActions?: React.ReactNode;
}

export interface LayoutConfig {
  brand: LayoutBrand;
  theme: 'console' | 'admin';
  menuConfig: typeof consoleMenuConfig;
  header?: LayoutHeader;
  className?: string;
}

// console 布局配置
export const consoleLayoutConfig: LayoutConfig = {
  brand: {
    name: "AICoder",
    icon: Search,
    description: "企业控制台",
    href: "/console"
  },
  theme: 'console',
  menuConfig: consoleMenuConfig,
  header: {
    showTitle: true,
    showBreadcrumb: true
  }
};

// Admin 布局配置
export const adminLayoutConfig: LayoutConfig = {
  brand: {
    name: "管理后台",
    icon: Settings,
    description: "系统管理",
    href: "/admin"
  },
  theme: 'admin',
  menuConfig: adminMenuConfig,
  header: {
    showTitle: true,
    showBreadcrumb: false
  },
  className: ""
};

