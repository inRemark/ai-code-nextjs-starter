# Next.js 国际化实施方案 (next-intl)

## 📋 项目概述

### 方案选择

- **技术方案**: next-intl (标准 URL 路由方案)
- **路由模式**: `/[locale]/...` (如 `/zh/about`, `/en/about`)
- **切换方式**: URL 跳转 (页面刷新)
- **支持语言**: 中文(zh)、英文(en)、日文(ja)

### 核心优势

- ✅ SEO 友好 - URL 路径明确语言
- ✅ 类型安全 - 完整 TypeScript 支持
- ✅ Server Components 原生支持
- ✅ 自动生成 `hreflang` 标签
- ✅ 配置简单，学习曲线低

---

## 🏗️ 架构设计

### 1. 目录结构

```bash
src/
├── app/
│   ├── [locale]/              # 语言路由层
│   │   ├── layout.tsx         # 语言布局 (注入翻译)
│   │   ├── page.tsx           # 首页
│   │   ├── about/             # 关于页
│   │   ├── admin/             # 管理后台
│   │   ├── auth/              # 认证页面
│   │   ├── console/           # 用户控制台
│   │   ├── articles/          # 文章列表
│   │   ├── blog/              # 博客
│   │   └── ...                # 其他页面
│   ├── api/                   # API 路由 (不带语言前缀)
│   └── layout.tsx             # 根布局
│
├── i18n/
│   ├── config.ts              # 国际化配置
│   ├── request.ts             # 服务端翻译请求
│   └── routing.ts             # 路由配置
│
├── messages/                  # 翻译文件 (JSON)
│   ├── zh.json                # 中文翻译
│   ├── en.json                # 英文翻译
│   └── ja.json                # 日文翻译
│
├── shared/
│   └── components/
│       └── language-switcher.tsx  # 语言切换组件
│
└── middleware.ts              # 语言检测与重定向中间件
```

---

## 🔧 技术实现方案

### Phase 1: 基础配置

#### 1.1 安装依赖

```bash
pnpm add next-intl
```

#### 1.2 创建国际化配置

**文件**: `src/i18n/config.ts`

```typescript
export const locales = ['zh', 'en', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh';

export const localeNames: Record<Locale, string> = {
  zh: '简体中文',
  en: 'English',
  ja: '日本語',
};
```

#### 1.3 创建路由配置

**文件**: `src/i18n/routing.ts`

```typescript
import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['zh', 'en', 'ja'],
  defaultLocale: 'zh',
  localePrefix: 'always', // URL 始终包含语言前缀
});

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
```

#### 1.4 创建服务端翻译请求

**文件**: `src/i18n/request.ts`

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // 验证 locale 是否有效
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
```

---

### Phase 2: 中间件配置

#### 2.1 修改现有 middleware.ts

**文件**: `src/middleware.ts`

```typescript
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { routing } from './i18n/routing';
import { logger } from '@logger';

// 创建 next-intl 中间件
const intlMiddleware = createMiddleware(routing);

// 认证保护路由定义
const publicRoutes = [
  '/',
  '/about',
  '/help',
  '/blog',
  '/pricing',
  '/login',
  '/register',
];

const userProtectedRoutes = ['/profile', '/console'];
const adminProtectedRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过 API 路由
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 应用国际化中间件
  const intlResponse = intlMiddleware(request);

  // 提取语言前缀后的路径
  const pathWithoutLocale = pathname.replace(/^\/(zh|en|ja)/, '') || '/';

  // 检查是否为公共路由
  const isPublicRoute = publicRoutes.some((route) =>
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route)
  );

  if (isPublicRoute) {
    return intlResponse;
  }

  // 认证检查逻辑
  const isUserProtected = userProtectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  const isAdminProtected = adminProtectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  if (!isUserProtected && !isAdminProtected) {
    return intlResponse;
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub) {
      const locale = pathname.split('/')[1] || 'zh';
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    if (isAdminProtected && token.role !== 'ADMIN') {
      const locale = pathname.split('/')[1] || 'zh';
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
    }

    return intlResponse;
  } catch (err) {
    logger.error('Middleware auth error:', err);
    const locale = pathname.split('/')[1] || 'zh';
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

### Phase 3: 路由重构

#### 3.1 调整根布局

**文件**: `src/app/layout.tsx` (保持不变，移除 children 渲染逻辑)

```typescript
import '../index.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VSeek',
  description: 'Professional Email Service Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children; // 只返回 children，不包裹 html/body
}
```

#### 3.2 创建语言布局

**文件**: `src/app/[locale]/layout.tsx` (新建)

```typescript
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthSessionProvider } from '@features/auth/components/session-provider';
import { UnifiedAuthProvider } from '@features/auth/components/unified-auth-provider';
import { BreakpointProvider } from '@shared/theme/breakpoint-provider';
import { ReactQueryProvider } from '@/lib/react-query';
import { ThemeProvider } from '@shared/theme/context';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 验证 locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 获取翻译消息
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'system';
                const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = theme === 'dark' || (theme === 'system' && isSystemDark);
                window.__THEME_PREFERENCE__ = { theme, shouldBeDark };
                document.documentElement.classList.toggle('dark', shouldBeDark);
              } catch (e) {
                const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                window.__THEME_PREFERENCE__ = { theme: 'system', shouldBeDark: isSystemDark };
                document.documentElement.classList.toggle('dark', isSystemDark);
              }
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ReactQueryProvider>
              <BreakpointProvider>
                <AuthSessionProvider>
                  <UnifiedAuthProvider>{children}</UnifiedAuthProvider>
                </AuthSessionProvider>
              </BreakpointProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

#### 3.3 迁移现有页面

将所有页面从 `app/*` 移动到 `app/[locale]/*`:

- `app/page.tsx` → `app/[locale]/page.tsx`
- `app/about/page.tsx` → `app/[locale]/about/page.tsx`
- `app/admin/page.tsx` → `app/[locale]/admin/page.tsx`
- ... (所有其他页面)

**注意**: `app/api/*` 保持不变

---

### Phase 4: 翻译文件结构

#### 4.1 创建基础翻译文件

**文件**: `src/messages/zh.json`

```json
{
  "common": {
    "appName": "VSeek",
    "loading": "加载中...",
    "save": "保存",
    "cancel": "取消",
    "delete": "删除",
    "edit": "编辑",
    "create": "创建",
    "submit": "提交",
    "search": "搜索",
    "filter": "筛选",
    "logout": "退出登录"
  },
  "nav": {
    "home": "首页",
    "about": "关于我们",
    "blog": "博客",
    "articles": "文章",
    "pricing": "价格",
    "help": "帮助中心",
    "login": "登录",
    "register": "注册",
    "profile": "个人中心",
    "console": "控制台",
    "admin": "管理后台"
  },
  "auth": {
    "login": {
      "title": "登录",
      "emailLabel": "邮箱地址",
      "emailPlaceholder": "请输入邮箱",
      "passwordLabel": "密码",
      "passwordPlaceholder": "请输入密码",
      "rememberMe": "记住我",
      "forgotPassword": "忘记密码?",
      "submitButton": "登录",
      "noAccount": "还没有账号?",
      "registerLink": "立即注册"
    },
    "register": {
      "title": "注册",
      "emailLabel": "邮箱地址",
      "passwordLabel": "密码",
      "confirmPasswordLabel": "确认密码",
      "submitButton": "注册",
      "hasAccount": "已有账号?",
      "loginLink": "立即登录"
    }
  },
  "errors": {
    "notFound": "页面未找到",
    "unauthorized": "无权限访问",
    "serverError": "服务器错误",
    "networkError": "网络错误"
  }
}
```

**文件**: `src/messages/en.json`

```json
{
  "common": {
    "appName": "VSeek",
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "submit": "Submit",
    "search": "Search",
    "filter": "Filter",
    "logout": "Logout"
  },
  "nav": {
    "home": "Home",
    "about": "About",
    "blog": "Blog",
    "articles": "Articles",
    "pricing": "Pricing",
    "help": "Help",
    "login": "Login",
    "register": "Register",
    "profile": "Profile",
    "console": "Console",
    "admin": "Admin"
  },
  "auth": {
    "login": {
      "title": "Login",
      "emailLabel": "Email",
      "emailPlaceholder": "Enter your email",
      "passwordLabel": "Password",
      "passwordPlaceholder": "Enter your password",
      "rememberMe": "Remember me",
      "forgotPassword": "Forgot password?",
      "submitButton": "Login",
      "noAccount": "Don't have an account?",
      "registerLink": "Register now"
    },
    "register": {
      "title": "Register",
      "emailLabel": "Email",
      "passwordLabel": "Password",
      "confirmPasswordLabel": "Confirm Password",
      "submitButton": "Register",
      "hasAccount": "Already have an account?",
      "loginLink": "Login now"
    }
  },
  "errors": {
    "notFound": "Page Not Found",
    "unauthorized": "Unauthorized",
    "serverError": "Server Error",
    "networkError": "Network Error"
  }
}
```

#### 4.2 按功能模块扩展

建议在 `messages/` 目录下按功能拆分:

```json
// zh.json (合并所有模块)
{
  "common": { ... },
  "auth": { ... },
  "articles": {
    "title": "文章列表",
    "createNew": "创建新文章",
    "edit": "编辑文章"
  },
  "admin": {
    "dashboard": "管理面板",
    "users": "用户管理"
  }
}
```

---

### Phase 5: 组件改造

#### 5.1 创建语言切换组件

**文件**: `src/shared/components/language-switcher.tsx`

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { locales, localeNames } from '@/i18n/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

#### 5.2 在页面中使用翻译

**示例**: 登录页面改造

```typescript
// app/[locale]/auth/login/page.tsx
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth.login');

  return (
    <div>
      <h1>{t('title')}</h1>
      <form>
        <label>{t('emailLabel')}</label>
        <input placeholder={t('emailPlaceholder')} />
        
        <label>{t('passwordLabel')}</label>
        <input placeholder={t('passwordPlaceholder')} />
        
        <button>{t('submitButton')}</button>
      </form>
    </div>
  );
}
```

#### 5.3 服务端组件使用

```typescript
// app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('nav');

  return (
    <div>
      <h1>{t('home')}</h1>
    </div>
  );
}
```

---

### Phase 6: 类型安全配置

#### 6.1 生成翻译类型

**文件**: `global.d.ts` (扩展)

```typescript
type Messages = typeof import('./src/messages/zh.json');
declare interface IntlMessages extends Messages {}
```

#### 6.2 配置 TypeScript

**文件**: `tsconfig.json` (确保包含)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@messages/*": ["./src/messages/*"]
    }
  }
}
```

---

## 📝 实施步骤

### Step 1: 安装与配置 (1-2小时)

- [ ] 安装 `next-intl`
- [ ] 创建 `i18n/` 配置文件
- [ ] 创建基础翻译文件 `messages/zh.json`, `messages/en.json`

### Step 2: 中间件改造 (1小时)

- [ ] 修改 `middleware.ts` 集成国际化
- [ ] 测试语言检测和重定向

### Step 3: 路由重构 (2-3小时)

- [ ] 调整根 `layout.tsx`
- [ ] 创建 `[locale]/layout.tsx`
- [ ] 迁移所有页面到 `[locale]/*`
- [ ] 验证所有路由正常工作

### Step 4: 翻译文件填充 (持续进行)

- [ ] 提取所有硬编码文本
- [ ] 填充中文翻译
- [ ] 填充英文翻译
- [ ] (可选) 填充日文翻译

### Step 5: 组件改造 (3-5小时)

- [ ] 创建 `LanguageSwitcher` 组件
- [ ] 改造导航栏组件
- [ ] 改造登录/注册页面
- [ ] 改造其他核心页面

### Step 6: 类型安全与优化 (1小时)

- [ ] 配置 TypeScript 类型
- [ ] 测试类型提示
- [ ] 性能优化

### Step 7: 测试与验证 (2小时)

- [ ] 测试所有页面在不同语言下显示
- [ ] 测试语言切换功能
- [ ] 测试 SEO 元数据
- [ ] 测试认证流程在多语言下工作

---

## ⚙️ Next.js 配置调整

### next.config.ts

```typescript
const nextConfig: NextConfig = {
  // 其他配置...
  
  // next-intl 插件
  experimental: {
    // 如需服务端组件使用异步翻译
  },
};

export default nextConfig;
```

---

## 🧪 测试计划

### 单元测试

- 翻译键存在性测试
- 语言切换逻辑测试

### 集成测试

- URL 路由正确性
- 语言持久化
- 认证流程多语言测试

### E2E 测试

- 用户完整流程测试
- 不同语言下的用户体验

---

## 🚀 部署注意事项

### 环境变量

无额外环境变量需求

### 构建配置

```bash
pnpm build  # 正常构建
```

### Vercel 部署

next-intl 完全兼容 Vercel，无需额外配置

---

## 📊 性能优化

1. **翻译文件懒加载**: next-intl 自动实现
2. **静态生成**: 使用 `generateStaticParams` 预渲染所有语言版本
3. **缓存策略**: 翻译文件在构建时打包，无运行时开销

---

## 🔄 迁移路径

### 渐进式迁移方案

1. 先迁移核心页面 (首页、登录、注册)
2. 再迁移功能页面 (控制台、管理后台)
3. 最后迁移次要页面 (关于、帮助)

### 兼容性处理

- 保持 API 路由不变
- 旧链接通过中间件自动重定向到默认语言

---

## 📚 参考资源

- [next-intl 官方文档](https://next-intl-docs.vercel.app/)
- [Next.js 国际化指南](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [TypeScript 类型安全配置](https://next-intl-docs.vercel.app/docs/workflows/typescript)

---

## ✅ 验收标准

- [ ] 所有页面支持中英文切换
- [ ] URL 路径包含语言前缀 (`/zh/`, `/en/`)
- [ ] 语言切换功能正常
- [ ] SEO 元数据多语言支持
- [ ] TypeScript 类型提示完整
- [ ] 认证流程在多语言下工作正常
- [ ] 构建无错误、无警告

---

## 📅 时间估算

- **总计**: 10-15 小时
- **Phase 1-3**: 4-6 小时 (基础配置与路由重构)
- **Phase 4-5**: 4-7 小时 (翻译与组件改造)
- **Phase 6-7**: 2-3 小时 (优化与测试)

---

## 🎯 下一步行动

1. 确认技术方案
2. 执行 Step 1: 安装依赖与基础配置
3. 执行 Step 2-3: 中间件与路由重构
4. 逐步改造组件并填充翻译
