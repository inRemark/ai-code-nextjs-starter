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
