# 生产环境部署指南

> 版本: 1.0.0  
> 更新时间: 2025-10-01

## 目录

- [前置要求](#前置要求)
- [Docker 部署](#docker-部署)
- [Vercel 部署](#vercel-部署)
- [数据库配置](#数据库配置)
- [环境变量](#环境变量)
- [域名和 SSL](#域名和-ssl)
- [故障排查](#故障排查)

## 前置要求

### 运行环境

- Node.js >= 18.0
- pnpm >= 8.0
- PostgreSQL >= 14.0
- Docker >= 20.10（可选）

### 必需服务

- PostgreSQL 数据库
- Vercel 账户（云部署）或服务器（自建部署）

---

## Docker 部署

### 1. 使用 Docker Compose

#### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: nextjs-postgres
    environment:
      POSTGRES_DB: nextjs_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    container_name: nextjs-app
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nextjs_app
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres

volumes:
  postgres_data:
```

#### 启动服务

```bash
# 启动
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 停止
docker-compose down
```

### 2. 数据库迁移

```bash
# 生成 Prisma Client
docker-compose exec app pnpm prisma generate

# 执行迁移
docker-compose exec app pnpm prisma migrate deploy

# 填充种子数据
docker-compose exec app pnpm prisma db seed
```

### 3. Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Vercel 部署

### 1. 连接 GitHub

1. 访问 [Vercel Dashboard](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. Vercel 自动检测 Next.js 项目

### 2. 配置环境变量

在 Vercel Dashboard → Settings → Environment Variables 添加：

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret
```

### 3. 部署

```bash
git push origin main
```

Vercel 自动触发部署。

---

## 数据库配置

### 云数据库服务

**Railway**

```bash
# 创建 Railway 项目 → 添加 PostgreSQL → 复制连接字符串
DATABASE_URL=postgresql://postgres:xxx@xxx.railway.app:5432/railway
```

**Supabase**

```bash
# 创建 Supabase 项目 → 获取连接字符串
DATABASE_URL=postgresql://postgres:xxx@xxx.supabase.co:5432/postgres
```

### 本地数据库

```bash
# Docker
docker run -d \
  --name postgres-dev \
  -e POSTGRES_DB=nextjs_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

### Prisma 迁移

```bash
# 开发环境
pnpm prisma migrate dev

# 生产环境
export DATABASE_URL="your-production-db-url"
pnpm prisma migrate deploy
pnpm prisma db seed
```

---

## 环境变量

### 必需变量

```bash
# 数据库
DATABASE_URL="postgresql://user:pass@host:5432/db"

# 认证
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
JWT_SECRET="$(openssl rand -base64 32)"
```

### 可选变量

```bash
# OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# 邮件
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### 生成密钥

```bash
openssl rand -base64 32
```

---

## 域名和 SSL

### Vercel 域名

1. Dashboard → Settings → Domains
2. 添加域名
3. 配置 DNS：

```bash
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Vercel 自动提供免费 SSL 证书。

### 自建服务器 SSL

```bash
# Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
sudo systemctl enable certbot.timer
```

---

## 故障排查

### 构建失败

```bash
pnpm build
pnpm tsc --noEmit
pnpm lint
```

### 数据库连接失败

```bash
echo $DATABASE_URL
pnpm prisma db pull
```

### 容器问题

```bash
docker-compose ps
docker-compose logs -f app
docker-compose restart app
```

### 端口占用

```bash
lsof -i :3000
kill -9 $(lsof -t -i:3000)
```

---

## 常用命令

```bash
# 开发
pnpm dev
pnpm build
pnpm start

# Prisma
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma studio

# Docker
docker-compose up -d
docker-compose down
docker-compose logs -f app
```

---

**文档版本**: 1.0.0  
**更新日期**: 2025-10-01
