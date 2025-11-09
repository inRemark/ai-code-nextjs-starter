'use client';

import { useState, useEffect } from 'react';
import { logger } from '@logger';
import { useAuth } from '@features/auth/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Switch } from '@shared/ui/switch';
import { Label } from '@shared/ui/label';
import {
  Bell,
  Mail,
  Save,
  CheckCircle,
  AlertCircle,
  Settings,
} from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  reviewReminders: boolean;
  comparisonUpdates: boolean;
}

interface SettingsContentProps {
  apiEndpoint: string;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({
  apiEndpoint,
}) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    reviewReminders: true,
    comparisonUpdates: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        if (data.success) {
          setSettings(data.data);
        }
      } catch (error) {
        logger.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user, apiEndpoint]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || '保存失败');
      }
    } catch (error) {
      logger.error('Failed to update settings:', error);
      setError('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!user || isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">加载中...</h3>
          <p className="text-gray-500">正在加载设置信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 成功提示 */}
      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>通知设置已成功保存！</span>
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

      {/* 邮件通知设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            邮件通知
          </CardTitle>
          <CardDescription>管理您接收的邮件通知类型</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-base font-medium">
                邮件通知
              </Label>
              <p className="text-sm text-muted-foreground">接收系统相关的邮件通知</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="review-reminders" className="text-base font-medium">
                评价提醒
              </Label>
              <p className="text-sm text-muted-foreground">
                提醒您对使用过的解决方案进行评价
              </p>
            </div>
            <Switch
              id="review-reminders"
              checked={settings.reviewReminders}
              onCheckedChange={(checked) => handleSettingChange('reviewReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="comparison-updates" className="text-base font-medium">
                对比更新
              </Label>
              <p className="text-sm text-muted-foreground">
                当您收藏的对比有新内容时通知您
              </p>
            </div>
            <Switch
              id="comparison-updates"
              checked={settings.comparisonUpdates}
              onCheckedChange={(checked) => handleSettingChange('comparisonUpdates', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 系统通知设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            系统通知
          </CardTitle>
          <CardDescription>管理您接收的系统内通知</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="system-updates" className="text-base font-medium">
                系统更新
              </Label>
              <p className="text-sm text-muted-foreground">当系统有新功能或更新时通知您</p>
            </div>
            <Switch id="system-updates" checked={true} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="security-alerts" className="text-base font-medium">
                安全提醒
              </Label>
              <p className="text-sm text-muted-foreground">账户安全相关的提醒和通知</p>
            </div>
            <Switch id="security-alerts" checked={true} disabled />
          </div>
        </CardContent>
      </Card>

      {/* 通知频率设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            通知频率
          </CardTitle>
          <CardDescription>设置您希望接收通知的频率</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">实时通知</Label>
                <p className="text-sm text-muted-foreground">重要事件立即通知</p>
              </div>
              <Switch checked={true} disabled />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">每日摘要</Label>
                <p className="text-sm text-muted-foreground">每天发送一次活动摘要</p>
              </div>
              <Switch checked={false} disabled />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">每周报告</Label>
                <p className="text-sm text-muted-foreground">每周发送使用统计报告</p>
              </div>
              <Switch checked={false} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 保存按钮 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">保存设置</h3>
              <p className="text-sm text-muted-foreground">您的通知偏好设置</p>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? '保存中...' : '保存设置'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
