# 多语言实现指南

## 📋 概览

本项目已完整实现中文（zh）、英文（en）、日文（ja）三语言支持。所有翻译文件已按 `features/*/locale/{language}.json` 结构组织，支持动态加载和 TypeScript 类型提示。

## 🏗️ 结构说明

### 翻译文件位置

```
src/
├── messages/                 # 全局翻译（common, nav, errors）
│   ├── zh.json              # 中文全局翻译
│   ├── en.json              # 英文全局翻译
│   └── ja.json              # 日文全局翻译
│
└── features/
    ├── home/locale/
    │   ├── zh.json          # 首页中文翻译
    │   ├── en.json          # 首页英文翻译
    │   └── ja.json          # 首页日文翻译
    │
    ├── about/locale/
    │   ├── zh.json          # 关于页中文翻译
    │   ├── en.json          # 关于页英文翻译
    │   └── ja.json          # 关于页日文翻译
    │
    ├── auth/locale/         # 认证翻译（已完成）
    ├── blog/locale/         # 博客翻译（已完成）
    ├── help/locale/         # 帮助翻译（已完成）
    └── articles/locale/     # 文章翻译（已完成）
```

## 🔧 配置详情

### 1. request.ts - 动态加载翻译

**文件**: `src/i18n/request.ts`

```typescript
const FEATURE_MODULES = ['auth', 'home', 'about', 'blog', 'help', 'articles'];

async function loadFeatureMessages(locale: string) {
  const baseMessages = (await import(`@/messages/${locale}.json`)).default;
  const mergedMessages = { ...baseMessages };

  for (const feature of FEATURE_MODULES) {
    try {
      const featureMessages = (await import(`@/features/${feature}/locale/${locale}.json`)).default;
      mergedMessages[feature] = featureMessages;
    } catch {
      console.warn(`Feature messages not found for ${feature}/${locale}`);
    }
  }

  return mergedMessages;
}
```

**关键特点**:
- ✅ 自动加载所有 feature 的翻译文件
- ✅ 路径已修正：`locale` （非 `locales`）
- ✅ 合并全局翻译和 feature 翻译
- ✅ 错误处理：缺失翻译文件时发出警告，不中断构建

## 📝 翻译内容结构

### home 特性翻译内容

```json
{
  "badge": "AI 友好的 Next.js 模板",
  "hero": { ... },
  "coreFeatures": { ... },
  "costSavings": { ... },
  "statistics": { ... },
  "techStack": { ... },
  "quickStart": { ... },
  "cta": { ... }
}
```

涵盖页面的所有主要部分：
- Hero 标题和描述
- 核心特性列表
- 成本节省对比数据
- 技术栈信息
- 快速开始步骤
- 行动呼吁 (CTA)

### about 特性翻译内容

```json
{
  "name": "AI Code Next.js Starter",
  "description": "为 AI 辅助开发优化的 Next.js 全栈模板",
  "mission": "...",
  "vision": "...",
  "values": [ ... ],
  "timeline": {
    "title": "发展历程",
    "events": [ ... ]
  },
  "pro": {
    "badge": "商业版",
    "title": "AI Code Next.js Starter Pro",
    ...
  }
}
```

## 🚀 在页面中使用翻译

### 方法 1: 客户端组件（推荐用于交互式页面）

```typescript
"use client";

import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
      <button>{tCommon('submit')}</button>
    </div>
  );
}
```

### 方法 2: 服务端组件（推荐用于 SSR 页面）

```typescript
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');
  const tCommon = await getTranslations('common');

  return (
    <div>
      <h1>{t('name')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

## 📋 完整翻译清单

### ✅ 已完成翻译

| Feature | 中文 | 英文 | 日文 | 状态 |
|---------|------|------|------|------|
| home | ✅ | ✅ | ✅ | 完成 |
| about | ✅ | ✅ | ✅ | 完成 |
| auth | ✅ | ✅ | ✅ | 完成 |
| blog | ✅ | ✅ | ✅ | 完成 |
| help | ✅ | ✅ | ✅ | 完成 |
| articles | ✅ | ✅ | ✅ | 完成 |

### 全局翻译 (common, nav, errors)

| 类别 | 中文 | 英文 | 日文 | 状态 |
|------|------|------|------|------|
| common | ✅ | ✅ | ✅ | 完成 |
| nav | ✅ | ✅ | ✅ | 完成 |
| errors | ✅ | ✅ | ✅ | 完成 |

## 🔄 URL 路由结构

```
/zh/              # 中文首页
/zh/about         # 中文关于页
/zh/blog          # 中文博客

/en/              # 英文首页
/en/about         # 英文关于页
/en/blog          # 英文博客

/ja/              # 日文首页
/ja/about         # 日文关于页
/ja/blog          # 日文博客
```

## 🔍 翻译键获取方式

### 1. 从全局翻译获取

```typescript
const t = useTranslations('common');
// 使用: t('appName'), t('loading'), t('cancel')

const tNav = useTranslations('nav');
// 使用: tNav('home'), tNav('about'), tNav('login')
```

### 2. 从 feature 翻译获取

```typescript
const t = useTranslations('home');
// 使用: t('badge'), t('hero.title'), t('coreFeatures.title')

const tAbout = useTranslations('about');
// 使用: tAbout('name'), tAbout('mission'), tAbout('timeline.title')
```

### 3. 嵌套键访问

```typescript
const t = useTranslations('home');

// 访问嵌套对象
t('hero.title')           // "最大化您的"
t('hero.titleHighlight')  // "AI 预算"
t('coreFeatures.title')   // "核心特性"

// 访问数组项目（推荐在组件中使用）
const features = t.raw('coreFeatures.items');
features.forEach(feature => {
  console.log(feature.title);
});
```

## 🎨 现代内容优化

### 首页 (Home) 翻译优化

当前翻译已优化为展示"AI 友好的 Next.js 模板"的核心价值：

✅ **Hero 部分**
- 强调 AI 预算最大化
- 突出时间、Token、金钱节省

✅ **核心特性**
- 成本优先设计
- 四层清晰架构
- AI 友好规范
- 开箱即用
- 契约驱动服务
- 部署即用

✅ **成本对比**
- 从零开发 vs 使用模板对比
- 具体数据：时间节省 68%、Token 节省 67%、成本节省 67%

✅ **技术栈**
- Next.js 15 + React 19
- Prisma ORM + PostgreSQL
- NextAuth v5
- React Query 缓存

✅ **快速开始**
- 克隆项目
- 本地开发
- 一键部署

### 关于页 (About) 翻译优化

✅ **公司信息**
- 完整的使命、愿景、价值观

✅ **发展历程**
- 2024年10月至2025年3月的6个关键事件
- 每个事件配有图标和详细描述

✅ **商业版推广**
- 高级组件
- 优先支持
- 企业级功能

## 🧪 验证检查清单

使用以下命令验证翻译文件完整性：

```bash
# 检查翻译文件加载
node -e "
const zh = require('./src/features/home/locale/zh.json');
const en = require('./src/features/home/locale/en.json');
const ja = require('./src/features/home/locale/ja.json');
console.log('✅ 所有翻译文件加载成功');
"

# 构建测试
npm run build

# 开发服务器
npm run dev
# 访问: http://localhost:3000/zh/
# 访问: http://localhost:3000/en/
# 访问: http://localhost:3000/ja/
```

## ⚙️ 添加新的 Feature 翻译

当需要添加新的功能模块时，按以下步骤操作：

1. **创建翻译文件**
   ```bash
   mkdir -p src/features/{feature}/locale
   touch src/features/{feature}/locale/{zh,en,ja}.json
   ```

2. **填充翻译内容**
   ```json
   {
     "title": "功能标题",
     "description": "功能描述"
   }
   ```

3. **更新 request.ts**
   ```typescript
   const FEATURE_MODULES = ['auth', 'home', 'about', 'blog', 'help', 'articles', '{feature}'];
   ```

4. **在组件中使用**
   ```typescript
   const t = useTranslations('{feature}');
   ```

## 🚀 部署注意事项

- ✅ 翻译文件在构建时打包，无运行时开销
- ✅ 静态生成：所有语言版本的页面都会被预渲染
- ✅ 支持 Vercel、Docker 等任何 Next.js 部署平台
- ✅ 无需额外环境变量配置

## 📚 参考文档

- [next-intl 官方文档](https://next-intl-docs.vercel.app/)
- [Next.js 国际化指南](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [项目中的 I18N_IMPLEMENTATION.md](./I18N_IMPLEMENTATION.md)

## 💡 最佳实践

1. **保持翻译一致**
   - 使用统一的术语表
   - 定期审核翻译质量

2. **组织翻译层级**
   - 全局翻译放在 `messages/`
   - 模块特定翻译放在 `features/*/locale/`

3. **类型安全**
   - 使用 `useTranslations()` 获得完整的类型提示
   - 避免字符串拼接翻译键

4. **性能优化**
   - 翻译文件已通过 next-intl 自动优化
   - 无需手动缓存处理

## 📞 常见问题

**Q: 翻译文件位置是 locale 还是 locales？**
A: 使用 `locale`（单数）。request.ts 已更正为 `@/features/{feature}/locale/{language}.json`

**Q: 新增语言如何处理？**
A: 在 `src/i18n/routing.ts` 中添加语言，然后为所有翻译文件创建对应的语言版本

**Q: 如何处理动态翻译（如用户名）？**
A: 使用 `t.rich()` 或在代码中拼接，例如：
```typescript
const message = `${userName}, ${t('welcome')}`;
```

---

**最后更新**: 2024年11月4日
**状态**: ✅ 完全实现，已验证
