export interface DashboardStats {
  overview: {
    totalReviews: number;
    totalFavorites: number;
    totalActivities: number;
    averageRating: number;
  };
  recent: {
    reviews: RecentReview[];
    favorites: RecentFavorite[];
    activities: RecentActivity[];
  };
  activityStats: Record<string, number>;
}

export interface RecentReview {
  id: string;
  overallRating: number;
  createdAt: string;
  solution?: {
    id: string;
    name: string;
    slug: string;
  };
  problem?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface RecentFavorite {
  id: string;
  comparisonId: string;
  createdAt: string;
  comparison?: {
    id: string;
    solutionIds: string[];
    problem?: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

export interface RecentActivity {
  id: string;
  activityType: string;
  targetType?: string;
  targetId?: string;
  createdAt: string;
}

export interface FavoriteComparison {
  id: string;
  comparisonId: string;
  createdAt: string;
  comparison: {
    id: string;
    problem: {
      id: string;
      title: string;
      slug: string;
      category?: {
        id: string;
        name: string;
        slug: string;
      };
    };
    solutionIds: string[];
    user?: {
      name: string;
      email: string;
    };
  };
}

export interface NotificationSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  reviewReminders: boolean;
  comparisonUpdates: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationSettingsInput {
  emailNotifications?: boolean;
  reviewReminders?: boolean;
  comparisonUpdates?: boolean;
}

// Activity types
export interface UserActivity {
  id: string;
  activityType: string;
  targetId?: string;
  targetType?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityStats {
  total: number;
  today: number;
  thisWeek: number;
  typeCounts: Record<string, number>;
}

export interface ActivityListResponse {
  activities: UserActivity[];
  total: number;
  pagination: PaginationData;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
