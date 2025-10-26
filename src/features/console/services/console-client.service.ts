import type {
  DashboardStats,
  FavoriteComparison,
  NotificationSettings,
  UpdateNotificationSettingsInput,
  ActivityStats,
  ActivityListResponse,
  PaginationData,
} from '../types/console.types';

export class ConsoleClientService {
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch('/api/console/stats');
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }

    return data.data;
  }

  static async getFavorites(
    page = 1,
    limit = 20
  ): Promise<{ favorites: FavoriteComparison[]; total: number; pagination: PaginationData }> {
    const response = await fetch(`/api/console/favorites?page=${page}&limit=${limit}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch favorites');
    }

    return {
      favorites: data.data,
      total: data.pagination.total,
      pagination: data.pagination,
    };
  }

  static async addFavorite(comparisonId: string) {
    const response = await fetch('/api/console/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comparisonId }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to add favorite');
    }

    return data.data;
  }

  static async removeFavorite(favoriteId: string) {
    const response = await fetch(`/api/console/favorites/${favoriteId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to remove favorite');
    }

    return data;
  }

  static async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await fetch('/api/console/settings');
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch notification settings');
    }

    return data.data;
  }

  static async updateNotificationSettings(
    input: UpdateNotificationSettingsInput
  ): Promise<NotificationSettings> {
    const response = await fetch('/api/console/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to update notification settings');
    }

    return data.data;
  }

  static async getActivities(
    page = 1,
    limit = 20
  ): Promise<ActivityListResponse> {
    const response = await fetch(`/api/user/activity?page=${page}&limit=${limit}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch activities');
    }

    return {
      activities: data.data,
      total: data.pagination?.total || 0,
      pagination: data.pagination,
    };
  }

  static async getActivityStats(): Promise<ActivityStats> {
    const response = await fetch('/api/user/activity?stats=true');
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch activity stats');
    }

    return data.data;
  }
}
