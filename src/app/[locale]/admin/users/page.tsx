'use client';

import { AdminLayout } from '@/shared/layout/admin-layout';
import UserManagement from '@/features/auth/components/user-management';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Users } from 'lucide-react';

/**
 * 管理员 - 用户管理页面
 * 
 * 功能：
 * - 查看所有用户列表
 * - 修改用户角色（USER/ADMIN）
 * - 查看用户状态（激活/未激活）
 * - 分页浏览用户
 * 
 * 权限要求：需要 ADMIN 角色
 */
export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <Card className="bg-gradient-to-r from-primary/5 to-chart-2/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">用户管理</h1>
                <p className="text-muted-foreground mt-1">
                  管理系统用户、角色和权限
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 用户管理组件 */}
        <Card>
          <CardHeader>
            <CardTitle>所有用户</CardTitle>
            <CardDescription>
              查看和管理系统中的所有用户账户
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <UserManagement />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
