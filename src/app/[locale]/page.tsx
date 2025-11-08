import { getTranslations } from 'next-intl/server';
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { PortalLayout } from "@shared/layout/portal-layout";
import { PageContent } from "@/shared/layout/portal-page-content";
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

export default async function FeaturesPage() {
  const t = await getTranslations('home');
  return (
    <PortalLayout showHero={true}>
      <div className="bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-muted/10">

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">{t('badge')}</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              {t('hero.title')}
              <span className="text-primary"> {t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-4 text-lg" asChild>
                <Link href="https://github.com/inRemark/ai-code-nextjs-starter" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  {t('hero.primaryButton')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg" asChild>
                <Link href="/blog">
                  {t('hero.secondaryButton')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {t('hero.tagline')}
            </p>
          </div>
        </section>

      </div>
      
      <PageContent maxWidth="xl">
        {/* Core Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('coreFeatures.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('coreFeatures.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.raw('coreFeatures.items').map((item: Record<string, unknown>, index: number) => (
              <FeatureCard
                key={index}
                title={item.title as string}
                description={item.description as string}
                benefits={item.benefits as string[]}
              />
            ))}
          </div>
        </section>

        {/* Cost Savings Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">{t('costSavings.subtitle')}</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('costSavings.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('costSavings.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* 从零开发 */}
            <Card className="border-2 border-muted">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <TrendingDown className="w-5 h-5 text-muted-foreground" />
                  {t('costSavings.fromScratch.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-muted-foreground" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">{t('costSavings.fromScratch.time')}</div>
                        <div className="text-2xl font-bold text-foreground">120</div>
                      </div>
                    </div>
                    <span className="text-muted-foreground">{t('costSavings.fromScratch.timeUnit')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-muted-foreground" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">{t('costSavings.fromScratch.tokensLabel')}</div>
                        <div className="text-2xl font-bold text-foreground">8.5M</div>
                      </div>
                    </div>
                    <span className="text-muted-foreground">tokens</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-muted-foreground" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">{t('costSavings.fromScratch.costLabel')}</div>
                        <div className="text-2xl font-bold text-foreground">$127</div>
                      </div>
                    </div>
                    <span className="text-muted-foreground">{t('costSavings.fromScratch.costUnit')}</span>
                  </div>
                </div>
                <div className="text-center pt-4 text-sm text-muted-foreground">
                  {t('costSavings.fromScratch.description')}
                </div>
              </CardContent>
            </Card>

            {/* 使用本模板 */}
            <Card className="border-2 border-primary shadow-xl">
              <CardHeader className="text-center pb-4 bg-gradient-to-br from-primary/5 to-chart-1/5 dark:from-primary/10 dark:to-chart-1/10">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  {t('costSavings.withTemplate.title')}
                  <Badge variant="default" className="ml-2">{t('costSavings.withTemplate.badge')}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">{t('costSavings.withTemplate.timeLabel')}</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">38</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 dark:text-green-400 font-semibold">{t('costSavings.withTemplate.timeSavings')}</div>
                      <div className="text-xs text-muted-foreground">{t('costSavings.withTemplate.timeSavingsDetail')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">{t('costSavings.withTemplate.tokensLabel')}</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">2.8M</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 dark:text-green-400 font-semibold">{t('costSavings.withTemplate.tokensSavings')}</div>
                      <div className="text-xs text-muted-foreground">{t('costSavings.withTemplate.tokensSavingsDetail')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">{t('costSavings.withTemplate.costLabel')}</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">$42</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 dark:text-green-400 font-semibold">{t('costSavings.withTemplate.costSavings')}</div>
                      <div className="text-xs text-muted-foreground">{t('costSavings.withTemplate.costSavingsDetail')}</div>
                    </div>
                  </div>
                </div>
                <div className="text-center pt-4 text-sm text-primary font-medium">
                  {t('costSavings.withTemplate.description')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 汇总数据 */}
          <Card className="bg-gradient-to-br from-primary/10 via-chart-1/5 to-primary/5 dark:from-primary/20 dark:via-chart-1/10 dark:to-primary/10 border-primary/30">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{t('costSavings.summary.title')}</h3>
                <p className="text-muted-foreground">{t('costSavings.summary.subtitle')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">82</div>
                  <div className="text-muted-foreground">{t('costSavings.summary.hoursLabel')}</div>
                  <div className="text-sm text-primary mt-1">{t('costSavings.summary.hoursDetail')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-chart-1 mb-2">5.7M</div>
                  <div className="text-muted-foreground">{t('costSavings.summary.tokensLabel')}</div>
                  <div className="text-sm text-chart-1 mt-1">{t('costSavings.summary.tokensDetail')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-chart-4 mb-2">$85</div>
                  <div className="text-muted-foreground">{t('costSavings.summary.costLabel')}</div>
                  <div className="text-sm text-chart-4 mt-1">{t('costSavings.summary.costDetail')}</div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 bg-background/50 px-6 py-3 rounded-full">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{t('costSavings.summary.badge')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t('costSavings.summary.note')}
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-muted/30 dark:bg-muted/10 py-20 rounded-lg">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12 text-foreground">{t('statistics.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {t.raw('statistics.items').map((item: Record<string, unknown>, index: number) => (
                <StatisticItem key={index} number={item.number as string} label={item.label as string} />
              ))}
            </div>
          </div>
        </section>


        {/* Advantages Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20 dark:to-muted/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('techStack.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('techStack.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-primary" />
                  {t('techStack.coretech.title')}
                </h3>
                <div className="space-y-5">
                  {t.raw('techStack.coretech.items').map((item: Record<string, unknown>, index: number) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold text-foreground mb-2">{item.title as string}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-chart-3 rounded-full"></span>
                          <span className="text-muted-foreground">{item.tech1 as string}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-chart-1 rounded-full"></span>
                          <span className="text-foreground font-medium">{item.tech2 as string}</span>
                        </div>
                        <div className="text-primary font-medium ml-4">✓ {item.advantage as string}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/5 to-chart-1/10 dark:from-primary/10 dark:to-chart-1/20 border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h4 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary" />
                    {t('techStack.toolchain.title')}
                  </h4>
                  <ul className="space-y-4">
                    {t.raw('techStack.toolchain.items').map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <CheckCircle className="w-5 h-5 text-chart-1 flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-primary/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">{t('techStack.efficiency.label')}</p>
                    <div className="text-3xl font-bold text-primary mb-1">{t('techStack.efficiency.value')}</div>
                    <p className="text-xs text-muted-foreground">{t('techStack.efficiency.detail')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-muted/30 dark:bg-muted/10 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('quickStart.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('quickStart.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.raw('quickStart.steps').map((step: Record<string, unknown>, index: number) => (
              <StepCard
                key={index}
                step={step.step as string}
                title={step.title as string}
                description={step.description as string}
              />
            ))}
          </div>
        </section>


        {/* CTA Section */}
         <section className="bg-gradient-to-br from-primary/90 via-primary to-chart-1/80 text-white py-20 rounded-lg">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">{t('cta.title')}</h2>
            <p className="text-xl mb-8 opacity-90">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" asChild>
                <Link href="https://github.com/inRemark/ai-code-nextjs-starter" target="_blank" rel="noopener noreferrer">
                  {t('hero.primaryButton')}
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
function FeatureCard({ title, description, benefits }: {
  title: string;
  description: string;
  benefits: string[];
}) {
  const iconMap: Record<string, React.ReactNode> = {
    'cost': <Brain className="w-12 h-12 text-primary" />,
    'architecture': <GitCompare className="w-12 h-12 text-chart-4" />,
    'standard': <Search className="w-12 h-12 text-chart-1" />,
    'ready': <Users className="w-12 h-12 text-chart-2" />,
    'service': <BookOpen className="w-12 h-12 text-chart-3" />,
    'deploy': <Award className="w-12 h-12 text-chart-5" />,
  };
  
  const iconOrder = ['cost', 'architecture', 'standard', 'ready', 'service', 'deploy'];
  const iconKey = iconOrder.find(key => title.includes(key)) || 'cost';

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">{iconMap[iconKey]}</div>
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

function StepCard({ step, title, description }: {
  step: string;
  title: string;
  description: string;
}) {
  const iconMap: Record<string, React.ReactNode> = {
    '01': <Search className="w-8 h-8 text-primary" />,
    '02': <Brain className="w-8 h-8 text-chart-4" />,
    '03': <GitCompare className="w-8 h-8 text-chart-1" />,
  };

  return (
    <div className="text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-background rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
          {iconMap[step]}
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


function StatisticItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-2 text-primary">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}
