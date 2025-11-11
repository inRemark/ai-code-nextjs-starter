#!/bin/bash

# database migration script

echo "🚀 Start database migration..."
echo ""

# 1. Create migration file
echo "📝 Create migration file..."
pnpm prisma migrate dev --name add_user_sessions_and_dual_auth

# 2. Generate Prisma Client
echo ""
echo "⚙️  Generate Prisma Client..."
pnpm prisma generate
