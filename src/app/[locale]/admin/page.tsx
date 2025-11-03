'use client';

import { useAuth } from '@features/auth/components/unified-auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminLayout } from '@shared/layout/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { 
  FileText, 
  CheckCircle,
  Eye,
  Edit
} from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user && (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      router.push('/unauthorized');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    return null;
  }

  // 模拟统计数据 - 文章相关
  const stats = {
    totalArticles: 5,
    publishedArticles: 4,
    draftArticles: 1,
    totalViews: 436,
    totalUsers: 3,
    todayActivity: 12,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 欢迎信息 */}
        <Card className="bg-gradient-to-r from-primary/5 to-chart-1/10 border-primary/20">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-2 text-foreground">
              欢迎回来，{user.name || user.email}！
            </h1>
            <p className="text-muted-foreground">
              您正在使用 AICoder 管理后台，当前角色：{user.role === 'ADMIN' ? '管理员' : '编辑者'}
            </p>
          </CardContent>
        </Card>

        {/* 统计卡片 - 文章相关数据 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总文章数</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalArticles}</div>
              <p className="text-xs text-muted-foreground">
                篇文章已创建
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已发布</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.publishedArticles}</div>
              <p className="text-xs text-muted-foreground">
                篇已发布文章
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">草稿</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.draftArticles}</div>
              <p className="text-xs text-muted-foreground">
                篇待发布
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总浏览量</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                次文章浏览
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 最近活动 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
              <CardDescription>
                系统最近的操作记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-chart-1/10 rounded-full">
                    <FileText className="h-4 w-4 text-chart-1" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">新文章已发布</p>
                    <p className="text-xs text-muted-foreground">2分钟前</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-chart-2/10 rounded-full">
                    <Edit className="h-4 w-4 text-chart-2" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">文章草稿已保存</p>
                    <p className="text-xs text-muted-foreground">5分钟前</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">文章浏览量突破100</p>
                    <p className="text-xs text-muted-foreground">10分钟前</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>系统状态</CardTitle>
              <CardDescription>
                当前系统运行状态
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">数据库连接</span>
                  <Badge variant="default" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                    正常
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">API服务</span>
                  <Badge variant="default" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                    正常
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">文件存储</span>
                  <Badge variant="default" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                    正常
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">缓存服务</span>
                  <Badge variant="default" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                    正常
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}