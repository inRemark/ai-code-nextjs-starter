"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMessages, useLocale } from "next-intl";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/utils";
import {
  Menu,
  X,
  LogOut,
  Sparkles,
  User,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@features/auth/components/unified-auth-provider";
import { ThemeToggle } from "@shared/ui/theme-toggle";
import { LanguageSwitcher } from "@shared/components/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";

interface NavItem {
  labelKey: string;
  href: string;
  target?: string;
}

const navItemsConfig: NavItem[] = [
  { labelKey: "pricing", href: "/pricing" },
  { labelKey: "blog", href: "/blog" },
  { labelKey: "articles", href: "/articles" },
  { labelKey: "help", href: "/help" },
  { labelKey: "about", href: "/about" },
];

export const PortalHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const { user, loading, logout } = useAuth();

  const messages = useMessages() as Record<string, any>;

  const sharedLayoutMessages = messages["shared-layout"] || {};
  const navTranslations: Record<string, string> = (sharedLayoutMessages[
    "nav"
  ] || {}) as Record<string, string>;
  const headerTranslations: Record<string, string> = (sharedLayoutMessages[
    "header"
  ] || {}) as Record<string, string>;

  // Format navigation labels based on locale
  const formatNavLabel = (label: string): string => {
    return locale === "en" ? label.toUpperCase() : label;
  };

  const navItems = useMemo(() => {
    return navItemsConfig.map((item) => ({
      ...item,
      label: formatNavLabel(navTranslations[item.labelKey] || item.labelKey),
    }));
  }, [navTranslations, locale]);

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">AICoder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                className={cn(
                  "nav-link text-sm font-medium",
                  pathname === item.href && "active"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />

            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
            )}
            {!loading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link href="/profile?tab=activity">
                      {headerTranslations["profile"] || "Profile"}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <Link href="/profile?tab=orders">
                      {headerTranslations["orders"] || "Orders"}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link href="/profile?tab=profile">
                      {headerTranslations["settings"] || "Settings"}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {headerTranslations["logout"] || "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!loading && !user && (
              <Button variant="ghost" asChild>
                <Link href="/auth/login">
                  {navTranslations["login"] || "Login"}
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.target}
                  className={cn(
                    "nav-link block text-sm font-medium",
                    pathname === item.href && "active"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 pt-4 border-t space-y-2">
                <div className="flex justify-center py-2">
                  <LanguageSwitcher />
                </div>

                <div className="flex justify-center py-2">
                  <ThemeToggle />
                </div>

                {loading && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
                  </div>
                )}

                {!loading && user && (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/profile?tab=profile">
                        <User className="w-4 h-4 mr-2" />
                        {headerTranslations["profile"] || "Profile"}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/profile?tab=settings">
                        <Settings className="w-4 h-4 mr-2" />
                        {headerTranslations["settings"] || "Settings"}
                      </Link>
                    </Button>
                    <div className="border-t pt-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-600"
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {headerTranslations["logout"] || "Logout"}
                      </Button>
                    </div>
                  </div>
                )}

                {!loading && !user && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/auth/login">
                      {navTranslations["login"] || "Login"}
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
