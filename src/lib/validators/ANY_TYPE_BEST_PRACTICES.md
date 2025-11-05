# TypeScript `any` 类型最佳实践指南

## 问题概述

`any` 类型是 TypeScript 的"逃生通道"，但会导致以下问题：

- ❌ **类型安全性丧失**：编译器无法检查错误
- ❌ **IDE 智能提示失效**：无法获得自动完成和重构支持
- ❌ **代码可维护性下降**：增加重构风险和技术债
- ❌ **违反 ESLint 规则**：`@typescript-eslint/no-explicit-any`

---

## ✅ 最佳实践 - 5 大方案对比

### 方案 1：明确定义具体类型（最推荐）

**适用场景**：已知数据结构的情况

```typescript
// ❌ 不好 - 使用 any
const messages = useMessages() as Record<string, any>;

// ✅ 好 - 明确定义完整结构
interface TranslationMessages {
  'shared-layout'?: {
    footer?: Record<string, string>;
    header?: Record<string, string>;
  };
  'home'?: Record<string, string>;
  [key: string]: Record<string, string> | Record<string, Record<string, string>> | undefined;
}

const messages = useMessages() as TranslationMessages;
```

**优点**：
- 类型安全，编译器完全支持
- IDE 提示完整
- 文档清晰

---

### 方案 2：使用泛型（最灵活）

**适用场景**：需要处理多种数据结构

```typescript
// ✅ 使用泛型工具函数
function getNestedTranslations<T extends Record<string, unknown>>(
  messages: TranslationMessages,
  ...keys: string[]
): T {
  let current: unknown = messages;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return {} as T;
    }
  }
  
  return (current as T) || ({} as T);
}

// 使用
const footerTranslations = getNestedTranslations<Record<string, string>>(
  messages,
  'shared-layout',
  'footer'
);
```

**优点**：
- 代码复用性高
- 支持多种返回类型
- 类型推导精确

---

### 方案 3：使用类型守卫（最安全）

**适用场景**：需要在运行时验证数据类型

```typescript
// ✅ 定义类型守卫
function isTranslationRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((v) => typeof v === 'string')
  );
}

// 使用
const rawFooter = messages?.['shared-layout']?.['footer'];
if (isTranslationRecord(rawFooter)) {
  // 现在 rawFooter 的类型被缩窄为 Record<string, string>
  console.log(rawFooter.product); // ✅ IDE 有完整提示
}
```

**优点**：
- 运行时类型检查
- 完全类型安全
- 可以检测数据异常

---

### 方案 4：使用 `unknown` 而非 `any`

**适用场景**：必须处理未知类型时

```typescript
// ❌ 不好 - 使用 any
function processData(data: any): any {
  return data.value; // 无法检查
}

// ✅ 好 - 使用 unknown
function processData(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    const value = (data as Record<string, unknown>)['value'];
    return String(value);
  }
  return '';
}
```

**优点**：
- 强制进行类型检查
- 编译器会提醒类型窄化
- 更安全的默认行为

---

### 方案 5：使用 `as const` + 类型推导（最优雅）

**适用场景**：使用翻译 key 或配置常量

```typescript
// ✅ 定义不可变常量
const TRANSLATION_KEYS = {
  sharedLayout: {
    footer: {
      product: 'product',
      company: 'company',
      legal: 'legal',
    }
  }
} as const;

// 类型自动推导为字面量类型
type FooterKey = typeof TRANSLATION_KEYS.sharedLayout.footer;

// 使用 next-intl 的 useTranslations hook
const t = useTranslations('shared-layout.footer');
const product = t(TRANSLATION_KEYS.sharedLayout.footer.product);
```

**优点**：
- 0 个 `any` 类型
- 完整的类型推导
- 支持重构时自动更新 key

---

## 🎯 项目应用示例

### 之前（有 `any` 类型）

```typescript
export const PortalFooter: React.FC = () => {
  const messages = useMessages() as Record<string, any>; // ❌ any
  const sharedLayoutMessages = messages['shared-layout'] || {};
  const footerTranslations = (sharedLayoutMessages['footer'] || {}) as Record<string, string>; // ❌ 冗余断言
};
```

### 之后（完全类型安全）

```typescript
import { TranslationMessages, getNestedTranslations } from '@/lib/validators/translation-helper';

export const PortalFooter: React.FC = () => {
  const messages = useMessages() as TranslationMessages;
  const footerTranslations = getNestedTranslations<Record<string, string>>(
    messages,
    'shared-layout',
    'footer'
  ); // ✅ 类型完全明确，无 any，无冗余断言
};
```

---

## 📋 ESLint 规则配置

确保项目中启用以下规则来防止 `any` 类型：

```javascript
// eslint.config.js
export default [
  {
    rules: {
      // 禁止使用 any 类型
      '@typescript-eslint/no-explicit-any': 'error',
      
      // 消除不必要的类型断言
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      
      // 不允许隐式的 any
      '@typescript-eslint/no-implicit-any-catch': 'error',
    }
  }
];
```

---

## 🔍 快速检查清单

在提交代码前，检查以下项：

- [ ] 没有使用 `as any`
- [ ] 没有使用 `Record<string, any>`
- [ ] 没有使用 `: any` 参数类型
- [ ] 没有使用 `let x: any`
- [ ] 如果确实需要任何类型，用 `unknown` 替代
- [ ] 使用了类型守卫进行窄化
- [ ] 所有接口都明确定义了属性类型

---

## 🛠️ 相关工具函数

项目中已提供以下工具函数（在 `@/lib/validators/translation-helper.ts`）：

1. **`getNestedTranslations<T>()`** - 安全访问嵌套翻译
2. **`getTranslation()`** - 获取单个翻译值
3. **`isTranslationRecord()`** - 类型守卫函数
4. **`isValidTranslationMessages()`** - 验证消息结构

---

## 参考资源

- [TypeScript any Type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)
- [ESLint no-explicit-any Rule](https://typescript-eslint.io/rules/no-explicit-any/)
- [TypeScript Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
