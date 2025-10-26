import { z } from 'zod';

export const addFavoriteSchema = z.object({
  comparisonId: z.string().min(1, '对比ID不能为空'),
});

export const removeFavoriteSchema = z.object({
  id: z.string().min(1, '收藏ID不能为空'),
});

export const updateNotificationSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  reviewReminders: z.boolean().optional(),
  comparisonUpdates: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;
export type RemoveFavoriteInput = z.infer<typeof removeFavoriteSchema>;
export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
