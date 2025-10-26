// Components
export { StatCard } from './components/stat-card';
export { ActivityItem } from './components/activity-item';
export { ActivityList } from './components/activity-list';
export { ActivityStatsCards } from './components/activity-stats-cards';

// Hooks
export { useDashboardStats } from './hooks/useDashboardStats';
export { useFavorites, useAddFavorite, useRemoveFavorite } from './hooks/useFavorites';
export { useNotificationSettings, useUpdateNotificationSettings } from './hooks/useNotificationSettings';
export { useActivities, useActivityStats } from './hooks/useActivities';

// Services
export { ConsoleService } from './services/console.service';
export { ConsoleClientService } from './services/console-client.service';

// Utils
export * from './utils/format';

// Types
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
