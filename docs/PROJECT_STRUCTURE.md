# 项目组织结构文档

> Next.js 15 全栈项目目录结构说明  
> 版本: 1.0.0  
> 更新时间: 2025-10-01

## 目录

- [项目结构总览](#项目结构总览)
- [核心目录说明](#核心目录说明)
- [配置文件](#配置文件)
- [开发规范](#开发规范)

---

## 项目结构总览

```bash
ai-code-nextjs-starter/
├── .next/                    # Next.js 构建输出（忽略）
├── node_modules/             # 依赖包（忽略）
├── prisma/                   # 数据库相关
│   ├── migrations/          # 数据库迁移文件
│   ├── schema.prisma        # Prisma Schema 定义
│   └── seed.cjs             # 种子数据脚本
├── public/                   # 静态资源
│   ├── favicon.ico
│   └── robots.txt
├── src/                      # 源代码
│   ├── app/                 # Next.js App Router
│   ├── features/            # 功能模块
│   ├── lib/                 # 核心库
│   ├── shared/              # 共享资源
│   ├── middleware.ts        # 中间件
│   └── index.css            # 全局样式
├── docs/                     # 项目文档
│   ├── architecture/        # 架构文档
│   ├── deployment/          # 部署文档
│   └── README.md
├── scripts/                  # 工具脚本
├── .env.example             # 环境变量模板
├── .env.local               # 本地环境变量（忽略）
├── .eslintrc.json           # ESLint 配置
├── .gitignore               # Git 忽略文件
├── docker-compose.yml       # Docker Compose 配置
├── Dockerfile               # Docker 镜像配置
├── next.config.ts           # Next.js 配置
├── package.json             # 项目依赖
├── pnpm-lock.yaml           # 依赖锁定文件
├── postcss.config.mjs       # PostCSS 配置
├── tailwind.config.ts       # Tailwind CSS 配置
├── tsconfig.json            # TypeScript 配置
└── README.md                # 项目说明
```

---

## 核心目录说明

### 1. src/app/ - Next.js App Router

基于文件系统的路由结构。

```bash
src/app/
├── (auth)/                   # 路由组：认证相关
│   ├── login/
│   └── register/
├── api/                      # API 路由
│   ├── auth/                # 认证 API
│   │   ├── [...nextauth]/  # NextAuth 处理器
│   │   ├── login/
│   │   ├── register/
│   │   └── logout/
│   ├── articles/            # 文章 API
│   │   ├── route.ts        # GET, POST /api/articles
│   │   ├── [id]/           # 文章详情
│   │   │   ├── route.ts    # GET, PATCH, DELETE
│   │   │   └── view/       # 浏览统计
│   │   └── stats/          # 文章统计
│   ├── blog/                # 博客 API
│   ├── user/                # 用户 API
│   ├── console/             # 控制台 API
│   ├── admin/               # 管理 API
│   ├── mail/                # 邮件 API
│   ├── help/                # 帮助 API
│   └── health/              # 健康检查
├── about/                    # 关于页面
│   ├── page.tsx
│   ├── cookies/
│   ├── privacy/
│   └── terms/
├── admin/                    # 管理后台
│   ├── page.tsx             # 后台首页
│   ├── layout.tsx           # 后台布局
│   ├── articles/            # 文章管理
│   ├── mail/                # 邮件管理
│   └── test/                # 测试页面
├── articles/                 # 文章模块
│   ├── page.tsx             # 文章列表
│   ├── [slug]/              # 文章详情
│   │   └── page.tsx
│   └── loading.tsx          # 加载状态
├── auth/                     # 认证页面
│   ├── login/
│   └── register/
├── blog/                     # 博客模块
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── console/                  # 用户控制台
│   ├── page.tsx             # 控制台首页
│   ├── layout.tsx           # 控制台布局
│   ├── articles/            # 文章管理
│   ├── profile/             # 个人资料
│   └── settings/            # 设置
├── help/                     # 帮助中心
│   └── page.tsx
├── pricing/                  # 价格页面
│   └── page.tsx
├── profile/                  # 个人中心
│   └── page.tsx
├── unauthorized/             # 未授权页面
│   └── page.tsx
├── layout.tsx                # 根布局
├── page.tsx                  # 首页
├── not-found.tsx             # 404 页面
├── error.tsx                 # 错误页面
└── loading.tsx               # 加载页面
```

**命名规范**:

- `page.tsx` - 页面组件
- `layout.tsx` - 布局组件
- `loading.tsx` - 加载组件
- `error.tsx` - 错误组件
- `route.ts` - API 路由
- `[param]` - 动态路由
- `(group)` - 路由组（不影响 URL）

---

### 2. src/features/ - 功能模块

按业务功能划分的模块，每个模块独立完整。

```bash
src/features/
├── auth/                     # 认证模块
│   ├── components/          # 认证相关组件
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── protected-route.tsx
│   │   └── unified-auth-provider.tsx
│   ├── hooks/               # 认证 Hooks
│   │   ├── useAuth.ts
│   │   ├── useLogin.ts
│   │   └── useProfile.ts
│   ├── services/            # 认证业务逻辑
│   │   ├── auth.service.ts
│   │   └── session.service.ts
│   ├── types/               # 类型定义
│   │   └── auth.types.ts
│   ├── validators/          # 数据验证
│   │   └── auth.validator.ts
│   ├── utils/               # 工具函数
│   ├── index.ts             # 统一导出
│   └── README.md            # 模块文档
├── articles/                 # 文章模块
│   ├── components/
│   │   ├── article-card.tsx
│   │   ├── article-editor.tsx
│   │   └── article-list.tsx
│   ├── hooks/
│   │   ├── useArticles.ts
│   │   ├── useArticle.ts
│   │   └── useArticleActions.ts
│   ├── services/
│   │   ├── article.service.ts
│   │   └── article-client.service.ts
│   ├── types/
│   │   └── article.types.ts
│   ├── validators/
│   │   └── article.validator.ts
│   └── index.ts
├── blog/                     # 博客模块
│   ├── components/
│   ├── services/
│   ├── types/
│   └── index.ts
├── user/                     # 用户模块
│   ├── components/
│   │   ├── profile-info-content.tsx
│   │   ├── profile-articles-content.tsx
│   │   └── profile-account-settings.tsx
│   ├── layout/
│   │   ├── profile-nav-tabs.tsx
│   │   ├── profile-content.tsx
│   │   └── user-info-sidebar.tsx
│   ├── hooks/
│   ├── services/
│   └── index.ts
├── console/                  # 控制台模块
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── index.ts
├── admin/                    # 管理模块
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── index.ts
├── mail/                     # 邮件模块
│   ├── services/
│   │   ├── email.service.ts
│   │   ├── template.service.ts
│   │   └── notification-service.ts
│   ├── templates/           # 邮件模板
│   └── index.ts
└── help/                     # 帮助模块
    ├── components/
    └── index.ts
```

**模块标准结构**:

```bash
feature/
├── components/      # UI 组件（可选）
├── hooks/           # React Hooks（可选）
├── services/        # 业务逻辑（必需）
├── types/           # TypeScript 类型（必需）
├── validators/      # 数据验证（可选）
├── utils/           # 工具函数（可选）
├── index.ts         # 统一导出（必需）
└── README.md        # 模块文档（推荐）
```

---

### 3. src/lib/ - 核心库

基础设施和核心功能。

```bash
src/lib/
├── auth/                     # 认证核心
│   ├── jwt.ts               # JWT 工具
│   └── session.ts           # Session 管理
├── database/                 # 数据库
│   ├── prisma.ts            # Prisma 客户端
│   └── connection.ts        # 数据库连接
├── logger/                   # 日志系统
│   ├── logger.ts            # 日志记录器
│   └── formatters.ts        # 日志格式化
├── errors/                   # 错误处理
│   ├── app-error.ts         # 应用错误
│   ├── error-handler.ts     # 错误处理器
│   └── error-codes.ts       # 错误码
├── cache/                    # 缓存（可选）
│   └── cache.ts
├── validators/               # 全局验证器
│   └── common.validator.ts
└── utils/                    # 核心工具
    ├── crypto.ts
    ├── date.ts
    └── string.ts
```

**核心库特点**:

- 无业务逻辑
- 高度可复用
- 稳定可靠
- 充分测试

---

### 4. src/shared/ - 共享资源

跨模块的共享组件和工具。

```bash
src/shared/
├── components/               # 共享组件
│   └── ui/                  # UI 组件库
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── toast.tsx
│       ├── badge.tsx
│       ├── avatar.tsx
│       ├── tabs.tsx
│       ├── select.tsx
│       ├── checkbox.tsx
│       ├── switch.tsx
│       ├── label.tsx
│       ├── skeleton.tsx
│       ├── alert-dialog.tsx
│       └── theme-toggle.tsx
├── layout/                   # 布局组件
│   ├── portal-header.tsx    # 门户页头
│   ├── portal-footer.tsx    # 门户页脚
│   ├── portal-layout.tsx    # 门户布局
│   ├── console-layout.tsx   # 控制台布局
│   ├── admin-layout.tsx     # 管理布局
│   ├── top-header.tsx       # 顶部标题栏
│   ├── sidebar.tsx          # 侧边栏
│   ├── breadcrumb.tsx       # 面包屑
│   ├── console-menu-config.ts
│   ├── admin-menu-config.ts
│   └── user-menu-dropdown.tsx
├── hooks/                    # 通用 Hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
├── lib/                      # 工具函数
│   └── utils.ts
├── types/                    # 全局类型
│   ├── api.types.ts
│   ├── common.types.ts
│   └── index.ts
└── utils/                    # 工具函数
    ├── cn.ts                # className 合并
    ├── format.ts            # 格式化
    └── validation.ts        # 验证
```

---

### 5. prisma/ - 数据库

数据库 Schema 和迁移文件。

```bash
prisma/
├── migrations/               # 迁移历史
│   ├── 20251026171734_init/
│   │   └── migration.sql
│   ├── 20251026181732_simplify_schema/
│   │   └── migration.sql
│   └── migration_lock.toml
├── schema.prisma             # 数据库 Schema
└── seed.cjs                  # 种子数据
```

**Schema 结构**:

```prisma
// 生成器配置
generator client {
  provider = "prisma-client-js"
}

// 数据源配置
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 数据模型
model User { ... }
model Article { ... }
```

---

### 6. docs/ - 项目文档

```bash
docs/
├── ARCHITECTURE.md             # 架构文档
├── DEPLOYMENT.md               # 部署文档
├── API.md                      # API 文档
└── README.md                   # 文档说明
```

---

## 配置文件

### package.json

```json
{
  "name": "ai-code-nextjs-starter",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "prisma db seed"
  },
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

### next.config.ts

```typescript
const config: NextConfig = {
  experimental: {
    reactCompiler: true  // React 编译器
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./src/shared/*"],
      "@features/*": ["./src/features/*"],
      "@lib/*": ["./src/lib/*"],
      "@logger": ["./src/lib/logger"]
    }
  }
}
```

### tailwind.config.ts

```typescript
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: { ... },
      borderRadius: { ... }
    }
  },
  plugins: [
    require("tailwindcss-animate")
  ]
};
```

### .eslintrc.json

```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### .env.example

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"

# OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

---

## 开发规范

### 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `ArticleCard.tsx` |
| Hook | camelCase + use 前缀 | `useArticles.ts` |
| Service | camelCase + .service | `article.service.ts` |
| Type | PascalCase + .types | `Article.types.ts` |
| Util | camelCase | `formatDate.ts` |
| Constant | UPPER_CASE | `API_ROUTES.ts` |

### 导入顺序

```typescript
// 1. React/Next.js
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. 第三方库
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

// 3. @/ 别名导入
import { Button } from '@shared/ui/button';
import { ArticleService } from '@features/articles';

// 4. 相对路径
import { formatDate } from './utils';
```

### 组件结构

```typescript
'use client'; // 如果是 Client Component

import React from 'react';

// Props 类型定义
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// 组件实现
export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();
  
  // 事件处理
  const handleClick = () => { ... };
  
  // 渲染
  return <div>{prop1}</div>;
}
```

### Service 结构

```typescript
export class ArticleService {
  // 静态方法
  static async findAll() { ... }
  
  static async findById(id: string) { ... }
  
  static async create(data: CreateArticleInput) { ... }
  
  static async update(id: string, data: UpdateArticleInput) { ... }
  
  static async delete(id: string) { ... }
}
```

---

## 路径别名

| 别名 | 实际路径 | 用途 |
|------|---------|------|
| `@/*` | `./src/*` | 源码根目录 |
| `@shared/*` | `./src/shared/*` | 共享资源 |
| `@features/*` | `./src/features/*` | 功能模块 |
| `@lib/*` | `./src/lib/*` | 核心库 |
| `@logger` | `./src/lib/logger` | 日志系统 |

**使用示例**:

```typescript
import { Button } from '@shared/ui/button';
import { ArticleService } from '@features/articles';
import { prisma } from '@lib/database/prisma';
import { logger } from '@logger';
```

---

## 模块依赖规则

```bash
┌─────────────────────────────────────┐
│          src/app/                   │ ← 可依赖所有层
├─────────────────────────────────────┤
│        src/features/                │ ← 可依赖 shared, lib
├─────────────────────────────────────┤
│         src/shared/                 │ ← 可依赖 lib
├─────────────────────────────────────┤
│          src/lib/                   │ ← 不依赖其他层
└─────────────────────────────────────┘
```

**依赖原则**:

- ✓ 上层可依赖下层
- ✗ 下层不可依赖上层
- ✗ 同层模块避免循环依赖

---

## 环境变量管理

### 开发环境

```bash
.env.local          # 本地开发（忽略提交）
.env.example        # 环境变量模板（提交）
```

### 生产环境

```bash
.env.production     # 生产环境配置
```

### 变量命名

```bash
# 数据库
DATABASE_URL

# 认证
NEXTAUTH_URL
NEXTAUTH_SECRET
JWT_SECRET

# 第三方服务
GOOGLE_CLIENT_ID
GITHUB_CLIENT_ID

# 应用配置
NEXT_PUBLIC_APP_URL    # 公开变量（客户端可访问）
```

---

## 代码组织最佳实践

### 1. 单一职责

每个文件/模块只负责一个功能。

### 2. 命名清晰

- 文件名描述功能
- 函数名动词开头
- 变量名语义化

### 3. 避免深层嵌套

```typescript
// ✗ 避免
src/features/articles/components/list/item/card/header/title.tsx

// ✓ 推荐
src/features/articles/components/article-card.tsx
```

### 4. 统一导出

每个模块提供 `index.ts` 统一导出。

```typescript
// features/articles/index.ts
export * from './components/article-card';
export * from './hooks/useArticles';
export * from './services/article.service';
export * from './types/article.types';
```

### 5. 类型定义

集中管理类型定义。

```typescript
// features/articles/types/article.types.ts
export interface Article { ... }
export interface CreateArticleInput { ... }
export interface UpdateArticleInput { ... }
```

---

**文档版本**: 1.0.0  
**维护者**: Template Team  
**更新日期**: 2025-10-01
