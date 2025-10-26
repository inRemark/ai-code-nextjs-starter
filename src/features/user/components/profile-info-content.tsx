"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { User, Edit, Key, Save, X } from "lucide-react";
import { usePersonalSettings } from "@features/auth/hooks/useProfile";

export const ProfileInfoContent: React.FC = () => {
  const { settings, loading } = usePersonalSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  
  // 编辑状态管理
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  
  // 表单数据
  const [profileData, setProfileData] = useState({
    name: '管理员',
    email: 'admin@AICoder.com',
    username: '管理员'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // 处理基本信息编辑
  const handleProfileEdit = () => {
    setIsEditingProfile(true);
  };

  const handleProfileSave = () => {
    // 这里可以添加保存逻辑
    // TODO: 实现保存基本信息的 API 调用
    setIsEditingProfile(false);
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    // 重置表单数据
    setProfileData({
      name: '管理员',
      email: 'admin@AICoder.com',
      username: '管理员'
    });
  };

  // 处理密码编辑
  const handlePasswordEdit = () => {
    setIsEditingPassword(true);
  };

  const handlePasswordSave = () => {
    // 这里可以添加密码修改逻辑
    // TODO: 实现修改密码的 API 调用
    setIsEditingPassword(false);
    // 重置表单数据
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordCancel = () => {
    setIsEditingPassword(false);
    // 重置表单数据
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };


  if (loading || !localSettings) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              个人信息
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
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{profileData.name}</h3>
              <p className="text-muted-foreground">{profileData.email}</p>
              <Badge variant="secondary">管理员</Badge>
            </div>
          </div>
          
          {isEditingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleProfileSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  保存
                </Button>
                <Button variant="outline" onClick={handleProfileCancel} className="gap-2">
                  <X className="h-4 w-4" />
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">用户名</Label>
                  <p className="text-sm text-muted-foreground">{profileData.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">邮箱</Label>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">注册时间</Label>
                  <p className="text-sm text-muted-foreground">2024年1月15日</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">最后登录</Label>
                  <p className="text-sm text-muted-foreground">2小时前</p>
                </div>
              </div>
              <Button onClick={handleProfileEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                编辑资料
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 密码管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            密码管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingPassword ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">当前密码</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="请输入当前密码"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">新密码</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="请输入新密码"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="请再次输入新密码"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePasswordSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  保存
                </Button>
                <Button variant="outline" onClick={handlePasswordCancel} className="gap-2">
                  <X className="h-4 w-4" />
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium">密码</Label>
              <p className="text-sm text-muted-foreground">上次修改：3个月前</p>
              <Button  onClick={handlePasswordEdit} className="gap-2">
                <Key className="h-4 w-4" />
                修改密码
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
