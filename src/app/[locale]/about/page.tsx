"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { PortalLayout } from '@shared/layout/portal-layout';
import { PageContent } from '@/shared/layout/portal-page-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Timeline } from '@/shared/ui/data-components';
import { 
  Target, 
  Eye, 
  Heart, 
  Award, 
  ExternalLink,
  Zap,
  Shield,
  Users
} from 'lucide-react';




export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <PortalLayout >
      <PageContent maxWidth="xl">
        <div className="space-y-16">
          {/* 公司介绍 */}
          <section>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">{t('name')}</h1>
              <p className="text-base text-muted-foreground mb-8">{t('description')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('mission_label')}</h3>
                  <p className="text-sm text-muted-foreground">{t('mission')}</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('vision_label')}</h3>
                  <p className="text-sm text-muted-foreground">{t('vision')}</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('founded_label')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('founded')} · {t('employeeCount')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 企业价值观 */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">{t('values_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(t.raw('values') as Record<string, unknown>[]).map((value: Record<string, unknown>) => {
                const iconMap: Record<string, typeof Heart> = {
                  'zap': Zap,
                  'shield': Shield,
                  'heart': Heart,
                  'users': Users,
                };
                const Icon = iconMap[value.icon as string] || Heart;
                return (
                  <Card key={value.title as string} className="text-center">
                    <CardHeader>
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{value.title as string}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{value.description as string}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 发展历程 */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">{t('timeline_title')}</h2>
            <div className="max-w-4xl mx-auto">
              <Timeline items={((t.raw('timeline.events') as Record<string, unknown>[]).map((event: Record<string, unknown>) => ({
                id: event.year as string,
                title: `${event.icon} ${event.year} : ${event.title}`,
                description: event.description as string,
                timestamp: new Date(`${event.year}-01`),
                type: 'default' as const,
              })))} />
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
                    <Badge variant="default" className="mb-4">{t('pro.badge')}</Badge>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      {t('pro.title')}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      {t('pro.description')}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {(t.raw('pro.features') as Record<string, unknown>[]).map((feature: Record<string, unknown>, index: number) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-primary mb-2">{feature.icon as string}</div>
                        <div className="text-2xl font-bold text-primary mb-2">{feature.title as string}</div>
                        <p className="text-sm text-muted-foreground">{feature.description as string}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="px-8 py-4 text-lg" asChild>
                      <a href="https://github.com/inRemark/ai-code-nextjs-starter-pro" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5 mr-2" />
                        {t('primary_button')}
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" className="px-8 py-4 text-lg" asChild>
                      <a href="https://github.com/inRemark/ai-code-nextjs-starter" target="_blank" rel="noopener noreferrer">
                        {t('secondary_button')}
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