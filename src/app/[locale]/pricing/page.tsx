import { getTranslations } from "next-intl/server";
import { createPageMetadataGenerator } from '@/lib/seo';
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { PortalLayout } from "@shared/layout/portal-layout";
import { PageContent } from "@/shared/layout/portal-page-content";
import { Check } from "lucide-react";
import Link from "next/link";

export const generateMetadata = createPageMetadataGenerator('pricing');

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  return (
    <PortalLayout>
        <PageContent maxWidth="xl">
          <section className="container mx-auto px-4 py-12">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">{t("title")}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t("description")}
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">{t("plans.free.name")}</CardTitle>
                  <CardDescription>{t("plans.free.description")}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t("plans.free.price")}</span>
                    <span className="text-muted-foreground">{t("plans.free.period")}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-6" variant="outline" asChild>
                    <Link href="/auth/register">{t("plans.free.cta")}</Link>
                  </Button>
                  <ul className="space-y-3">
                    {(t.raw("plans.free.features") as string[]).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-chart-1" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Professional Plan */}
              <Card className="border-2 border-primary shadow-lg relative">
                <Badge className="absolute top-4 right-4">{t("plans.professional.badge")}</Badge>
                <CardHeader>
                  <CardTitle className="text-2xl">{t("plans.professional.name")}</CardTitle>
                  <CardDescription>{t("plans.professional.description")}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t("plans.professional.price")}</span>
                    <span className="text-muted-foreground">{t("plans.professional.period")}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-6" asChild>
                    <Link href="/auth/register">{t("plans.professional.cta")}</Link>
                  </Button>
                  <ul className="space-y-3">
                    {(t.raw("plans.professional.features") as string[]).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-chart-1" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">{t("plans.enterprise.name")}</CardTitle>
                  <CardDescription>{t("plans.enterprise.description")}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t("plans.enterprise.price")}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-6" variant="outline" asChild>
                    <Link href="/help">{t("plans.enterprise.cta")}</Link>
                  </Button>
                  <ul className="space-y-3">
                    {(t.raw("plans.enterprise.features") as string[]).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-chart-1" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <div className="mt-20 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">{t("faq.title")}</h2>
              <div className="space-y-6">
                {(t.raw("faq.items") as Array<{question: string; answer: string}>).map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </PageContent>
    </PortalLayout>
  );
}
