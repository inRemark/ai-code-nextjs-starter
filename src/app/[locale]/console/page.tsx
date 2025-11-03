'use client';

import { ConsoleLayout } from '@shared/layout/console-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import {
  FileText,
  Activity,
  User,
  Gift,
  Users,
  Settings,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@features/auth/components/protected-route';

export default function DashboardPage() {
  const quickActions = [
    {
      title: '我的文章',
      description: '查看和管理您的文章',
      icon: <FileText className="w-6 h-6" />,
      href: '/console/articles',
      color: 'bg-blue-500',
    },
    {
      title: '活动记录',
      description: '查看您的活动历史',
      icon: <Activity className="w-6 h-6" />,
      href: '/console/activity',
      color: 'bg-green-500',
    },
    {
      title: '个人资料',
      description: '管理您的个人信息',
      icon: <User className="w-6 h-6" />,
      href: '/console/profile',
      color: 'bg-purple-500',
    },
    {
      title: '我的积分',
      description: '查看积分和交易记录',
      icon: <Gift className="w-6 h-6" />,
      href: '/console/points',
      color: 'bg-orange-500',
    },
    {
      title: '推荐中心',
      description: '邀请好友获得奖励',
      icon: <Users className="w-6 h-6" />,
      href: '/console/referral',
      color: 'bg-pink-500',
    },
    {
      title: '个人设置',
      description: '管理通知和安全设置',
      icon: <Settings className="w-6 h-6" />,
      href: '/console/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <ProtectedRoute>
      <ConsoleLayout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            {/* 欢迎区域 */}
            <div>
              <h1 className="text-3xl font-bold mb-2">控制台</h1>
              <p className="text-muted-foreground">
                欢迎回来，管理您的内容和设置
              </p>
            </div>

            {/* 快速操作 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">快速操作</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.href} href={action.href}>
                    <Card className="hover:shadow-md transition-all hover:border-primary cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${action.color} text-white shrink-0`}>
                            {action.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-1">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {action.description}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* 常用功能 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">常用功能</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>内容管理</CardTitle>
                    <CardDescription>
                      创建和管理您的文章内容
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/console/articles">
                          <FileText className="w-4 h-4 mr-2" />
                          我的文章
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>账户管理</CardTitle>
                    <CardDescription>
                      管理您的个人信息和设置
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/console/profile">
                          <User className="w-4 h-4 mr-2" />
                          个人资料
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/console/settings">
                          <Settings className="w-4 h-4 mr-2" />
                          通知设置
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </ConsoleLayout>
    </ProtectedRoute>
  );
}