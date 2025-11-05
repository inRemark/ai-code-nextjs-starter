"use client";

import { AdminLayout } from "@shared/layout/admin-layout";
import { EnhancedPageContainer } from "@/shared/layout/app-page-container";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { logger } from '@logger';
import { 
  Clock,
  RefreshCw,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";

// 队列数据类型
interface QueueStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

interface QueueItem {
  id: string;
  to: string;
  subject: string;
  priority: 'high' | 'normal' | 'low';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  processedAt?: string;
  error?: string;
  retryCount: number;
  maxRetries: number;
  templateId?: string;
}

// 模拟队列数据（用于演示）
const mockQueueData = {
  stats: {
    total: 150,
    pending: 45,
    processing: 3,
    completed: 95,
    failed: 7
  },
  items: [
    {
      id: 'task-001',
      to: 'user1@example.com',
      subject: '欢迎注册 AICoder',
      priority: 'high' as const,
      status: 'processing' as const,
      createdAt: '2024-01-15T10:30:00Z',
      retryCount: 0,
      maxRetries: 3,
      templateId: 'welcome'
    },
    {
      id: 'task-002',
      to: 'user2@example.com',
      subject: '密码重置请求',
      priority: 'high' as const,
      status: 'pending' as const,
      createdAt: '2024-01-15T10:31:00Z',
      retryCount: 0,
      maxRetries: 3,
      templateId: 'password-reset'
    },
    {
      id: 'task-003',
      to: 'user3@example.com',
      subject: '推荐奖励通知',
      priority: 'normal' as const,
      status: 'completed' as const,
      createdAt: '2024-01-15T10:25:00Z',
      processedAt: '2024-01-15T10:26:00Z',
      retryCount: 0,
      maxRetries: 3,
      templateId: 'referral-reward'
    },
    {
      id: 'task-004',
      to: 'user4@example.com',
      subject: '系统维护通知',
      priority: 'normal' as const,
      status: 'failed' as const,
      createdAt: '2024-01-15T10:20:00Z',
      error: 'SMTP连接超时',
      retryCount: 3,
      maxRetries: 3,
      templateId: 'system-notification'
    },
    {
      id: 'task-005',
      to: 'user5@example.com',
      subject: '营销活动邀请',
      priority: 'low' as const,
      status: 'pending' as const,
      createdAt: '2024-01-15T10:35:00Z',
      retryCount: 0,
      maxRetries: 3,
      templateId: 'marketing'
    }
  ]
};

export default function MailQueuePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<QueueStats>(mockQueueData.stats);
  const [queue, setQueue] = useState<QueueItem[]>(mockQueueData.items);

  // 获取队列数据
  const fetchQueueData = async () => {
    try {
      const response = await fetch('/api/mail/queue/process');
      const data = await response.json();
      
      if (data.success && data.stats) {
        // 映射 API 返回的 stats （sent -> completed）
        setStats({
          total: data.stats.total,
          pending: data.stats.pending,
          processing: data.stats.processing,
          completed: data.stats.sent,  // sent 映射为 completed
          failed: data.stats.failed,
        });
      }

      // 获取队列任务列表
      const tasksResponse = await fetch('/api/mail/queue/tasks?limit=20');
      const tasksData = await tasksResponse.json();
      
      if (tasksData.success && tasksData.data) {
        // 映射任务数据格式
        const mappedTasks = tasksData.data.map((task: {
          id: string;
          to: string;
          subject: string;
          priority: string;
          status: string;
          createdAt: string;
          sentAt?: string | null;
          error?: string | null;
          attempts: number;
          maxAttempts: number;
          templateId?: string;
        }) => ({
          id: task.id,
          to: task.to,
          subject: task.subject,
          priority: task.priority.toLowerCase(),
          status: task.status.toLowerCase(),
          createdAt: task.createdAt,
          processedAt: task.sentAt,
          error: task.error,
          retryCount: task.attempts,
          maxRetries: task.maxAttempts,
          templateId: task.templateId,
        }));
        setQueue(mappedTasks);
      }
    } catch (error) {
      logger.error('获取队列数据失败:', error);
      // 失败时使用模拟数据
      setStats(mockQueueData.stats);
      setQueue(mockQueueData.items);
    }
  };

  // 刷新数据
  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchQueueData();
    setIsLoading(false);
  };

  // 初始化加载
  useEffect(() => {
    fetchQueueData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <AdminLayout>
      <EnhancedPageContainer
        title="邮件队列进度"
        description="查看邮件队列状态和发送进度"
        showSearch={false}
      >
        <div className="p-6 space-y-6">
          {/* 页面操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">邮件队列状态</h2>
              <p className="text-sm text-muted-foreground">查看邮件队列的当前状态和进度</p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              刷新数据
            </Button>
          </div>

          {/* 队列统计 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">总邮件数</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-sm text-muted-foreground">等待中</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.processing}</p>
                    <p className="text-sm text-muted-foreground">处理中</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                    <p className="text-sm text-muted-foreground">已完成</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.failed}</p>
                    <p className="text-sm text-muted-foreground">失败</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* 队列详情 */}
          <Card>
            <CardHeader>
              <CardTitle>队列详情</CardTitle>
              <CardDescription>
                当前队列中的邮件任务
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queue.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>队列中没有任务</p>
                  </div>
                ) : (
                  queue.map((item) => (
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
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority === 'high' ? '高优先级' : 
                               item.priority === 'normal' ? '普通' : '低优先级'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{item.to}</span>
                            <span>创建时间: {new Date(item.createdAt).toLocaleString('zh-CN')}</span>
                            {item.status === 'failed' && item.error && (
                              <span className="text-red-600">错误: {item.error}</span>
                            )}
                            {item.status === 'completed' && item.processedAt && (
                              <span>完成时间: {new Date(item.processedAt).toLocaleString('zh-CN')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`flex items-center gap-1 ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status === 'completed' ? '已完成' :
                           item.status === 'processing' ? '处理中' :
                           item.status === 'pending' ? '等待中' : '失败'}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* 分页 */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  显示 1-{queue.length} 条记录，共 {queue.length} 条
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
