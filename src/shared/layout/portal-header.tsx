"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/utils";
import { Menu, X, LogOut, Sparkles, User, Settings } from "lucide-react";
import { useAuth } from "@features/auth/components/unified-auth-provider";
import { ThemeToggle } from "@shared/ui/theme-toggle";
import { LanguageSwitcher } from "@shared/components/language-switcher";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@shared/ui/dropdown-menu";

interface NavItem {
  label: string;
  href: string;
  target?: string;
}

const navItems: NavItem[] = [
  { label: "价格", href: "/pricing" },
  { label: "博客", href: "/blog" },
  { label: "文章", href: "/articles" },
  { label: "帮助", href: "/help" },
  { label: "关于", href: "/about" },
];

export const PortalHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

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
                   {/* 主题切换按钮 */}
                   <ThemeToggle />
                    {/* 语言切换 */}
                   <LanguageSwitcher />
            
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link href="/profile?tab=activity">个人中心</Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link href="/profile?tab=favorites">我的收藏</Link>
                  </DropdownMenuItem>
 
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link href="/profile?tab=profile">账号设置</Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/auth/login">登录</Link>
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
                       {/* 移动端主题切换 */}
                       <div className="flex justify-center py-2">
                         <ThemeToggle />
                       </div>
                
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/profile?tab=profile">
                        <User className="w-4 h-4 mr-2" />
                        个人中心
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/profile?tab=favorites">
                        <Settings className="w-4 h-4 mr-2" />
                        我的收藏
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/profile?tab=settings">
                        <Settings className="w-4 h-4 mr-2" />
                        账号设置
                      </Link>
                    </Button>
                    <div className="border-t pt-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-600 hover:text-red-600" 
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        退出登录
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/auth/login">登录</Link>
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