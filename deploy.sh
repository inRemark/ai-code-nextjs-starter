#!/bin/bash

# deploy.sh - Next.js 自动化部署脚本
# 放在 /var/www/your-nextjs-app/deploy.sh

set -e  # 遇错退出

APP_NAME="my-next-app"
PROJECT_PATH="/var/www/your-nextjs-app"
BRANCH="main"  # 或 master

echo "🚀 开始部署 $APP_NAME ..."

cd "$PROJECT_PATH"

# 1. 拉取最新代码
echo "🔄 拉取最新代码..."
git fetch origin
git reset --hard "origin/$BRANCH"

# 2. 安装生产依赖（跳过 devDependencies）
echo "📦 安装生产依赖..."
npm install --production

# 3. 构建项目
echo "🔨 构建 Next.js 应用..."
npm run build

# 4. 重启 PM2 应用
echo "♻️ 重启 PM2 应用..."
if pm2 list | grep -q "$APP_NAME"; then
  pm2 reload "$APP_NAME"
else
  pm2 start npm --name "$APP_NAME" -- start
fi

# 5. 清理旧日志（可选）
pm2 flush

echo "✅ 部署完成！应用已更新。"