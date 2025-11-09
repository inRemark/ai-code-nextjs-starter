# 认证架构说明

## 概述

本项目使用 **NextAuth.js v4** 实现 Web 端认证，支持 OAuth 和邮箱密码登录。

## 认证方式

### 1. OAuth 登录

- ✅ **Google OAuth** - 通过 Google 账号登录
- ✅ **GitHub OAuth** - 通过 GitHub 账号登录

### 2. 邮箱密码登录

- ✅ 本地凭据认证（Credentials Provider）
- ✅ 密码加密存储（bcrypt）

## 核心组件

### NextAuth 配置

**位置**：`src/features/auth/services/next-auth.config.ts`

- JWT Session 策略
- OAuth Providers（Google, GitHub）
- Credentials Provider（邮箱密码）
- PrismaAdapter（账号自动关联）
- Session 有效期：7天

### 认证 Hook

**位置**：`src/features/auth/hooks/use-auth.ts`

```typescript
const { user, isLoading, isAuthenticated, login, logout, signIn } = useAuth();
```

封装了 NextAuth 的 `useSession`，提供统一的认证接口。

### 认证中间件

**位置**：`src/features/auth/middleware/auth.middleware.ts`

```typescript
// API 路由认证
export const GET = requireAuth(async (user, request) => {
  // user.id, user.email, user.role
});

// 角色检查
export const DELETE = requireRole(['ADMIN'], async (user, request) => {
  // 仅 ADMIN 可访问
});
```

### 路由保护

**页面级别**：`src/middleware.ts`

- 自动重定向未登录用户到 `/auth/login`
- 检查角色权限（admin/console 路由）

**组件级别**：`src/features/auth/components/protected-route.tsx`

```tsx
<ProtectedRoute requireAdmin>
  <AdminPanel />
</ProtectedRoute>
```

## 使用指南

### 前端登录

```tsx
import { useAuth } from '@features/auth/hooks/use-auth';

// 邮箱密码登录
const { login } = useAuth();
await login(email, password);

// OAuth 登录
import { signIn } from 'next-auth/react';
await signIn('google'); // 或 'github'

// 登出
const { logout } = useAuth();
await logout();
```

### API 路由认证

```typescript
// src/app/api/example/route.ts
import { requireAuth } from '@features/auth';

export const GET = requireAuth(async (user, request) => {
  return NextResponse.json({
    message: `Hello, ${user.name}!`,
    userId: user.id,
    role: user.role,
  });
});
```

### 角色权限

```typescript
import { requireRole } from '@features/auth';

// 仅 ADMIN 可访问
export const DELETE = requireRole(['ADMIN'], async (user, request) => {
  // 删除操作
});

// ADMIN 或 EDITOR 可访问
export const PUT = requireRole(['ADMIN', 'EDITOR'], async (user, request) => {
  // 编辑操作
});
```

## 数据库模型

### User 表

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // 本地认证密码（bcrypt加密）
  role          UserRole  @default(USER)
  emailVerified DateTime?
  image         String?
  
  // NextAuth Relations
  sessions      Session[]
  accounts      Account[]
}
```

### OAuth Account 自动关联

通过 `signIn` callback 实现：

- 相同邮箱自动关联到同一用户
- 支持同一用户绑定多个 OAuth 提供商

## 配置

### 环境变量（.env）

```bash
# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# GitHub OAuth  
GITHUB_CLIENT_ID="xxx"
GITHUB_CLIENT_SECRET="xxx"

# 数据库
DATABASE_URL="postgresql://..."
```

### OAuth 配置

详见：[docs/OAUTH_QUICKSTART.md](./OAUTH_QUICKSTART.md)

## 安全特性

- ✅ JWT Token 签名验证
- ✅ CSRF 保护（NextAuth 内置）
- ✅ 密码 bcrypt 加密
- ✅ Session 自动过期
- ✅ OAuth 状态验证
- ✅ HTTPS Only（生产环境）

## API 端点

### NextAuth 端点

- `POST /api/auth/signin/credentials` - 邮箱密码登录
- `GET /api/auth/signin/google` - Google OAuth
- `GET /api/auth/signin/github` - GitHub OAuth
- `GET /api/auth/signout` - 登出
- `GET /api/auth/session` - 获取 Session
- `GET /api/auth/csrf` - 获取 CSRF Token

### 自定义端点

- `GET /api/auth/me` - 获取当前用户信息

## 常见问题

### 如何添加新的 OAuth 提供商？

1. 安装对应的 Provider：`pnpm add next-auth`（已包含主流提供商）
2. 在 `next-auth.config.ts` 中添加 Provider
3. 添加环境变量（CLIENT_ID, CLIENT_SECRET）

### 如何自定义 Session 数据？

在 `next-auth.config.ts` 的 `jwt` 和 `session` callbacks 中修改。

### 如何实现"记住我"功能？

调整 `maxAge` 配置，默认 7 天。

## 下一步优化

- [ ] 实现 Email 验证流程
- [ ] 添加双因素认证（2FA）
- [ ] 实现密码重置功能
- [ ] 添加更多 OAuth 提供商（微信、Apple）
- [ ] 实现账号安全日志

---

**技术栈**：Next.js 15 + NextAuth.js v4 + Prisma + PostgreSQL
