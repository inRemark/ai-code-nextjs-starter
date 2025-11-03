"use client";

import { AdminLayout } from "@shared/layout/admin-layout";
import { EnhancedPageContainer } from "@shared/layout/enhanced-page-container";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { Textarea } from "@shared/ui/textarea";
import { Badge } from "@shared/ui/badge";
import { 
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Settings,
  FileText,
  Clock,
  Zap
} from "lucide-react";
import { useState } from "react";

// 可用的邮件模板
const availableTemplates = [
  {
    id: "referral-invitation",
    name: "推荐邀请",
    description: "邀请好友注册的邮件模板",
    variables: ["referrerName", "referralCode", "referralLink"]
  },
  {
    id: "referral-reward",
    name: "推荐奖励",
    description: "推荐奖励通知邮件模板",
    variables: ["userName", "referredUserName", "rewardAmount", "rewardReason"]
  },
  {
    id: "system-notification",
    name: "系统通知",
    description: "系统通知邮件模板",
    variables: ["title", "content", "userName"]
  },
  {
    id: "verification",
    name: "邮件验证",
    description: "邮箱验证和密码重置邮件模板",
    variables: ["type", "userName", "verificationLink", "expiryTime"]
  },
  {
    id: "share-email",
    name: "分享邮件",
    description: "分享内容的邮件模板",
    variables: ["fromUserName", "title", "description", "shareUrl"]
  },
  {
    id: "subscription-update",
    name: "订阅更新",
    description: "订阅更新通知邮件模板",
    variables: ["title", "content", "version", "userName"]
  }
];

export default function MailTestPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [testEmail, setTestEmail] = useState<string>("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [sendMode, setSendMode] = useState<'immediate' | 'queue'>('immediate');
  const [priority, setPriority] = useState<'high' | 'normal' | 'low'>('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    timestamp?: string;
    mode?: string;
    queueId?: string;
    position?: number;
    estimatedTime?: number;
  } | null>(null);

  const currentTemplate = availableTemplates.find(t => t.id === selectedTemplate);

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSendTest = async () => {
    if (!selectedTemplate || !testEmail) {
      setResult({
        success: false,
        message: "请选择模板并输入测试邮箱地址"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testEmail,
          subject: `[测试] ${selectedTemplate} 模板邮件`,
          templateId: selectedTemplate,
          variables,
          sendMode,
          priority: sendMode === 'queue' ? priority : undefined
        }),
      });

      const data = await response.json();

      setResult({
        success: data.success,
        message: data.message || data.error,
        timestamp: data.timestamp,
        mode: data.mode,
        queueId: data.queueId,
        position: data.position,
        estimatedTime: data.estimatedTime
      });
    } catch (error) {
      setResult({
        success: false,
        message: "发送失败：" + (error as Error).message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <EnhancedPageContainer
        title="邮件测试发送"
        description="测试邮件模板和发送功能"
        showSearch={false}
      >
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 测试配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  测试配置
                </CardTitle>
                <CardDescription>
                  选择模板并配置测试参数
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 模板选择 */}
                <div className="space-y-2">
                  <Label htmlFor="template">邮件模板</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择邮件模板" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex flex-col">
                            <span>{template.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {template.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 发送模式 */}
                <div className="space-y-2">
                  <Label>发送模式</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        sendMode === 'immediate' 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-border/80'
                      }`}
                      onClick={() => setSendMode('immediate')}
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-medium">立即发送</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        同步发送，立即返回结果
                      </p>
                    </div>
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        sendMode === 'queue' 
                          ? 'border-chart-2 bg-chart-2/10' 
                          : 'border-border hover:border-border/80'
                      }`}
                      onClick={() => setSendMode('queue')}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-chart-2" />
                        <span className="font-medium">队列发送</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        异步发送，支持批量处理
                      </p>
                    </div>
                  </div>
                </div>

                {/* 优先级选择（仅在队列模式下显示） */}
                {sendMode === 'queue' && (
                  <div className="space-y-2">
                    <Label htmlFor="priority">优先级</Label>
                    <Select value={priority} onValueChange={(value: 'high' | 'normal' | 'low') => setPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                            高优先级
                          </div>
                        </SelectItem>
                        <SelectItem value="normal">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                            普通优先级
                          </div>
                        </SelectItem>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                            低优先级
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 测试邮箱 */}
                <div className="space-y-2">
                  <Label htmlFor="testEmail">测试邮箱</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    placeholder="输入测试邮箱地址"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>

                {/* 发送按钮 */}
                <Button 
                  onClick={handleSendTest}
                  disabled={isLoading || !selectedTemplate || !testEmail}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      发送中...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      发送测试邮件
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 模板变量配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  模板变量
                </CardTitle>
                <CardDescription>
                  {currentTemplate ? `配置 ${currentTemplate.name} 模板的变量` : "请先选择模板"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentTemplate ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {currentTemplate.variables.map((variable) => (
                        <Badge key={variable} variant="outline">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      {currentTemplate.variables.map((variable) => (
                        <div key={variable} className="space-y-2">
                          <Label htmlFor={variable}>{variable}</Label>
                          <Input
                            id={variable}
                            placeholder={`输入 ${variable} 的值`}
                            value={variables[variable] || ""}
                            onChange={(e) => handleVariableChange(variable, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    请先选择一个邮件模板
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 发送结果 */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  发送结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${
                  result.success 
                    ? 'bg-chart-2/10 border border-chart-2/20' 
                    : 'bg-chart-1/10 border border-chart-1/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.mode === 'queue' ? (
                      <Clock className="h-4 w-4 text-chart-2" />
                    ) : (
                      <Zap className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-medium">
                      {result.mode === 'queue' ? '队列发送' : '立即发送'}
                    </span>
                  </div>
                  
                  <p className={result.success ? 'text-chart-2' : 'text-chart-1'}>
                    {result.message}
                  </p>
                  
                  {result.mode === 'queue' && result.queueId && (
                    <div className="mt-3 space-y-1 text-sm">
                      <p className="text-foreground">
                        <strong>任务ID:</strong> {result.queueId}
                      </p>
                      {result.position && (
                        <p className="text-foreground">
                          <strong>队列位置:</strong> 第 {result.position} 位
                        </p>
                      )}
                      {result.estimatedTime && (
                        <p className="text-foreground">
                          <strong>预计处理时间:</strong> {result.estimatedTime} 分钟
                        </p>
                      )}
                    </div>
                  )}
                  
                  {result.timestamp && (
                    <p className="text-sm text-muted-foreground mt-2">
                      发送时间: {new Date(result.timestamp).toLocaleString('zh-CN')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 模板说明 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                模板说明
              </CardTitle>
              <CardDescription>
                邮件模板的使用说明和注意事项
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">使用步骤：</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>选择要测试的邮件模板</li>
                    <li>输入测试邮箱地址</li>
                    <li>配置模板所需的变量值</li>
                    <li>点击"发送测试邮件"按钮</li>
                    <li>查看发送结果</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">注意事项：</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>测试邮件将发送到指定的邮箱地址</li>
                    <li>请确保邮箱地址格式正确</li>
                    <li>变量值将替换模板中的占位符</li>
                    <li>发送结果会显示在页面底部</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </EnhancedPageContainer>
    </AdminLayout>
  );
}
