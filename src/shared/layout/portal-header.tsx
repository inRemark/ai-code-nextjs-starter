import React from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { PortalHeaderClient } from "./portal-header-client";

interface NavItemConfig {
  labelKey: string;
  href: string;
  target?: string;
}

const navItemsConfig: NavItemConfig[] = [
  { labelKey: "pricing", href: "/pricing" },
  { labelKey: "blog", href: "/blog" },
  { labelKey: "articles", href: "/articles" },
  { labelKey: "help", href: "/help" },
  { labelKey: "about", href: "/about" },
];

export const PortalHeader = async () => {
  const locale = await getLocale();
  const tNav = await getTranslations('shared-layout.nav');
  const tHeader = await getTranslations('shared-layout.header');

  // Format navigation labels based on locale
  const formatNavLabel = (label: string): string => {
    return locale === "en" ? label.toUpperCase() : label;
  };

  const navItems = navItemsConfig.map((item) => ({
    label: formatNavLabel(tNav(item.labelKey)),
    href: item.href,
    target: item.target,
  }));

  // Convert translations to plain objects for client component
  const headerTranslations: Record<string, string> = {
    login: tNav('login'),
    getStarted: tNav('register'),
    profile: tHeader('profile'),
    settings: tHeader('settings'),
    orders: tHeader('orders'),
    logout: tHeader('logout'),
  };

  const navTranslations: Record<string, string> = {
    login: tNav('login'),
  };

  return (
    <PortalHeaderClient
      navItems={navItems}
      headerTranslations={headerTranslations}
      navTranslations={navTranslations}
    />
  );
};
