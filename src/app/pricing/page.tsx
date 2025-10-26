"use client";

import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { PortalLayout } from "@shared/layout/portal-layout";
import { PageContent } from "@shared/layout/page-content";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <PortalLayout>
      <div className="bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-muted/10">
        <PageContent maxWidth="xl">
          <section className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">价格方案</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                选择适合您的方案
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                灵活的定价方案，满足不同规模团队的需求
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* 免费版 */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">免费版</CardTitle>
                  <CardDescription>适合个人用户</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">¥0</span>
                    <span className="text-muted-foreground">/月</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-6" variant="outline" asChild>
                    <Link href="/auth/register">开始使用</Link>
                  </Button>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">基础功能</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">博客阅读</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">积分系统</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">推荐奖励</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 专业版 */}
              <Card className="border-2 border-primary shadow-lg relative">
                <Badge className="absolute top-4 right-4">推荐</Badge>
                <CardHeader>
                  <CardTitle className="text-2xl">专业版</CardTitle>
                  <CardDescription>适合小型团队</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">¥99</span>
                    <span className="text-muted-foreground">/月</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-6" asChild>
                    <Link href="/auth/register">开始试用</Link>
                  </Button>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">免费版所有功能</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">高级分析</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">优先支持</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">自定义配置</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">API 访问</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 企业版 */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">企业版</CardTitle>
                  <CardDescription>适合大型组织</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">定制</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-6" variant="outline" asChild>
                    <Link href="/help">联系我们</Link>
                  </Button>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">专业版所有功能</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">私有部署</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">专属客服</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">SLA 保障</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-chart-1" />
                      <span className="text-sm">定制开发</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <div className="mt-20 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">常见问题</h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">可以随时取消吗？</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      是的，您可以随时取消订阅，不收取任何费用。
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">支持哪些支付方式？</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      我们支持支付宝、微信支付、信用卡等多种支付方式。
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">是否提供发票？</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      是的，我们为所有付费用户提供正规增值税发票。
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </PageContent>
      </div>
    </PortalLayout>
  );
}
