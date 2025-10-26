"use client";

import React from 'react';
import { PortalLayout } from '@shared/layout/portal-layout';
import { PageContent } from '@shared/layout/page-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Timeline, TimelineItem } from '@/shared/ui/data-components';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Shield, 
  Zap,
  ExternalLink
} from 'lucide-react';
import { CompanyInfo, TimelineEvent } from '@shared/types/portal';

const companyInfo: CompanyInfo = {
  name: 'AI Code Next.js Starter',
  description: '为 AI 辅助开发优化的 Next.js 全栈模板',
  mission: '通过架构与数据流的系统优化，为开发者节省时间、Token 和金钱',
  vision: '成为开发者首选的 Next.js 全栈开发模板，让 AI 辅助开发更高效、更经济',
  founded: '2024年',
  headquarters: '开源项目',
  employeeCount: '社区驱动',
  values: [
    {
      title: 'AI 友好架构',
      description: '四层清晰分工，统一路径别名，AI 辅助改动面更小、上下文更短',
      icon: 'zap',
    },
    {
      title: '成本优先',
      description: '从架构到数据流，系统性降低 Token/请求次数/上下文长度',
      icon: 'shield',
    },
    {
      title: '开箱即用',
      description: '认证、数据库、UI 组件等核心功能已就绪，专注业务逻辑',
      icon: 'heart',
    },
    {
      title: '开源共享',
      description: 'Apache 2.0 协议开源，欢迎社区贡献和反馈',
      icon: 'users',
    },
  ],
};

const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    year: '2024-10',
    title: '项目初始化',
    description: '基于 Next.js 15 和 React 19 搭建基础架构',
    type: 'milestone',
  },
  {
    id: '2',
    year: '2024-11',
    title: '核心功能开发',
    description: '完成认证系统、数据库集成、UI 组件库',
    type: 'product',
  },
  {
    id: '3',
    year: '2024-12',
    title: 'AI 友好优化',
    description: '实现四层架构分工，优化路径别名和命名规范',
    type: 'product',
  },
  {
    id: '4',
    year: '2025-01',
    title: 'v1.0 正式发布',
    description: '开源发布，采用 Apache 2.0 协议',
    type: 'milestone',
  },
  {
    id: '5',
    year: '2025-02',
    title: '社区增长',
    description: 'GitHub Stars 突破 1000，社区贡献者持续增加',
    type: 'achievement',
  },
  {
    id: '6',
    year: '2025-03',
    title: '功能完善',
    description: '新增博客系统、用户控制台等核心功能模块',
    type: 'product',
  },
];


const getValueIcon = (icon: string) => {
  const iconMap = {
    heart: Heart,
    zap: Zap,
    shield: Shield,
    users: Users,
  };
  return iconMap[icon as keyof typeof iconMap] || Heart;
};

const getTimelineIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'milestone': return '🏆';
    case 'product': return '🚀';
    case 'expansion': return '🌍';
    case 'achievement': return '⭐';
    default: return '📅';
  }
};

export default function AboutPage() {
  const timelineItems: TimelineItem[] = timelineEvents.map(event => ({
    id: event.id,
    title: getTimelineIcon(`${event.type}`) + `${event.year} : ${event.title}`,
    description: event.description,
    timestamp: new Date(`${event.year}-01`),
    type: 'default',
  }));

  return (
    <PortalLayout >
      <PageContent maxWidth="xl">
        <div className="space-y-16">
          {/* 公司介绍 */}
          <section>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">{companyInfo.name}</h1>
              <p className="text-base text-muted-foreground mb-8">{companyInfo.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">使命</h3>
                  <p className="text-sm text-muted-foreground">{companyInfo.mission}</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">愿景</h3>
                  <p className="text-sm text-muted-foreground">{companyInfo.vision}</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">成立时间</h3>
                  <p className="text-sm text-muted-foreground">
                    {companyInfo.founded} · {companyInfo.employeeCount}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 企业价值观 */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">我们的价值观</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companyInfo.values.map((value) => {
                const Icon = getValueIcon(value.icon);
                return (
                  <Card key={value.title} className="text-center">
                    <CardHeader>
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{value.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 发展历程 */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">发展历程</h2>
            <div className="max-w-4xl mx-auto">
              <Timeline items={timelineItems} />
            </div>
          </section>

          {/* 数据展示 */}
          {/* <section className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-12 border">
            <h2 className="text-3xl font-bold text-center mb-12">我们的成就</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-sm text-muted-foreground">服务客户</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">100M+</div>
                <div className="text-sm text-muted-foreground">邮件送达</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">服务可用性</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
                <div className="text-sm text-muted-foreground">团队成员</div>
              </div>
            </div>
          </section> */}

          {/* 商业版推广 */}
          <section>
            <Card className="bg-gradient-to-br from-primary/10 via-chart-1/5 to-primary/5 border-primary/30">
              <CardContent className="p-12">
                <div className="text-center max-w-3xl mx-auto">
                  <div className="mb-6">
                    <Badge variant="default" className="mb-4">商业版</Badge>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      AI Code Next.js Starter Pro
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      解锁更多企业级功能，加速您的商业项目开发
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">⚡ 高级组件</div>
                      <p className="text-sm text-muted-foreground">更多业务组件和模板</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chart-1 mb-2">👨‍💻 优先支持</div>
                      <p className="text-sm text-muted-foreground">专属技术支持服务</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chart-4 mb-2">🛡️ 企业级</div>
                      <p className="text-sm text-muted-foreground">安全、性能、可扩展</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="px-8 py-4 text-lg" asChild>
                      <a href="https://github.com/inRemark/ai-code-nextjs-starter-pro" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5 mr-2" />
                        了解商业版
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" className="px-8 py-4 text-lg" asChild>
                      <a href="https://github.com/inRemark/ai-code-nextjs-starter" target="_blank" rel="noopener noreferrer">
                        继续使用免费版
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </PageContent>
    </PortalLayout>
  );
}