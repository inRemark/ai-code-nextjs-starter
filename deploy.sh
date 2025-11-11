#!/bin/bash

# deploy.sh - Next.js Automated Deployment Script
# /var/www/your-nextjs-app/deploy.sh

# Exit immediately if a command exits with a non-zero status
set -e

APP_NAME="my-next-app"
PROJECT_PATH="/var/www/your-nextjs-app"
BRANCH="main"

echo "🚀 Start deploy $APP_NAME ..."

cd "$PROJECT_PATH"

# 1. Pull the latest code from the repository
echo "🔄 Pull latest code..."
git fetch origin
git reset --hard "origin/$BRANCH"

# 2. Install production dependencies
echo "📦 Install dependencies..."
npm install --production

# 3. Build the Next.js application
echo "🔨 Build Next.js app..."
npm run build

# 4. Restart the PM2 application
echo "♻️ Restart PM2 app..."
if pm2 list | grep -q "$APP_NAME"; then
  pm2 reload "$APP_NAME"
else
  pm2 start npm --name "$APP_NAME" -- start
fi

# 5. Clear PM2 logs
pm2 flush

echo "✅ Deployment of $APP_NAME completed successfully!"