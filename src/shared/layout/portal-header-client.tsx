"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/utils";
import { Menu, X, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/shared/theme/theme-toggle";
import { LanguageSwitcher } from "@shared/components/language-switcher";
import { PortalHeaderAuth } from "./portal-header-auth";

interface NavItem {
  label: string;
  href: string;
  target?: string;
}

interface PortalHeaderClientProps {
  navItems: NavItem[];
  headerTranslations: Record<string, string>;
  navTranslations: Record<string, string>;
}

export const PortalHeaderClient: React.FC<PortalHeaderClientProps> = ({
  navItems,
  headerTranslations,
  navTranslations,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
            <PortalHeaderAuth headerTranslations={headerTranslations} />
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

                <PortalHeaderAuth 
                  headerTranslations={headerTranslations}
                  navTranslations={navTranslations}
                  isMobile={true}
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
