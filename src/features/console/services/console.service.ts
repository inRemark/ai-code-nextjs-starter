import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Notification settings type (used for mock data until database table is created)
export interface NotificationSettings {
  userId: string;
  emailNotifications: {
    enabled: boolean;
    newsletter: boolean;
    updates: boolean;
    comments: boolean;
    mentions: boolean;
  };
  pushNotifications: {
    enabled: boolean;
    articles: boolean;
    comments: boolean;
  };
  preferences: {
    frequency: 'immediate' | 'daily' | 'weekly';
    digest: boolean;
  };
  updatedAt?: Date;
}

// Type for partial updates (allows partial nested objects)
export type NotificationSettingsUpdate = {
  emailNotifications?: Partial<NotificationSettings['emailNotifications']>;
  pushNotifications?: Partial<NotificationSettings['pushNotifications']>;
  preferences?: Partial<NotificationSettings['preferences']>;
};

export class ConsoleService {
  /**
   * Get dashboard statistics
   * Returns mock data with various metrics for the dashboard
   */
  static async getDashboardStats(userId: string) {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate days since registration
    const daysSinceRegistration = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Return mock dashboard statistics
    return {
      overview: {
        totalArticles: user._count.articles,
        totalViews: user._count.articles * 156, // Mock: average 156 views per article
        totalLikes: user._count.articles * 23, // Mock: average 23 likes per article
        totalComments: user._count.articles * 12, // Mock: average 12 comments per article
      },
      recentActivity: {
        articlesThisMonth: Math.floor(user._count.articles * 0.3), // Mock: 30% published this month
        viewsThisWeek: user._count.articles * 45, // Mock: 45 views per article this week
        newFollowers: daysSinceRegistration > 30 ? 28 : daysSinceRegistration, // Mock followers
      },
      growth: {
        articleGrowth: '+12%', // Mock growth rate
        viewGrowth: '+23%',
        engagementRate: '8.5%',
      },
    };
  }

  static async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      user,
      stats: {
        totalArticles: user._count.articles,
      },
    };
  }

  /**
   * Get user notification settings
   * Returns default mock data since NotificationSettings table doesn't exist yet
   * When ready to persist, create a NotificationSettings table in Prisma schema
   */
  static async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Return default notification settings (mock data)
    // In production, this should query a NotificationSettings table
    return {
      userId,
      emailNotifications: {
        enabled: true,
        newsletter: true,
        updates: true,
        comments: false,
        mentions: true,
      },
      pushNotifications: {
        enabled: false,
        articles: false,
        comments: false,
      },
      preferences: {
        frequency: 'daily',
        digest: true,
      },
    };
  }

  /**
   * Update user notification settings
   * Currently returns the updated data without persisting to database
   * When ready to persist, create a NotificationSettings table in Prisma schema
   */
  static async updateNotificationSettings(
    userId: string, 
    settings: NotificationSettingsUpdate
  ): Promise<NotificationSettings> {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get current settings
    const currentSettings = await this.getNotificationSettings(userId);

    // Merge with updates
    const updatedSettings: NotificationSettings = {
      ...currentSettings,
      emailNotifications: settings.emailNotifications 
        ? { ...currentSettings.emailNotifications, ...settings.emailNotifications }
        : currentSettings.emailNotifications,
      pushNotifications: settings.pushNotifications
        ? { ...currentSettings.pushNotifications, ...settings.pushNotifications }
        : currentSettings.pushNotifications,
      preferences: settings.preferences
        ? { ...currentSettings.preferences, ...settings.preferences }
        : currentSettings.preferences,
      updatedAt: new Date(),
    };

    // In production, persist to database here
    // await prisma.notificationSettings.upsert({ ... })

    return updatedSettings;
  }
}
