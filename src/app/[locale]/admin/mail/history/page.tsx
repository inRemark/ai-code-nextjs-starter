"use client";

import { AdminLayout } from "@shared/layout/admin-layout";
import { EnhancedPageContainer } from "@/shared/layout/app-page-container";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { Input } from "@shared/ui/input";
import { 
  Search,
  Mail,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Eye
} from "lucide-react";

// 简化的通知历史数据
const notificationHistory = [
  {
    id: "1",
    subject: "推荐奖励通知",
    recipient: "zhangsan@example.com",
    recipientName: "张三",
    status: "已送达",
    sentAt: "2024-01-20 09:15:32",
    type: "推荐奖励",
    template: "推荐奖励模板"
  },
  {
    id: "2",
    subject: "邀请好友注册",
    recipient: "lisi@example.com",
    recipientName: "李四",
    status: "已送达",
    sentAt: "2024-01-19 10:30:15",
    type: "推荐邀请",
    template: "推荐邀请模板"
  },
  {
    id: "3",
    subject: "系统通知",
    recipient: "wangwu@example.com",
    recipientName: "王五",
    status: "已送达",
    sentAt: "2024-01-18 14:20:10",
    type: "系统通知",
    template: "系统通知模板"
  },
  {
    id: "4",
    subject: "分享对比结果",
    recipient: "zhaoliu@example.com",
    recipientName: "赵六",
    status: "发送失败",
    sentAt: "2024-01-17 16:45:30",
    type: "分享邮件",
    template: "分享模板"
  }
];

export default function MailHistoryPage() {
  return (
    <AdminLayout>
      <EnhancedPageContainer
        title="邮件发送历史"
        description="查看已发送的系统通知和邮件记录"
        showSearch={false}
      >
        <div className="p-6 space-y-6">
          {/* 搜索和筛选 */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索收件人、主题或类型..."
                className="pl-9"
              />
            </div>
          </div>

          {/* 统计概览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{notificationHistory.length}</p>
                    <p className="text-sm text-muted-foreground">总邮件数</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {notificationHistory.filter(item => item.status === '已送达').length}
                    </p>
                    <p className="text-sm text-muted-foreground">成功发送</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {notificationHistory.filter(item => item.status === '发送失败').length}
                    </p>
                    <p className="text-sm text-muted-foreground">发送失败</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {notificationHistory.filter(item => item.type === '推荐邀请').length}
                    </p>
                    <p className="text-sm text-muted-foreground">推荐邀请</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 邮件历史列表 */}
          <Card>
            <CardHeader>
              <CardTitle>邮件发送记录</CardTitle>
              <CardDescription>最近发送的系统通知和邮件记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.subject}</p>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.recipientName} ({item.recipient})
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.sentAt}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={item.status === '已送达' ? 'default' : 'destructive'}
                        className="flex items-center gap-1"
                      >
                        {item.status === '已送达' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {item.status}
                      </Badge>
                      
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 分页 */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  显示 1-{notificationHistory.length} 条记录，共 {notificationHistory.length} 条
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    上一页
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    下一页
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </EnhancedPageContainer>
    </AdminLayout>
  );
}
