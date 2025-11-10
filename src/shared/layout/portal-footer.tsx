import React from "react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const socialLinks = [
  { icon: FaGithub, href: "https://github.com/sendmail", labelKey: "social.github" },
  { icon: FaTwitter, href: "https://twitter.com/sendmail", labelKey: "social.twitter" },
  { icon: FaLinkedin, href: "https://linkedin.com/company/sendmail", labelKey: "social.linkedin" }
];

export const PortalFooter = async () => {
  const locale = await getLocale();
  const t = await getTranslations('shared-layout.footer');
  
  const formatLabel = (label: string): string => {
    return locale === 'en' ? label.toUpperCase() : label;
  };
  
  const footerLinks = {
    product: [
      { label: t("product"), href: "/features" },
    ],
    company: [
      { label: t("company"), href: "/about" },
    ],
    legal: [
      { label: t("privacyPolicy"), href: "/about/privacy" },
      { label: t("termsOfService"), href: "/about/terms" },
      { label: t("cookiePolicy"), href: "/about/cookies" },
    ]
  };
  
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">VSeek</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
            {t("description")}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.labelKey}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{formatLabel(t("product"))}</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{formatLabel(t("company"))}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{formatLabel(t("legal"))}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 AiCoder. {t("allRightsReserved")}。
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="text-muted-foreground text-sm">{t("icp")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};