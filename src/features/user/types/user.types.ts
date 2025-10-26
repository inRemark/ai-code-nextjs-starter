/**
 * User Feature - Type Definitions
 * 
 * 用户模块类型定义
 * 整合用户资料、设置、活动等所有用户相关功能
 */

// ============================================
// 用户资料
// ============================================

export interface UserProfile {
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

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  company?: string;
  department?: string;
  title?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  theme?: 'light' | 'dark' | 'system';
}

// ============================================
// 用户设置
// ============================================

export interface UserSettings {
  id: string;
  userId: string;
  
  // 隐私设置
  privacy: PrivacySettings;
  
  // 通知设置
  notifications: NotificationSettings;
  
  // 工作流设置
  workflow: WorkflowSettings;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'team';
  showEmail: boolean;
  showPhone: boolean;
  showLastSeen: boolean;
}

export interface NotificationSettings {
  email: NotificationChannelSettings;
  browser: NotificationChannelSettings;
  mobile: NotificationChannelSettings;
}

export interface NotificationChannelSettings {
  enabled: boolean;
  emailSent: boolean;
  emailDelivered: boolean;
  emailOpened: boolean;
  systemUpdates: boolean;
  securityAlerts: boolean;
  weeklyReport: boolean;
}

export interface WorkflowSettings {
  defaultEmailTemplate: string;
  autoSaveInterval: number;
  defaultSendDelay: number;
}

export interface UpdateUserSettingsInput {
  privacy?: Partial<PrivacySettings>;
  notifications?: Partial<NotificationSettings>;
  workflow?: Partial<WorkflowSettings>;
}

// ============================================
// 用户活动
// ============================================

export interface UserActivity {
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

export type ActivityType =
  | 'VIEW_PROBLEM'
  | 'COMPARE_SOLUTIONS'
  | 'SUBMIT_REVIEW'
  | 'FAVORITE_COMPARISON'
  | 'UPDATE_PROFILE'
  | 'CHANGE_SETTINGS'
  | 'LOGIN'
  | 'LOGOUT';

export interface ActivityQueryParams {
  limit?: number;
  offset?: number;
  activityType?: ActivityType[];
  startDate?: Date;
  endDate?: Date;
}

export interface ActivityListResponse {
  activities: UserActivity[];
  total: number;
  hasMore: boolean;
}

// ============================================
// 用户统计
// ============================================

export interface UserStats {
  totalReviews: number;
  totalFavorites: number;
  totalActivities: number;
  totalPoints: number;
  profileCompletion: number;
  memberSince: Date;
  lastActive: Date;
}

// ============================================
// OAuth 账号关联
// ============================================

export interface OAuthAccount {
  id: string;
  userId: string;
  provider: OAuthProvider;
  providerId: string;
  providerEmail?: string;
  providerName?: string;
  providerAvatar?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OAuthProvider = 'google' | 'github' | 'wechat';

export interface ConnectOAuthInput {
  provider: OAuthProvider;
  code: string;
  redirectUri: string;
}

// ============================================
// 头像上传
// ============================================

export interface AvatarUploadResponse {
  avatarUrl: string;
  thumbnailUrl?: string;
}

// ============================================
// 用户偏好
// ============================================

export interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
}
