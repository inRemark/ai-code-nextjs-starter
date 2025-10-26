/**
 * User Feature - User Settings Component
 * 
 * 用户设置组件（可在 Console/Profile 等场景复用）
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card';
import { Switch } from '@shared/ui/switch';
import { Label } from '@shared/ui/label';
import { Button } from '@shared/ui/button';
import { 
  Bell, 
  Mail, 
  Save, 
  Shield,
  Globe,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useUserSettings, useUpdateUserSettings } from '../hooks/useUser';
import type { UserSettings } from '../types/user.types';

interface UserSettingsComponentProps {
  className?: string;
  showTitle?: boolean;
}

export function UserSettingsComponent({ 
  className,
  showTitle = true 
}: UserSettingsComponentProps) {
  const { data: settings, isLoading } = useUserSettings();
  const { mutate: updateSettings, isPending } = useUpdateUserSettings();
  const [localSettings, setLocalSettings] = useState<UserSettings | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = () => {
    if (!localSettings) return;

    updateSettings(
      {
        privacy: localSettings.privacy,
        notifications: localSettings.notifications,
        workflow: localSettings.workflow,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        },
        onError: (err) => {
          setError(err.message || '保存失败，请重试');
        },
      }
    );
  };

  const handleToggle = (
    section: keyof UserSettings,
    key: string,
    value: boolean
  ) => {
    if (!localSettings) return;

    setLocalSettings({
      ...localSettings,
      [section]: {
        ...localSettings[section],
        [key]: value,
      },
    });
  };

  const handleNestedToggle = (
    section: keyof UserSettings,
    subsection: string,
    key: string,
    value: boolean
  ) => {
    if (!localSettings) return;

    setLocalSettings({
      ...localSettings,
      [section]: {
        ...localSettings[section],
        [subsection]: {
          ...(localSettings[section] as Record<string, Record<string, unknown>>)[subsection],
          [key]: value,
        },
      },
    });
  };

  if (isLoading || !localSettings) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">用户设置</h2>
          <p className="text-muted-foreground mt-1">管理您的个人偏好和通知设置</p>
        </div>
      )}

      <div className="space-y-6">
        {/* 成功提示 */}
        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span>设置已成功保存！</span>
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

        {/* 隐私设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              隐私设置
            </CardTitle>
            <CardDescription>
              管理您的个人信息可见性
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">显示邮箱</Label>
                <p className="text-sm text-muted-foreground">
                  在个人资料中显示邮箱地址
                </p>
              </div>
              <Switch
                checked={localSettings.privacy.showEmail}
                onCheckedChange={(checked) =>
                  handleToggle('privacy', 'showEmail', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">显示手机号</Label>
                <p className="text-sm text-muted-foreground">
                  在个人资料中显示手机号码
                </p>
              </div>
              <Switch
                checked={localSettings.privacy.showPhone}
                onCheckedChange={(checked) =>
                  handleToggle('privacy', 'showPhone', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">显示最后在线时间</Label>
                <p className="text-sm text-muted-foreground">
                  让其他用户看到您的最后活跃时间
                </p>
              </div>
              <Switch
                checked={localSettings.privacy.showLastSeen}
                onCheckedChange={(checked) =>
                  handleToggle('privacy', 'showLastSeen', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 邮件通知设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              邮件通知
            </CardTitle>
            <CardDescription>
              管理您接收的邮件通知类型
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">启用邮件通知</Label>
                <p className="text-sm text-muted-foreground">
                  接收系统相关的邮件通知
                </p>
              </div>
              <Switch
                checked={localSettings.notifications.email.enabled}
                onCheckedChange={(checked) =>
                  handleNestedToggle('notifications', 'email', 'enabled', checked)
                }
              />
            </div>

            <div className="ml-8 space-y-4">
              <div className="flex items-center justify-between">
                <Label>系统更新通知</Label>
                <Switch
                  checked={localSettings.notifications.email.systemUpdates}
                  onCheckedChange={(checked) =>
                    handleNestedToggle('notifications', 'email', 'systemUpdates', checked)
                  }
                  disabled={!localSettings.notifications.email.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>安全警告</Label>
                <Switch
                  checked={localSettings.notifications.email.securityAlerts}
                  onCheckedChange={(checked) =>
                    handleNestedToggle('notifications', 'email', 'securityAlerts', checked)
                  }
                  disabled={!localSettings.notifications.email.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>每周报告</Label>
                <Switch
                  checked={localSettings.notifications.email.weeklyReport}
                  onCheckedChange={(checked) =>
                    handleNestedToggle('notifications', 'email', 'weeklyReport', checked)
                  }
                  disabled={!localSettings.notifications.email.enabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 浏览器通知设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              浏览器通知
            </CardTitle>
            <CardDescription>
              管理浏览器内的通知提醒
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">启用浏览器通知</Label>
                <p className="text-sm text-muted-foreground">
                  在浏览器中接收实时通知
                </p>
              </div>
              <Switch
                checked={localSettings.notifications.browser.enabled}
                onCheckedChange={(checked) =>
                  handleNestedToggle('notifications', 'browser', 'enabled', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 工作流设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              工作流偏好
            </CardTitle>
            <CardDescription>
              自定义您的工作流程
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">自动保存间隔</Label>
              <p className="text-sm text-muted-foreground">
                当前: {localSettings.workflow.autoSaveInterval} 秒
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">保存设置</h3>
                <p className="text-sm text-muted-foreground">
                  应用您的个人偏好设置
                </p>
              </div>
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isPending ? '保存中...' : '保存设置'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
