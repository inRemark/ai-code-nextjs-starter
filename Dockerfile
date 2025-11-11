# Use official Node.js LTS image (or replace with oven/bun:1 for Bun)
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# 复制 package 文件（利用 Docker 层缓存）
# Copy package files (leverage Docker layer caching)
COPY package*.json ./

# Install dependencies (production)
RUN npm ci --production

# 复制源码和文档
# Copy source code and docs
COPY . .
COPY docs ./docs

# Build Next.js application
RUN npm run build

# Use a smaller runtime image (optional: multi-stage build)
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user (security best practice)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=base --chown=nextjs:nodejs /app ./
COPY --from=base --chown=nextjs:nodejs /app/docs ./docs

# Expose port (Next.js default is 3000)
EXPOSE 3000

# Start command
CMD ["npm", "start"]