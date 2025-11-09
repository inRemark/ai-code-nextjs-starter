# OAuth 认证配置指南

本项目已集成 Google 和 GitHub OAuth 登录功能。本文档将指导你完成 OAuth 配置和测试。

## 📋 前置要求

- ✅ NextAuth 已配置（`src/features/auth/services/next-auth.config.ts`）
- ✅ 前端登录页面已启用 OAuth 按钮（`src/features/auth/components/login-form.tsx`）
- ✅ 数据库已运行并完成迁移

## 🔧 配置步骤

### 1. Google OAuth 配置

#### 1.1 创建 Google OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 转到 **凭据 (Credentials)** → **创建凭据** → **OAuth 客户端 ID**
5. 应用类型选择 **Web 应用**
6. 配置重定向 URI：

   ```bash
   http://localhost:3000/api/auth/callback/google  (本地开发)
   https://yourdomain.com/api/auth/callback/google (生产环境)
   ```

7. 保存并复制 **客户端 ID** 和 **客户端密钥**

#### 1.2 配置环境变量

在项目根目录创建 `.env.local` 文件（如果不存在）：

```env
# Google OAuth
GOOGLE_CLIENT_ID="你的Google客户端ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="你的Google客户端密钥"
```

---

### 2. GitHub OAuth 配置

#### 2.1 创建 GitHub OAuth 应用

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 **New OAuth App**
3. 填写应用信息：
   - **Application name**: 你的应用名称
   - **Homepage URL**: `http://localhost:3000` (本地) 或你的域名
   - **Authorization callback URL**:

     ```bash
     http://localhost:3000/api/auth/callback/github  (本地)
     https://yourdomain.com/api/auth/callback/github (生产)
     ```

4. 注册应用后，复制 **Client ID**
5. 点击 **Generate a new client secret** 并复制

#### 2.2 配置环境变量

在 `.env.local` 中添加：

```env
# GitHub OAuth
GITHUB_CLIENT_ID="你的GitHub客户端ID"
GITHUB_CLIENT_SECRET="你的GitHub客户端密钥"
```

---

### 3. 必需的基础配置

确保以下环境变量已配置：

```env
# NextAuth 配置
NEXTAUTH_SECRET="至少32个字符的随机字符串"
NEXTAUTH_URL="http://localhost:3000"  # 生产环境改为实际域名

# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/your_db?schema=public"
```

生成 `NEXTAUTH_SECRET` 的方法：

```bash
openssl rand -base64 32
```

---

## 🚀 测试 OAuth 登录

### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 pnpm
pnpm dev
```

### 测试流程

1. 访问 `http://localhost:3000/auth/login`
2. 你应该能看到三个登录选项：
   - 邮箱/密码登录（表单）
   - **使用 Google 登录**（红色边框按钮）
   - **使用 GitHub 登录**（灰色边框按钮）
3. 点击 OAuth 按钮，会跳转到对应的授权页面
4. 授权后会自动回调并登录
5. 登录成功后跳转到 `/console` 页面

### 调试模式

在开发环境下，NextAuth 会输出详细日志：

```typescript
// 查看终端输出，会显示：
// 🔍 Credentials authorization attempt: user@example.com
// 👤 User found: { id, email, role }
// ✅ Authorization successful
// JWT token created: {...}
// Session created: {...}
```

---

## 🔍 验证配置

### 检查 OAuth 提供商是否已启用

访问：`http://localhost:3000/api/auth/providers`

你应该看到类似以下的响应：

```json
{
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oauth",
    "signinUrl": "http://localhost:3000/api/auth/signin/google",
    "callbackUrl": "http://localhost:3000/api/auth/callback/google"
  },
  "github": {
    "id": "github",
    "name": "GitHub",
    "type": "oauth",
    "signinUrl": "http://localhost:3000/api/auth/signin/github",
    "callbackUrl": "http://localhost:3000/api/auth/callback/github"
  },
  "credentials": {
    "id": "credentials",
    "name": "Credentials",
    "type": "credentials"
  }
}
```

如果某个 provider 没有出现，检查对应的环境变量是否正确配置。

---

## 📝 OAuth 工作原理

### Web 端流程（已实现 ✅）

```bash
用户点击 OAuth 按钮
    ↓
NextAuth 重定向到 Google/GitHub 授权页面
    ↓
用户授权
    ↓
OAuth 提供商回调到 /api/auth/callback/{provider}
    ↓
NextAuth 自动处理：
  - 验证授权码
  - 获取用户信息
  - 查找/创建数据库用户
  - 关联 OAuth 账户（Account 表）
  - 创建 JWT session
    ↓
返回 HTTP-only cookie
    ↓
前端自动跳转到 /console
```

### 移动端流程（计划实现 🚧）

```bash
移动端调用 /api/auth/mobile/oauth/initiate
    ↓
后端返回授权 URL 和 state
    ↓
移动端打开 WebView/浏览器
    ↓
用户授权
    ↓
回调到 /api/auth/mobile/oauth/callback
    ↓
生成一次性交换 token
    ↓
返回 deep link: myapp://oauth/success?token=xxx
    ↓
移动端调用 /api/auth/mobile/oauth/exchange
    ↓
返回长期 Bearer token
```

---

## 🔒 安全注意事项

### 生产环境检查清单

- [ ] 使用 HTTPS（必需！）
- [ ] 设置正确的 `NEXTAUTH_URL`（必须是完整的 HTTPS URL）
- [ ] 在 OAuth 应用中配置正确的回调 URL
- [ ] 使用强随机的 `NEXTAUTH_SECRET`（至少 32 字符）
- [ ] 不要在前端代码中暴露 `CLIENT_SECRET`
- [ ] 在 OAuth 应用中限制允许的域名
- [ ] 启用 CSRF 保护（NextAuth 默认已启用）

### 账户关联逻辑

当用户使用 OAuth 登录时：

1. 如果 email 已存在于数据库 → 自动关联到现有用户
2. 如果 email 不存在 → 创建新用户
3. 支持同一用户关联多个 OAuth 账户（Google + GitHub）

相关代码：`src/features/auth/services/next-auth.config.ts` 的 `signIn` callback

---

## 🐛 常见问题

### Q1: 点击 OAuth 按钮没有反应

**检查：**

- 浏览器控制台是否有报错
- 环境变量是否正确加载（重启开发服务器）
- OAuth 应用的回调 URL 是否正确

### Q2: 授权后显示 "Error: Configuration"

**原因：** NextAuth 配置错误

**解决：**

- 检查 `NEXTAUTH_SECRET` 是否设置
- 检查 `NEXTAUTH_URL` 是否与实际访问的 URL 一致
- 检查数据库连接是否正常

### Q3: 授权后显示 "Email is required for OAuth login"

**原因：** OAuth 提供商返回的 profile 中没有 email

**解决：**

- Google: 确保在 OAuth 配置中请求了 email scope
- GitHub: 确保用户的 email 是公开的，或在 OAuth 应用中请求 `user:email` scope

### Q4: 数据库表缺失（Account/Session）

**解决：**

```bash
# 运行 Prisma 迁移
npx prisma migrate dev

# 或重新生成 Prisma Client
npx prisma generate
```

---

## 📚 相关文档

- [NextAuth.js 官方文档](https://next-auth.js.org/)
- [Google OAuth 文档](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth 文档](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps)
- 项目架构文档：`docs/ARCHITECTURE.md`

---

## 🎯 下一步

OAuth 验证通过后，可以继续：

1. **添加更多 OAuth 提供商**
   - Apple Sign In
   - Microsoft
   - WeChat（中国用户）

2. **实现移动端 OAuth 适配**
   - 创建 `/api/auth/mobile/oauth/*` 端点
   - 重构 `session-token.ts` 为 NextAuth 适配器
   - 支持移动端 Bearer Token

3. **增强安全性**
   - 实现 Session Token 哈希存储
   - 添加 Token 撤销机制
   - 实现设备管理功能

---

**配置完成！** 🎉

如有问题，请查看终端日志或参考 NextAuth 官方文档。
