"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Switch } from "@shared/ui/switch";
import { FormField } from "@shared/ui/form-components";
import { usePersonalSettings } from "@features/auth/hooks/useProfile";
import { 
  Settings, 
  Bell
} from "lucide-react";

export const ProfileAccountSettings: React.FC = () => {
  const { settings, loading, updateSettings } = usePersonalSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleUpdateSettings = async (section: string, updates: any) => {
    if (!localSettings) return;
    
    const newSettings = {
      ...localSettings,
      [section]: {
        ...localSettings[section as keyof typeof localSettings],
        ...updates,
      },
    };
    
    setLocalSettings(newSettings);
    
    try {
      await updateSettings(newSettings);
    } catch (error) {
      // 回滚本地状态
      setLocalSettings(settings);
    }
  };

  if (loading || !localSettings) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              账号设置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 通知设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            通知设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* <FormSection title="邮件通知" description="管理邮件通知偏好"> */}
            <FormField label="启用邮件通知">
              <Switch
                checked={localSettings.notifications.email.enabled}
                onCheckedChange={(checked) => 
                  handleUpdateSettings('notifications', {
                    email: { ...localSettings.notifications.email, enabled: checked }
                  })
                }
              />
            </FormField>

            <div className="space-y-4 ml-8">
              <FormField label="邮件发送通知">
                <Switch
                  checked={localSettings.notifications.email.emailSent}
                  onCheckedChange={(checked) => 
                    handleUpdateSettings('notifications', {
                      email: { ...localSettings.notifications.email, emailSent: checked }
                    })
                  }
                  disabled={!localSettings.notifications.email.enabled}
                />
              </FormField>

              <FormField label="热点内容订阅">
                <Switch
                  checked={localSettings.notifications.email.systemUpdates}
                  onCheckedChange={(checked) => 
                    handleUpdateSettings('notifications', {
                      email: { ...localSettings.notifications.email, systemUpdates: checked }
                    })
                  }
                  disabled={!localSettings.notifications.email.enabled}
                />
              </FormField>

              <FormField label="安全警告通知">
                <Switch
                  checked={localSettings.notifications.email.securityAlerts}
                  onCheckedChange={(checked) => 
                    handleUpdateSettings('notifications', {
                      email: { ...localSettings.notifications.email, securityAlerts: checked }
                    })
                  }
                  disabled={!localSettings.notifications.email.enabled}
                />
              </FormField>
            </div>
          {/* </FormSection> */}
        </CardContent>
      </Card>
    </div>
  );
};
