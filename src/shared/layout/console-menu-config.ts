import { 
  Activity,
  User,
  Bell,
  Home,
  Gift,
  Users,
  FileText,
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

export const consoleMenuConfig: MenuConfig = {
  groups: [
    {
      id: "overview",
      title: "概览",
      items: [
        {
          id: "dashboard-overview",
          label: "控制台概览",
          icon: Home,
          href: "/console",
          description: "个人数据概览"
        }
      ]
    },
    {
      id: "dashboard",
      title: "内容管理",
      items: [
        {
          id: "articles",
          label: "我的文章",
          icon: FileText,
          href: "/console/articles",
          description: "查看和管理文章"
        },
        {
          id: "notifications",
          label: "我的通知",
          icon: Inbox,
          href: "/console/notifications",
          description: "查看系统通知"
        },
        {
          id: "activity",
          label: "活动记录",
          icon: Activity,
          href: "/console/activity",
          description: "查看活动历史"
        }
      ]
    },
    {
      id: "referral",
      title: "推荐奖励",
      items: [
        {
          id: "referral-center",
          label: "推荐中心",
          icon: Users,
          href: "/console/referral",
          description: "邀请好友获得奖励"
        },
        {
          id: "points",
          label: "我的积分",
          icon: Gift,
          href: "/console/points",
          description: "积分余额和交易记录"
        }
      ]
    },
    {
      id: "system",
      title: "个人设置",
      items: [
        {
          id: "profile",
          label: "个人资料",
          icon: User,
          href: "/console/profile",
          description: "管理个人资料"
        },
        {
          id: "notifications",
          label: "通知设置",
          icon: Bell,
          href: "/console/settings",
          description: "管理通知偏好"
        }
      ]
    }
  ]
};