"use client";

import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { PortalLayout } from "@shared/layout/portal-layout";
import { PageContent } from "@shared/layout/page-content";
import { 
  Search, 
  Users, 
  CheckCircle,
  ArrowRight,
  Brain,
  GitCompare,
  BookOpen,
  Award,
  Github,
  Clock,
  Zap,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <PortalLayout showHero={true}>
      <div className="bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-muted/10">

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">AI 友好的 Next.js 模板</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              最大化您的
              <span className="text-primary"> AI 预算</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              通过架构与数据流的系统优化，既加速开发，又智能减少 Token/请求/上下文消耗，为您同时节省时间与金钱
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-4 text-lg" asChild>
                <Link href="https://github.com/inRemark/ai-code-nextjs-starter" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  立即开始
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg" asChild>
                <Link href="/blog">
                  查看文档
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              开箱即用 · Apache 2.0 开源 · AI 辅助开发优化
            </p>
          </div>
        </section>

      </div>
      
      <PageContent maxWidth="xl">
        {/* Core Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">核心特性</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              从架构到数据流的系统优化，让 AI 辅助开发更高效、更经济
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-12 h-12 text-primary" />}
              title="以成本为目标"
              description="从架构到数据流，系统性降低 Token/请求次数/上下文长度"
              benefits={["SSR/静态化优先", "响应体瘦身", "缓存策略内置", "减少重复生成"]}
            />
            <FeatureCard
              icon={<GitCompare className="w-12 h-12 text-chart-4" />}
              title="四层清晰分工"
              description="app / features / shared / lib 分层架构，AI 辅助改动面更小"
              benefits={["任务边界清晰", "上下文更短", "可复用性高", "风险隔离"]}
            />
            <FeatureCard
              icon={<Search className="w-12 h-12 text-chart-1" />}
              title="AI 友好规范"
              description="路径别名与命名/导出规则统一，检索与补全更精准"
              benefits={["统一路径别名", "规范命名", "清晰导出", "易于检索"]}
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-chart-2" />}
              title="开箱即用"
              description="认证、文章、个人中心、控制台等核心功能已就绪"
              benefits={["NextAuth v5", "Prisma ORM", "React Query", "Radix UI"]}
            />
            <FeatureCard
              icon={<BookOpen className="w-12 h-12 text-chart-3" />}
              title="契约驱动服务"
              description="统一 API/Service 设计，AI 输出更易复用，变更更可控"
              benefits={["统一接口", "类型安全", "错误处理", "日志追踪"]}
            />
            <FeatureCard
              icon={<Award className="w-12 h-12 text-chart-5" />}
              title="部署即用"
              description="Docker/Vercel 一键上云，环境变量模板简化部署对话成本"
              benefits={["Docker支持", "Vercel部署", "环境模板", "自动迁移"]}
            />
          </div>
        </section>

        {/* Cost Savings Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">真实数据对比</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">节省时间 · 节省Token · 节省金钱</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              直接使用本模板，相比从零开发同类项目的成本对比
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* 从零开发 */}
            <Card className="border-2 border-muted">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <TrendingDown className="w-5 h-5 text-muted-foreground" />
                  从零开发同类项目
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-muted-foreground" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">开发时间</div>
                        <div className="text-2xl font-bold text-foreground">120</div>
                      </div>
                    </div>
                    <span className="text-muted-foreground">小时</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-muted-foreground" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">AI Token 消耗</div>
                        <div className="text-2xl font-bold text-foreground">8.5M</div>
                      </div>
                    </div>
                    <span className="text-muted-foreground">tokens</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-muted-foreground" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">AI 成本</div>
                        <div className="text-2xl font-bold text-foreground">$127</div>
                      </div>
                    </div>
                    <span className="text-muted-foreground">美元</span>
                  </div>
                </div>
                <div className="text-center pt-4 text-sm text-muted-foreground">
                  需要搭建认证、数据库、UI组件等
                </div>
              </CardContent>
            </Card>

            {/* 使用本模板 */}
            <Card className="border-2 border-primary shadow-xl">
              <CardHeader className="text-center pb-4 bg-gradient-to-br from-primary/5 to-chart-1/5 dark:from-primary/10 dark:to-chart-1/10">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  使用本模板开发
                  <Badge variant="default" className="ml-2">推荐</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">开发时间</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">38</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 dark:text-green-400 font-semibold">节省 68%</div>
                      <div className="text-xs text-muted-foreground">82 小时</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">AI Token 消耗</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">2.8M</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 dark:text-green-400 font-semibold">节省 67%</div>
                      <div className="text-xs text-muted-foreground">5.7M tokens</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">AI 成本</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">$42</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 dark:text-green-400 font-semibold">节省 67%</div>
                      <div className="text-xs text-muted-foreground">$85 美元</div>
                    </div>
                  </div>
                </div>
                <div className="text-center pt-4 text-sm text-primary font-medium">
                  ✅ 核心功能已就绪，专注业务逻辑
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 汇总数据 */}
          <Card className="bg-gradient-to-br from-primary/10 via-chart-1/5 to-primary/5 dark:from-primary/20 dark:via-chart-1/10 dark:to-primary/10 border-primary/30">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">为开发者节省的成本</h3>
                <p className="text-muted-foreground">每个使用本模板的项目平均节省</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">82</div>
                  <div className="text-muted-foreground">开发小时</div>
                  <div className="text-sm text-primary mt-1">≈ 10 个工作日</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-chart-1 mb-2">5.7M</div>
                  <div className="text-muted-foreground">Token 消耗</div>
                  <div className="text-sm text-chart-1 mt-1">减少 67% AI 调用</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-chart-4 mb-2">$85</div>
                  <div className="text-muted-foreground">AI 成本</div>
                  <div className="text-sm text-chart-4 mt-1">基于 Claude 3.5 Sonnet</div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 bg-background/50 px-6 py-3 rounded-full">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">免费开源 · 开箱即用 · 持续更新</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              * 数据基于开发一个包含认证、数据库、博客等功能的全栈项目，使用 Claude 3.5 Sonnet 模型的平均数据
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-muted/30 dark:bg-muted/10 py-20 rounded-lg">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12 text-foreground">项目亮点</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <StatisticItem number="4层" label="清晰架构" />
              <StatisticItem number="SSR" label="服务端优先" />
              <StatisticItem number="开箱即用" label="核心功能" />
              <StatisticItem number="AI友好" label="开发优化" />
            </div>
          </div>
        </section>


        {/* Advantages Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20 dark:to-muted/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">现代技术栈</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              基于最新的技术构建，保证性能、安全和开发体验
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-primary" />
                  核心技术
                </h3>
                <div className="space-y-5">
                  <ComparisonItem
                    title="前端框架"
                    traditional="Next.js 15"
                    AICoder="App Router + React 19"
                    advantage="服务端优先架构"
                  />
                  <ComparisonItem
                    title="数据层"
                    traditional="Prisma ORM"
                    AICoder="PostgreSQL + select/include优化"
                    advantage="响应体瘦身"
                  />
                  <ComparisonItem
                    title="认证系统"
                    traditional="NextAuth v5"
                    AICoder="JWT + 路由保护"
                    advantage="安全可靠"
                  />
                  <ComparisonItem
                    title="状态管理"
                    traditional="React Query"
                    AICoder="缓存策略 + revalidate"
                    advantage="减少重复请求"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/5 to-chart-1/10 dark:from-primary/10 dark:to-chart-1/20 border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h4 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary" />
                    完整工具链
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <CheckCircle className="w-5 h-5 text-chart-1 flex-shrink-0" />
                      <span className="text-foreground">TypeScript 全类型安全</span>
                    </li>
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <CheckCircle className="w-5 h-5 text-chart-1 flex-shrink-0" />
                      <span className="text-foreground">Tailwind CSS + Radix UI</span>
                    </li>
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <CheckCircle className="w-5 h-5 text-chart-1 flex-shrink-0" />
                      <span className="text-foreground">react-hook-form + zod 表单验证</span>
                    </li>
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <CheckCircle className="w-5 h-5 text-chart-1 flex-shrink-0" />
                      <span className="text-foreground">Docker + Nginx 容器化部署</span>
                    </li>
                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <CheckCircle className="w-5 h-5 text-chart-1 flex-shrink-0" />
                      <span className="text-foreground">Apache 2.0 开源协议</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-primary/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">开发效率提升</p>
                    <div className="text-3xl font-bold text-primary mb-1">3x</div>
                    <p className="text-xs text-muted-foreground">相比传统开发流程</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      {/* How It Works Section */}
        <section className="bg-muted/30 dark:bg-muted/10 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">快速开始</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              简单三步，启动您的 AI 友好项目
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step="01"
              icon={<Search className="w-8 h-8 text-primary" />}
              title="克隆项目"
              description="从 GitHub 克隆模板，配置环境变量和数据库"
            />
            <StepCard
              step="02"
              icon={<Brain className="w-8 h-8 text-chart-4" />}
              title="本地开发"
              description="运行 pnpm dev 启动开发服务器，开始构建您的应用"
            />
            <StepCard
              step="03"
              icon={<GitCompare className="w-8 h-8 text-chart-1" />}
              title="一键部署"
              description="使用 Docker 或 Vercel 快速部署到生产环境"
            />
          </div>
        </section>


        {/* CTA Section */}
         <section className="bg-gradient-to-br from-primary/90 via-primary to-chart-1/80 text-white py-20 rounded-lg">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">开始构建您的应用</h2>
            <p className="text-xl mb-8 opacity-90">
              最大化 AI 预算，节省时间与金钱，立即体验 AI 友好开发
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" asChild>
                <Link href="https://github.com/inRemark/ai-code-nextjs-starter" target="_blank" rel="noopener noreferrer">
                  注册体验
                  <Github className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PageContent>
    </PortalLayout>
  );
}

// 组件定义
function FeatureCard({ icon, title, description, benefits }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle className="w-4 h-4 text-chart-1 flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function StepCard({ step, icon, title, description }: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-background rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
          {step}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function ComparisonItem({ title, traditional, AICoder, advantage }: {
  title: string;
  traditional: string;
  AICoder: string;
  advantage: string;
}) {
  return (
    <div className="border-l-4 border-primary pl-4">
      <h4 className="font-semibold text-foreground mb-2">{title}</h4>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-chart-3 rounded-full"></span>
          <span className="text-muted-foreground">传统方式：{traditional}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-chart-1 rounded-full"></span>
          <span className="text-foreground font-medium">AICoder：{AICoder}</span>
        </div>
        <div className="text-primary font-medium ml-4">✓ {advantage}</div>
      </div>
    </div>
  );
}

function StatisticItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-2 text-primary">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}
