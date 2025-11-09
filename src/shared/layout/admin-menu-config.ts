import { 
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  Mail,
  Send,
  Clock,
  Inbox,
  LucideIcon
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  description?: string;
  children?: MenuItem[];
}

export interface MenuGroup {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface MenuConfig {
  groups: MenuGroup[];
}

export const adminMenuConfig: MenuConfig = {
  groups: [
    {
      id: "overview",
      title: "概览",
      items: [
        {
          id: "admin-dashboard",
          label: "仪表板",
          icon: LayoutDashboard,
          href: "/admin",
          description: "管理后台概览"
        }
      ]
    },
    {
      id: "content-management",
      title: "内容管理",
      items: [
        {
          id: "articles",
          label: "文章管理",
          icon: FileText,
          href: "/admin/articles",
          description: "管理文章内容"
        }
      ]
    },
    {
      id: "data-management",
      title: "数据管理",
      items: [
        {
          id: "user-management",
          label: "用户管理",
          icon: Users,
          href: "/admin/users",
          description: "管理用户账户和角色"
        },
        {
          id: "system-settings",
          label: "系统设置",
          icon: Settings,
          href: "/admin/settings",
          description: "系统配置管理"
        }
      ]
    },
    {
      id: "mail-management",
      title: "邮件管理",
      items: [
        {
          id: "mail-history",
          label: "发送历史",
          icon: Mail,
          href: "/admin/mail/history",
          description: "查看邮件发送历史记录"
        },
        {
          id: "mail-test",
          label: "测试发送",
          icon: Send,
          href: "/admin/mail/test",
          description: "测试邮件发送功能"
        },
        {
          id: "mail-queue",
          label: "队列进度",
          icon: Clock,
          href: "/admin/mail/queue",
          description: "邮件队列状态和进度"
        }
      ]
    }
  ]
};
