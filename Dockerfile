# 使用官方 Node.js LTS 镜像（也可替换为 oven/bun:1 for Bun）
FROM node:20-alpine AS base

# 设置工作目录
WORKDIR /app

# 复制 package 文件（利用 Docker 层缓存）
COPY package*.json ./

# 安装依赖（生产环境）
RUN npm ci --production

# 复制源码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 使用更小的运行时镜像（可选：多阶段构建）
FROM node:20-alpine AS runner
WORKDIR /app

# 创建非 root 用户（安全最佳实践）
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=base --chown=nextjs:nodejs /app ./

# 暴露端口（Next.js 默认 3000）
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]