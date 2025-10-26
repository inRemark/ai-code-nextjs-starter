# User Feature 模块

用户功能模块，统一管理所有用户相关的功能，包括用户资料、设置、活动、OAuth 账号等。

## 📋 目录结构

```
user/
├── types/                # 类型定义
│   └── user.types.ts     # 用户相关类型
├── validators/           # 验证器
│   └── user.validator.ts # Zod 验证器
├── services/             # 服务层
│   └── user-client.service.ts  # 前端服务
├── hooks/                # React Hooks
│   └── useUser.ts        # 用户相关 Hooks
├── components/           # 组件
│   └── user-settings.tsx # 用户设置组件
├── index.ts              # 导出入口
└── README.md             # 说明文档
```

## 🎯 核心功能

### 1. 用户资料管理
- ✅ 获取用户资料
- ✅ 更新用户资料（姓名、手机、公司等）
- ✅ 头像上传
- ✅ 资料完整度计算

### 2. 用户设置管理
- ✅ 隐私设置（资料可见性控制）
- ✅ 通知设置（Email、Browser、Mobile 多渠道）
- ✅ 工作流偏好
- ✅ 设置重置

### 3. 用户活动追踪
- ✅ 活动列表查询
- ✅ 活动类型过滤
- ✅ 用户统计信息

### 4. OAuth 账号关联
- ✅ 查看已关联账号
- ✅ 连接新账号（Google、GitHub、微信）
- ✅ 断开账号连接
- ✅ 设置主要账号

## 📦 使用示例

### 1. 基础用法（获取和更新用户资料）

```typescript
import {
  useUserProfile,
  useUpdateProfile,
  useUploadAvatar,
} from '@features/user';

function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: uploadAvatar } = useUploadAvatar();

  const handleUpdateName = () => {
    updateProfile({
      name: '新名字',
    });
  };

  const handleAvatarUpload = (file: File) => {
    uploadAvatar(file);
  };

  if (isLoading) return <div>加载中...</div>;

  return (
    <div>
      <h1>{profile?.name}</h1>
      <p>{profile?.email}</p>
    </div>
  );
}
```

### 2. 用户设置（复用设置组件）

```typescript
import { UserSettingsComponent } from '@features/user';

function SettingsPage() {
  return (
    <div>
      <UserSettingsComponent 
        showTitle={true}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}
```

### 3. 手动管理设置

```typescript
import {
  useUserSettings,
  useUpdateUserSettings,
} from '@features/user';

function CustomSettingsPage() {
  const { data: settings } = useUserSettings();
  const { mutate: updateSettings } = useUpdateUserSettings();

  const handleToggleEmailNotifications = (enabled: boolean) => {
    updateSettings({
      notifications: {
        email: {
          enabled,
        },
      },
    });
  };

  return (
    <div>
      <Switch
        checked={settings?.notifications.email.enabled}
        onCheckedChange={handleToggleEmailNotifications}
      />
    </div>
  );
}
```

### 4. 用户活动

```typescript
import { useUserActivities, useUserStats } from '@features/user';

function ActivityPage() {
  const { data: activities } = useUserActivities({
    limit: 20,
    activityType: ['VIEW_PROBLEM', 'SUBMIT_REVIEW'],
  });

  const { data: stats } = useUserStats();

  return (
    <div>
      <h2>总评价数: {stats?.totalReviews}</h2>
      <ul>
        {activities?.activities.map((activity) => (
          <li key={activity.id}>{activity.activityType}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 5. OAuth 账号管理

```typescript
import {
  useOAuthAccounts,
  useConnectOAuth,
  useDisconnectOAuth,
} from '@features/user';

function OAuthAccountsPage() {
  const { data: accounts } = useOAuthAccounts();
  const { mutate: connect } = useConnectOAuth();
  const { mutate: disconnect } = useDisconnectOAuth();

  const handleConnect = (provider: 'google' | 'github' | 'wechat') => {
    // OAuth 流程需要先获取 code
    connect({
      provider,
      code: 'oauth_code',
      redirectUri: window.location.origin + '/auth/callback',
    });
  };

  return (
    <div>
      {accounts?.map((account) => (
        <div key={account.id}>
          <span>{account.provider}</span>
          <button onClick={() => disconnect(account.id)}>断开</button>
        </div>
      ))}
      <button onClick={() => handleConnect('google')}>连接 Google</button>
    </div>
  );
}
```

## 🔌 API Routes

### 用户资料相关

```
GET    /api/user/profile      # 获取用户资料
PATCH  /api/user/profile      # 更新用户资料
POST   /api/user/avatar       # 上传头像
```

### 用户设置相关

```
GET    /api/user/settings       # 获取用户设置
PATCH  /api/user/settings       # 更新用户设置
POST   /api/user/settings/reset # 重置设置
```

### 用户活动相关

```
GET    /api/user/activity      # 获取活动列表
GET    /api/user/stats         # 获取统计信息
```

### OAuth 账号相关

```
GET    /api/user/oauth               # 获取账号列表
POST   /api/user/oauth/connect       # 连接账号
DELETE /api/user/oauth/:id           # 断开账号
PUT    /api/user/oauth/:id/primary   # 设置主要账号
```

## 📊 类型定义

### UserProfile

```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  company?: string;
  department?: string;
  title?: string;
  bio?: string;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  profileCompletion: number;
}
```

### UserSettings

```typescript
interface UserSettings {
  id: string;
  userId: string;
  privacy: PrivacySettings;
  notifications: NotificationSettings;
  workflow: WorkflowSettings;
  createdAt: Date;
  updatedAt: Date;
}
```

### UserActivity

```typescript
interface UserActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  targetId?: string;
  targetType?: string;
  metadata: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
```

## 🎨 组件说明

### UserSettingsComponent

用户设置组件，支持多场景复用

**Props:**
- `className?: string` - 自定义样式
- `showTitle?: boolean` - 是否显示标题（默认 true）

**功能:**
- ✅ 隐私设置管理
- ✅ 邮件通知配置
- ✅ 浏览器通知配置
- ✅ 工作流偏好设置
- ✅ 自动保存反馈

## 🔧 Hooks 说明

### useUserProfile

获取用户资料

```typescript
const { data: profile, isLoading, error, refetch } = useUserProfile();
```

### useUpdateProfile

更新用户资料

```typescript
const { mutate: updateProfile, isPending } = useUpdateProfile();
updateProfile({ name: '新名字' });
```

### useUserSettings

获取用户设置

```typescript
const { data: settings, isLoading } = useUserSettings();
```

### useUpdateUserSettings

更新用户设置

```typescript
const { mutate: updateSettings } = useUpdateUserSettings();
updateSettings({
  notifications: {
    email: { enabled: true },
  },
});
```

### useUserActivities

获取用户活动列表

```typescript
const { data: activities } = useUserActivities({
  limit: 20,
  activityType: ['VIEW_PROBLEM'],
});
```

### useOAuthAccounts

获取 OAuth 账号列表

```typescript
const { data: accounts } = useOAuthAccounts();
```

## 🌟 复用场景

### 1. Console（用户控制台）
- 用户资料展示和编辑
- 设置管理
- 活动历史查看

### 2. Profile（个人主页）
- 公开资料展示
- 个人设置
- 账号管理

### 3. Admin（管理后台）
- 查看用户资料
- 管理用户设置
- 活动追踪

## 📝 开发指南

### 整合现有功能

本模块整合了以下现有功能：

1. **从 features/auth/hooks/useProfile.ts 迁移**
   - `useProfile()` → `useUserProfile()`
   - `usePersonalSettings()` → `useUserSettings()`
   - `useUserActivity()` → `useUserActivities()`

2. **从 features/profile/components 整合**
   - `ProfileAccountSettings` → 使用 `UserSettingsComponent`
   - `ProfileInfoContent` → 使用 `useUserProfile` + `useUpdateProfile`

3. **从 /api/user 接口适配**
   - `/api/user/profile` - 已存在
   - `/api/user/settings` - 已存在
   - `/api/user/activity` - 已存在

### 添加新的用户功能

1. 在 `types/user.types.ts` 添加类型
2. 在 `validators/user.validator.ts` 添加验证器
3. 在 `services/user-client.service.ts` 添加服务方法
4. 在 `hooks/useUser.ts` 创建对应 Hook
5. 如需要，创建复用组件

## 🔄 迁移指南

### 从旧 Hooks 迁移

```typescript
// ❌ 旧用法
import { useProfile } from '@features/auth/hooks/useProfile';
const { profile, updateProfile } = useProfile();

// ✅ 新用法
import { useUserProfile, useUpdateProfile } from '@features/user';
const { data: profile } = useUserProfile();
const { mutate: updateProfile } = useUpdateProfile();
```

### 从组件迁移

```typescript
// ❌ 旧用法
import { ProfileAccountSettings } from '@features/profile';

// ✅ 新用法
import { UserSettingsComponent } from '@features/user';
```

## ⚠️ 注意事项

1. **兼容性**: 保留 `features/profile` 组件供过渡使用，避免破坏性变更
2. **权限控制**: 所有 API 都需要通过 `requireAuth` 中间件验证
3. **数据一致性**: 更新操作会自动刷新相关缓存
4. **类型安全**: 所有 API 调用都经过 Zod 验证

## 🚀 下一步计划

- [ ] 添加更多用户偏好设置
- [ ] 实现用户导出数据功能
- [ ] 添加账户删除功能
- [ ] 支持更多 OAuth 提供商
- [ ] 实现用户标签系统

---

**版本**: v1.0.0  
**创建时间**: 2025-10-26  
**作者**: AICoder Team
