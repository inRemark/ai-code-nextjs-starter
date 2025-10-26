"use client";

import React from "react";
import { Card, CardContent } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { User, Star, Heart, Activity } from "lucide-react";

export const UserInfoSidebar: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 用户头像和信息 */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-1">管理员</h2>
          <p className="text-sm text-muted-foreground mb-3">admin@AICoder.com</p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">管理员</Badge>
            <Badge variant="outline">已验证</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 用户统计 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">统计信息</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">我的评价</span>
              </div>
              <span className="font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">收藏内容</span>
              </div>
              <span className="font-medium">28</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm">活动记录</span>
              </div>
              <span className="font-medium">156</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 最近活动预览 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">最近活动</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-muted-foreground">2小时前</span>
              </div>
              <p className="text-xs">评价了 "React vs Vue" 问题</p>
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">1天前</span>
              </div>
              <p className="text-xs">收藏了 "TypeScript 最佳实践" 方案</p>
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-xs text-muted-foreground">3天前</span>
              </div>
              <p className="text-xs">搜索了 "前端框架对比"</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
