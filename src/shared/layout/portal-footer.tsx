"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Sparkles } from "lucide-react";

const footerLinks = {
  product: [
    { label: "功能特性", href: "/features" },
    { label: "探索问题", href: "/explore" },
  ],
  company: [
    { label: "关于我们", href: "/about" },
    { label: "博客", href: "/blog" },
  ],
  legal: [
    { label: "隐私政策", href: "/about/privacy" },
    { label: "服务条款", href: "/about/terms" },
    { label: "Cookie政策", href: "/about/cookies" },
  ]
};

const socialLinks = [
  { icon: Github, href: "https://github.com/sendmail", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/sendmail", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/sendmail", label: "LinkedIn" }
];

export const PortalFooter: React.FC = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">AICoder</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
            通过架构与数据流的系统优化，既加速开发，又智能减少 Token/请求/上下文消耗，为您同时节省时间与金钱
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">产品</h3>
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
            <h3 className="font-semibold text-foreground mb-4">关于</h3>
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
            <h3 className="font-semibold text-foreground mb-4">法律</h3>
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
            © 2025 AICoder. 保留所有权利。
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="text-muted-foreground text-sm">ICP备案号：京ICP备12345678号</span>
          </div>
        </div>
      </div>
    </footer>
  );
};