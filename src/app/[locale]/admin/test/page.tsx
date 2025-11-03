'use client';

import { AdminLayout } from '@shared/layout/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';

export default function AdminTestPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">管理后台测试页面</h1>
          <p className="text-gray-600">测试配色、布局和滚动修复效果</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>配色测试</CardTitle>
              <CardDescription>测试卡片样式</CardDescription>
            </CardHeader>
            <CardContent>
              <p>这个卡片应该显示正确的配色方案</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>边距测试</CardTitle>
              <CardDescription>测试内容边距</CardDescription>
            </CardHeader>
            <CardContent>
              <p>内容区域应该有合适的内边距</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>响应式测试</CardTitle>
              <CardDescription>测试响应式布局</CardDescription>
            </CardHeader>
            <CardContent>
              <p>在不同屏幕尺寸下应该正常显示</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>背景色测试</CardTitle>
            <CardDescription>测试整体背景色</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border">
              <p>白色背景卡片 - 应该与灰色背景形成对比</p>
            </div>
          </CardContent>
        </Card>

        {/* 滚动测试区域 */}
        <Card>
          <CardHeader>
            <CardTitle>滚动测试</CardTitle>
            <CardDescription>测试页面滚动功能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>如果能看到这个区域，说明滚动功能正常</p>
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold">测试项目 {i + 1}</h3>
                  <p className="text-gray-600">这是第 {i + 1} 个测试项目，用于验证页面滚动功能是否正常工作。</p>
                </div>
              ))}
              <div className="p-4 bg-green-100 rounded-lg text-green-800">
                <h3 className="font-semibold">✅ 滚动测试完成</h3>
                <p>如果您能看到这个绿色卡片，说明滚动功能已经修复！</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
