# 🚀 快速测试 OAuth 登录

## 当前状态 ✅

**已完成：**

- ✅ NextAuth 配置已添加 Google 和 GitHub OAuth provider
- ✅ 前端登录页面已启用 OAuth 按钮
- ✅ 环境变量模板已配置（`.env.example`）
- ✅ OAuth 配置验证脚本已创建

## 🎯 立即测试（3步）

### 步骤 1：配置环境变量

**快速方式（仅测试，跳过 OAuth）：**

```bash
# 复制环境变量模板
cp .env.example .env.local

# 生成 NextAuth 密钥
echo "NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\"" >> .env.local

# 启动开发服务器
pnpm dev
```

此时可以使用**邮箱/密码登录**，但 OAuth 按钮会显示为灰色（未配置）。

---

**完整方式（测试 OAuth）：**

1. **生成基础配置**

```bash
cp .env.example .env.local
```

2. **编辑 `.env.local`，添加必需配置**

```env
# NextAuth（必需）
NEXTAUTH_SECRET="在这里粘贴生成的密钥"
NEXTAUTH_URL="http://localhost:3000"
   
# 数据库（必需）
DATABASE_URL="postgresql://user:password@localhost:5432/your_db?schema=public"
```

生成密钥：

```bash
openssl rand -base64 32
```

3. **添加 OAuth 配置（按需选择）**

**选项 A：配置 Google OAuth**

```env
   GOOGLE_CLIENT_ID="你的客户端ID.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="你的客户端密钥"
```

获取方式：

- 访问 [Google Cloud Console](https://console.cloud.google.com/)
- 创建 OAuth 应用
- 回调 URL: `http://localhost:3000/api/auth/callback/google`

**选项 B：配置 GitHub OAuth**

```env
GITHUB_CLIENT_ID="你的客户端ID"
GITHUB_CLIENT_SECRET="你的客户端密钥"
```

获取方式：

- 访问 [GitHub Developer Settings](https://github.com/settings/developers)
- 创建 OAuth App
- 回调 URL: `http://localhost:3000/api/auth/callback/github`

---

### 步骤 2：验证配置

运行验证脚本检查配置是否正确：

```bash
pnpm verify:oauth
```

**预期输出示例：**

```bash
🔍 OAuth 配置验证

📋 必需配置：
  ✓ NEXTAUTH_SECRET: 已配置
  ✓ NEXTAUTH_URL: 已配置

🔐 OAuth 提供商：

  GOOGLE:
    ✓ GOOGLE_CLIENT_ID: 已配置
    ✓ GOOGLE_CLIENT_SECRET: 已配置
  → GOOGLE 登录已启用

  GITHUB:
    ○ GITHUB_CLIENT_ID: 未设置
    ○ GITHUB_CLIENT_SECRET: 未设置
  → GITHUB 未配置（可选）

📊 配置总结：
  ✓ 必需配置完整
  ✓ 已启用 OAuth 提供商: google

🔗 OAuth 回调 URL（在 OAuth 应用中配置）：
  GOOGLE:
    http://localhost:3000/api/auth/callback/google
```

---

### 步骤 3：启动并测试

```bash
# 启动开发服务器
pnpm dev
```

访问 `http://localhost:3000/auth/login`

**你会看到：**

1. **邮箱/密码登录表单**（始终可用）
2. **"或"分割线**
3. **OAuth 按钮**：
   - 🔴 **使用 Google 登录**（如果配置了 `GOOGLE_CLIENT_ID`）
   - ⚫ **使用 GitHub 登录**（如果配置了 `GITHUB_CLIENT_ID`）

**测试流程：**

1. 点击 OAuth 按钮
2. 跳转到 Google/GitHub 授权页面
3. 授权后自动回调
4. 登录成功后跳转到 `/console`

---

## 🔍 调试技巧

### 1. 查看 NextAuth 日志

开发模式下，终端会显示详细日志：

```bash
# 终端输出示例
🔍 Credentials authorization attempt: user@example.com
👤 User found: { id: '...', email: '...', role: 'USER' }
✅ Authorization successful for user: user@example.com
JWT token created: { sub: '...', role: 'USER', ... }
Session created: { user: { id: '...', email: '...', ... } }
```

### 2. 检查可用的 OAuth 提供商

访问：`http://localhost:3000/api/auth/providers`

```json
{
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oauth",
    "signinUrl": "http://localhost:3000/api/auth/signin/google",
    "callbackUrl": "http://localhost:3000/api/auth/callback/google"
  },
  "credentials": {
    "id": "credentials",
    "name": "Credentials",
    "type": "credentials"
  }
}
```

如果某个 provider 没出现，说明环境变量未配置。

### 3. 浏览器控制台

打开开发者工具 → Console，查看是否有错误信息。

---

## ⚠️ 常见问题

### Q: OAuth 按钮是灰色的？

**原因：** 环境变量未配置或未正确加载

**解决：**

```bash
# 1. 检查 .env.local 文件是否存在
ls -la .env.local

# 2. 验证配置
pnpm verify:oauth

# 3. 重启开发服务器（重要！）
# Ctrl+C 停止，然后重新运行
pnpm dev
```

### Q: 授权后显示 "Configuration Error"？

**原因：** `NEXTAUTH_SECRET` 或 `NEXTAUTH_URL` 配置错误

**解决：**

```bash
# 确保这两个变量在 .env.local 中
cat .env.local | grep NEXTAUTH
```

### Q: 授权后显示 "Callback URL mismatch"？

**原因：** OAuth 应用的回调 URL 配置错误

**解决：**
在 Google/GitHub OAuth 应用设置中，确保回调 URL 为：

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### Q: 数据库连接失败？

**确保：**

- PostgreSQL 正在运行
- `DATABASE_URL` 正确配置
- 已运行数据库迁移：
  
  ```bash
  pnpm prisma migrate dev
  pnpm prisma db seed
  ```

---

## 📚 详细文档

- **完整 OAuth 配置指南**: [`docs/OAUTH_SETUP.md`](./OAUTH_SETUP.md)
- **项目架构文档**: [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md)
- **NextAuth 官方文档**: https://next-auth.js.org/

---

## 🎉 成功标志

登录成功后，你应该能：

1. ✅ 看到控制台页面（`/console`）
2. ✅ 右上角显示用户头像/名称
3. ✅ 点击头像可以看到菜单（个人资料、设置、退出）
4. ✅ 访问 `/profile` 查看个人信息
5. ✅ 刷新页面后依然保持登录状态

---

**遇到问题？** 查看终端日志或浏览器控制台，大部分问题都会有明确的错误信息。

**配置成功！** 🚀 现在可以开始开发你的应用了。
