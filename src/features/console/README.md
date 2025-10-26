# Console Feature Module

## 📚 模块概述

`features/console` 是 AICoder 项目的用户控制台功能模块，提供用户个人中心相关的业务逻辑和组件。

## 🎯 核心职责

- 管理用户Dashboard统计数据
- 管理用户收藏的对比会话
- 管理用户通知设置
- 管理用户活动记录
- 提供控制台相关组件和Hooks
- 提供统一的数据格式化工具

## 📁 目录结构

```
features/console/
├── components/
│   ├── stat-card.tsx              # 统计卡片组件
│   ├── activity-item.tsx          # 活动项组件
│   ├── activity-list.tsx          # 活动列表组件
│   └── activity-stats-cards.tsx   # 活动统计卡片
├── hooks/
│   ├── useDashboardStats.ts       # Dashboard统计Hook
│   ├── useFavorites.ts            # 收藏管理Hook
│   ├── useNotificationSettings.ts # 通知设置Hook
│   └── useActivities.ts           # 活动记录Hook
├── services/
│   ├── console.service.ts         # 后端Console服务
│   └── console-client.service.ts  # 前端Console服务
├── types/
│   └── console.types.ts           # 类型定义
├── validators/
│   └── console.validator.ts       # 参数验证
├── utils/
│   └── format.ts                  # 格式化工具函数
├── README.md                      # 模块文档
└── index.ts                       # 导出入口
```

## 🔧 使用方式

### 1. 使用Dashboard统计Hook

```tsx
import { useDashboardStats } from '@features/console/hooks/useDashboardStats';

function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>总评价: {stats.overview.totalReviews}</h2>
      <h2>总收藏: {stats.overview.totalFavorites}</h2>
    </div>
  );
}
```

### 2. 使用收藏管理Hooks

```tsx
import { useFavorites, useAddFavorite, useRemoveFavorite } from '@features/console/hooks/useFavorites';

function FavoritesPage() {
  const { data, isLoading } = useFavorites(1, 20);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleAdd = async (comparisonId: string) => {
    await addFavorite.mutateAsync(comparisonId);
  };

  const handleRemove = async (favoriteId: string) => {
    await removeFavorite.mutateAsync(favoriteId);
  };

  return (
    <div>
      {data?.favorites.map(fav => (
        <div key={fav.id}>
          <h3>{fav.comparison.problem.title}</h3>
          <button onClick={() => handleRemove(fav.id)}>删除</button>
        </div>
      ))}
    </div>
  );
}
```

### 3. 使用通知设置Hooks

```tsx
import { useNotificationSettings, useUpdateNotificationSettings } from '@features/console/hooks/useNotificationSettings';

function SettingsPage() {
  const { data: settings } = useNotificationSettings();
  const updateSettings = useUpdateNotificationSettings();

  const handleUpdate = async () => {
    await updateSettings.mutateAsync({
      emailNotifications: true,
      reviewReminders: false,
      comparisonUpdates: true,
    });
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={settings?.emailNotifications}
          onChange={handleUpdate}
        />
        邮件通知
      </label>
    </div>
  );
}
```

### 4. 使用Console组件

```tsx
import { 
  StatCard, 
  ActivityItem, 
  ActivityList, 
  ActivityStatsCards, 
  formatRelativeDate 
} from '@features/console';

function DashboardOverview() {
  const { data: stats } = useActivityStats();
  const { data: activitiesData } = useActivities(1, 10);

  return (
    <div>
      {/* 活动统计卡片 */}
      {stats && <ActivityStatsCards stats={stats} />}
      
      {/* 活动列表 */}
      {activitiesData && (
        <ActivityList 
          activities={activitiesData.activities} 
          isLoading={false}
        />
      )}
      
      {/* 单个统计卡片 */}
      <StatCard
        title="我的评价"
        value="25"
        description="总评价数"
        trend="平均 4.5 星"
        icon={<Star />}
      />
      
      {/* 单个活动项 */}
      <ActivityItem
        title="评价了 React 性能优化"
        description="方案: Next.js SSR"
        time="2小时前"
        status="完成"
        rating={5}
      />
    </div>
  );
}
```

### 5. 使用格式化工具

```tsx
import { 
  formatRelativeDate, 
  formatFullDate,
  formatShortDate,
  isToday,
  isThisWeek,
  formatNumber 
} from '@features/console';

function MyComponent() {
  const date = '2025-10-26T10:30:00Z';
  
  return (
    <div>
      <p>相对时间: {formatRelativeDate(date)}</p>
      <p>完整日期: {formatFullDate(date)}</p>
      <p>短日期: {formatShortDate(date)}</p>
      <p>是今天: {isToday(date) ? '是' : '否'}</p>
      <p>本周内: {isThisWeek(date) ? '是' : '否'}</p>
      <p>格式化数字: {formatNumber(1000000)}</p>
    </div>
  );
}
```

### 5. 后端使用Console服务

```tsx
import { ConsoleService } from '@features/console/services/console.service';

export async function GET(request: NextRequest) {
  const stats = await ConsoleService.getDashboardStats(userId);
  return NextResponse.json({ success: true, data: stats });
}
```

## 🌐 API 端点

### `/api/console/stats`
获取Dashboard统计数据

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalReviews": 25,
      "totalFavorites": 12,
      "totalActivities": 150,
      "averageRating": 4.5
    },
    "recent": {
      "reviews": [...],
      "favorites": [...],
      "activities": [...]
    },
    "activityStats": {
      "VIEW_PROBLEM": 50,
      "CREATE_REVIEW": 25
    }
  }
}
```

### `/api/console/favorites`
收藏管理

**GET - 获取收藏列表:**
Query Parameters:
- `page`: 页码（默认 1）
- `limit`: 每页数量（默认 20）

**POST - 添加收藏:**
```json
{
  "comparisonId": "xxx"
}
```

**DELETE - 删除收藏:**
Path Parameter: `id`

### `/api/console/settings`
通知设置管理

**GET - 获取设置**

**PUT - 更新设置:**
```json
{
  "emailNotifications": true,
  "reviewReminders": false,
  "comparisonUpdates": true
}
```

## 📦 导出内容

```typescript
// 组件
export { StatCard } from './components/stat-card';
export { ActivityItem } from './components/activity-item';
export { ActivityList } from './components/activity-list';
export { ActivityStatsCards } from './components/activity-stats-cards';

// Hooks
export { useDashboardStats } from './hooks/useDashboardStats';
export { useFavorites, useAddFavorite, useRemoveFavorite } from './hooks/useFavorites';
export { useNotificationSettings, useUpdateNotificationSettings } from './hooks/useNotificationSettings';
export { useActivities, useActivityStats } from './hooks/useActivities';

// 服务
export { ConsoleService } from './services/console.service';
export { ConsoleClientService } from './services/console-client.service';

// 工具
export { 
  formatRelativeDate, 
  formatFullDate, 
  formatShortDate, 
  isToday, 
  isThisWeek, 
  formatNumber 
} from './utils/format';

// 类型
export type {
  DashboardStats,
  RecentReview,
  RecentFavorite,
  RecentActivity,
  FavoriteComparison,
  NotificationSettings,
  UpdateNotificationSettingsInput,
  UserActivity,
  ActivityStats,
  ActivityListResponse,
  PaginationData,
} from './types/console.types';
```

## 🎨 组件特性

### StatCard

**Props:**
- `title`: 统计标题
- `value`: 统计值
- `description`: 描述文本
- `trend`: 趋势提示
- `icon`: 图标（可选）

**功能:**
- ✅ 统一的统计卡片样式
- ✅ 支持自定义图标
- ✅ 响应式布局

### ActivityItem

**Props:**
- `title`: 活动标题
- `description`: 活动描述
- `time`: 时间文本
- `status`: 状态标签
- `rating`: 评分（可选）

**功能:**
- ✅ 活动项展示
- ✅ 状态标签着色
- ✅ 可选评分显示

### ActivityList

**Props:**
- `activities`: 活动数组
- `isLoading`: 加载状态
- `emptyMessage`: 空状态提示

**功能:**
- ✅ 活动列表展示
- ✅ 加载骨架屏
- ✅ 空状态提示
- ✅ 自动图标和颜色映射
- ✅ metadata 数据展示

### ActivityStatsCards

**Props:**
- `stats`: 活动统计数据

**功能:**
- ✅ 4张统计卡片（总活动、今日、本周、平均每日）
- ✅ 自动计算平均值
- ✅ 响应式网格布局
- ✅ 彩色图标

## 📝 注意事项

1. **统计数据**默认缓存 5 分钟
2. **活动记录**默认缓存 2 分钟
3. **通知设置**默认缓存 10 分钟
4. 收藏和设置的修改会**自动刷新缓存**
5. 所有API调用都需要**用户认证**
6. 使用 `formatRelativeDate` 等工具函数统一日期格式
7. 组件支持加载状态和空状态处理

## 🔗 相关模块

- `features/activities` - 活动记录（依赖）
- `features/reviews` - 评价系统（依赖）
- `app/console` - 控制台页面（使用本模块）

## 📅 更新历史

- **2025-10-26**: 创建 console 模块
- **2025-10-26**: 添加Dashboard统计、收藏管理、通知设置功能
- **2025-10-26**: 添加统计卡片和活动项组件
- **2025-10-26**: ✅ P0任务完成 - 添加活动记录管理、统计组件、格式化工具
