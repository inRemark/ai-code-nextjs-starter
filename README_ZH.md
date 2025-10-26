# Ai-Code-Nextjs-Starter

Ai-Code-Nextjs-Starter 是一个基于Next.js + Prisma + PostgreSQL的 全栈构建模板，通过架构与数据流的系统优化，既加速开发，又智能减少 Token/请求/上下文消耗，为你同时节省时间与金钱。

## 项目使命

- **最大化 AI 预算**：在保证工程质量的前提下，显著降低提示与推理成本
- **快速可用**：认证、文章、个人中心、控制台开箱即用
- **简洁可扩展**：保持轻量核心，按需加功能

## 核心特性

- **以成本为目标**：从架构到数据流，系统性降低 Token/请求次数/上下文长度
- **四层清晰分工**：app / features / shared / lib → 任务边界清晰，AI 辅助改动面更小
- **服务端优先与缓存内置**：SSR/静态化 + revalidate + React Query 缓存，减少重复生成
- **响应体瘦身**：Prisma select/include 仅返回必要字段，压缩上下文与网络成本
- **契约驱动 Service**：统一 API/Service 设计，AI 输出更易复用，变更更可控
- **规范为 AI 友好**：路径别名与命名/导出规则统一，检索与补全更精准
- **部署即用**：Docker/Vercel 一键上云，环境变量模板与迁移流程简化"部署对话"成本

## 技术栈

- **前端**：Next.js 15（App Router）+ React 19 + TypeScript
- **数据**：Prisma ORM + PostgreSQL
- **认证**：NextAuth v5（JWT）
- **状态与表单**：React Query + react-hook-form + zod
- **UI**：Tailwind CSS + Radix UI
- **部署**：Docker + Nginx / Vercel

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 14

### 本地开发

```bash
pnpm install
```

```bash
# 安装依赖
pnpm install

# 环境变量（参考 .env.example）
cp .env.example .env.local

# 生成 Prisma Client
pnpm prisma generate

# 开发数据库迁移 + 种子数据
pnpm prisma migrate dev
pnpm prisma db seed

# 本地开发
pnpm dev
# 访问 http://localhost:3000
```

### 环境变量（必需）

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
JWT_SECRET="$(openssl rand -base64 32)"
```

## 目录分层（AI 友好）

```bash
src/
├─ app/        # 页面/路由(SSR/SSG、API)
├─ features/   # 业务模块(组件/hooks/services/types)
├─ shared/     # 通用UI/布局/工具
├─ lib/        # 核心库(数据库/认证/日志/错误)
prisma/        # 数据模型与迁移
docs/          # 架构/组织/部署文档
```

## 部署简要

### Docker（推荐）

```bash
# 启动（含 Postgres）
docker-compose up -d

# 生成 Client / 迁移 / 种子
docker-compose exec app pnpm prisma generate
docker-compose exec app pnpm prisma migrate deploy
docker-compose exec app pnpm prisma db seed

# 查看日志/重启
docker-compose logs -f app
docker-compose restart app
```

### Vercel（云部署）

```bash
# 推送代码自动触发部署
git push origin main

# 在 Vercel 控制台配置环境变量
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=...
JWT_SECRET=...
```

## 文档

- **架构文档**：[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **项目组织结构**：[docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)
- **部署指南**：[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 许可证

Apache License 2.0

---

**版本**: 1.0.0  
**更新**: 2025-10-01
