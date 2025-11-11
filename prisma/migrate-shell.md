# Prisma migration docs

## Generate migrate file

> don't use `prisma migrate dev` in production env.

```bash
npx prisma migrate dev --name add_user_role
```

## Staging env

```bash
npx prisma migrate deploy
```

## Production

### deploy.sh

```bash
echo "📦 Install dependencies..."
npm install --production

echo "🔄 Start migrate..."
npx prisma migrate deploy  # ← 关键！安全地应用迁移

echo "🔨 Build app..."
npm run build

echo "♻️ Restart service..."
pm2 reload my-next-app
```

## Dockerfile

```bash
# RUN npm install --production && \
#     npx prisma migrate deploy && \
#     npm run build

#Perform migration before CMD (run every time the container starts, but Prisma skips applied ones)
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
```

## Reverse migration

```bash
npx prisma migrate dev --name revert_add_user_role
```

### Production Migration Checklist

- Local modification of schema.prisma
- Run Prisma migrate dev locally -- name xxx
- Submit prism/migrations/to Git
- Deploy and validate in the Staging environment
- Backup production database
- Execute NPX Prisma Migration Deployment in the Production Deployment Process
- Verify application functionality&monitoring
