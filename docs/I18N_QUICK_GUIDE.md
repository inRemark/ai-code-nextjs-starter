# 多语言国际化 - 快速参考指南

## 🌍 支持的语言

- **中文** (zh): `/zh/*`
- **英文** (en): `/en/*`
- **日文** (ja): `/ja/*`

## 📁 文件结构

```bash
src/
├── features/{feature}/locale/
│   ├── zh.json      ← 中文翻译
│   ├── en.json      ← 英文翻译
│   └── ja.json      ← 日文翻译
├── i18n/
│   ├── routing.ts   ← 语言配置
│   └── request.ts   ← 翻译加载逻辑
└── messages/        ← 全局翻译文件
    ├── zh.json
    ├── en.json
    └── ja.json
```

## 🔧 在组件中使用翻译

### 基本使用

```typescript
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('feature-name');
  
  return (
    <>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </>
  );
}
```

### 使用复杂数据结构（数组/对象）

```typescript
const t = useTranslations('home');

// 获取原始数据（不是渲染的文本）
const items = t.raw('coreFeatures.items') as Record<string, unknown>[];

return (
  <div>
    {items.map((item, index) => (
      <div key={index}>
        <h3>{item.title as string}</h3>
        <p>{item.description as string}</p>
      </div>
    ))}
  </div>
);
```

### 具有参数的翻译

```typescript
const t = useTranslations('common');

return <p>{t('welcome', { name: 'John' })}</p>;
```

**对应的翻译文件**:

```json
{
  "welcome": "Welcome, {name}!"
}
```

## ➕ 添加新feature的翻译

### 步骤1：创建翻译文件

在 `/src/features/{feature-name}/locale/` 创建：

- `zh.json` - 中文翻译
- `en.json` - 英文翻译
- `ja.json` - 日文翻译

### 步骤2：注册feature

在 `/src/i18n/request.ts` 中：

```typescript
const FEATURE_MODULES = ['home', 'about', 'your-new-feature'];
```

### 步骤3：在组件中使用

```typescript
const t = useTranslations('your-new-feature');
```

### 步骤4：验证

```bash
npm run build
node scripts/verify-i18n.js
```

## 📝 翻译文件结构示例

### 简单键值对

```json
{
  "title": "首页",
  "description": "欢迎来到我们的网站"
}
```

### 嵌套结构

```json
{
  "hero": {
    "title": "主标题",
    "subtitle": "副标题",
    "button": {
      "primary": "开始",
      "secondary": "了解更多"
    }
  }
}
```

### 数组结构

```json
{
  "features": [
    {
      "icon": "🚀",
      "title": "快速",
      "description": "闪电般的速度"
    }
  ]
}
```

## 🔍 验证翻译完整性

```bash
node scripts/verify-i18n.js
```

输出示例：

```bash
✅ home: 所有语言文件齐全 (zh, en, ja)
✅ about: 所有语言文件齐全 (zh, en, ja)
...
✅ 所有翻译文件验证通过！
```

## 🎯 URL路由模式

```bash
默认语言（中文）:
/zh/                   ← 首页
/zh/about              ← 关于页
/zh/blog               ← 博客

英文:
/en/                   ← 首页
/en/about              ← 关于页
/en/blog               ← 博客

日文:
/ja/                   ← 首页
/ja/about              ← 关于页
/ja/blog               ← 博客
```

## 🌐 SEO最佳实践

### hreflang标签

系统自动为每个页面生成hreflang标签，支持：

- Canonical链接
- Language alternates
- x-default标签

### 站点地图

- 自动生成：`/sitemap.xml`
- 包含所有语言版本
- 每条记录包含language alternates

### Robots规则

- 文件：`/public/robots.txt`
- 允许所有语言版本爬取
- 保护敏感路由

## 🔗 关键文件

| 文件 | 用途 |
|------|------|
| `/src/i18n/routing.ts` | 语言配置和默认语言 |
| `/src/i18n/request.ts` | 翻译加载和动态导入 |
| `/src/app/[locale]/layout.tsx` | SEO元数据和hreflang |
| `/src/app/sitemap.ts` | 多语言站点地图 |
| `/scripts/verify-i18n.js` | 翻译验证脚本 |

## ⚙️ 环境变量

### NEXT_PUBLIC_BASE_URL

用于生成正确的站点地图和hreflang URLs：

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=https://example.com
```

如果未设置，默认使用：`http://localhost:3001`

## 📊 常见问题

### Q: 如何修改默认语言？

A: 在 `/src/i18n/routing.ts` 中修改 `defaultLocale`：

```typescript
export const routing = {
  locales: ['zh', 'en', 'ja'],
  defaultLocale: 'zh'  // 修改这里
} as const;
```

### Q: 如何添加新的语言？

A:

1. 在所有翻译文件中添加新语言
2. 在 `/src/i18n/routing.ts` 的 `locales` 中添加语言代码
3. 运行 `npm run build`

### Q: 翻译内容更新后需要重新构建吗？

A:

- 开发环境（`npm run dev`）：自动刷新，无需重新构建
- 生产环境：需要重新构建并部署

### Q: 如何获取当前语言？

A:

```typescript
import { useLocale } from 'next-intl';

export default function Component() {
  const locale = useLocale(); // 'zh' | 'en' | 'ja'
  // ...
}
```

## 🚀 快速命令

```bash
# 开发服务器
npm run dev

# 生产构建
npm run build

# 验证翻译
node scripts/verify-i18n.js

# 启动生产服务器
npm run start
```

---

**需要帮助？** 查看完整的实现报告：[MULTILINGUAL_IMPLEMENTATION.md](./MULTILINGUAL_IMPLEMENTATION.md)
