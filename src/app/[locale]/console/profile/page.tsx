'use client';
import { logger } from '@logger';

import { useState, useEffect } from 'react';
import { useAuth } from '@features/auth/components/unified-auth-provider';
import { ConsoleLayout } from '@shared/layout/console-layout';
import { EnhancedPageContainer } from '@/shared/layout/app-page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Badge } from '@shared/ui/badge';
import {
  User,
  Mail,
  Calendar,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import ProtectedRoute from '@features/auth/components/protected-route';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setIsEditing(false);
        // 这里应该更新用户上下文，但为了简化，我们只是显示成功消息
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || '保存失败');
      }
    } catch (error) {
      logger.error('Failed to update profile:', error);
      setError('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <ConsoleLayout>
          <EnhancedPageContainer
            title="个人资料"
            description="管理您的个人信息"
            showSearch={false}
          >
            <div className="p-6">
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">加载中...</h3>
                <p className="text-gray-500">正在加载用户信息</p>
              </div>
            </div>
          </EnhancedPageContainer>
        </ConsoleLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ConsoleLayout>
        <EnhancedPageContainer
          title="个人资料"
          description="管理您的个人信息"
          showSearch={false}
        >
          <div className="p-6 space-y-6">
            {/* 成功提示 */}
            {success && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span>个人资料已成功更新！</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 错误提示 */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 基本信息 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    基本信息
                  </CardTitle>
                  <CardDescription>
                    您的个人资料信息
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? '取消编辑' : '编辑资料'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="请输入您的姓名"
                      />
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/20">
                        {formData.name || '未设置'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱地址</Label>
                    <div className="p-3 border rounded-md bg-muted/20 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.email}</span>
                      <Badge variant="secondary" className="text-xs">
                        已验证
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      邮箱地址不可修改
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>注册时间</Label>
                    <div className="p-3 border rounded-md bg-muted/20 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{user.createdAt ? formatDate(user.createdAt) : '未知'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>最后登录</Label>
                    <div className="p-3 border rounded-md bg-muted/20 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{user.updatedAt ? formatDate(user.updatedAt) : '未知'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">个人简介</Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="介绍一下自己..."
                      className="w-full p-3 border rounded-md resize-none"
                      rows={4}
                    />
                  ) : (
                    <div className="p-3 border rounded-md bg-muted/20 min-h-[100px]">
                      {formData.bio || '还没有个人简介'}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? '保存中...' : '保存修改'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      取消
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>


          </div>
        </EnhancedPageContainer>
      </ConsoleLayout>
    </ProtectedRoute>
  );
}
