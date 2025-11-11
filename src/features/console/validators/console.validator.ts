import { z } from 'zod';

export const addFavoriteSchema = z.object({
  comparisonId: z.string().min(1, '对比ID不能为空'),
});

export const removeFavoriteSchema = z.object({
  id: z.string().min(1, '收藏ID不能为空'),
});

export const updateNotificationSettingsSchema = z.object({
  emailNotifications: z.object({
    enabled: z.boolean().optional(),
    newsletter: z.boolean().optional(),
    updates: z.boolean().optional(),
    comments: z.boolean().optional(),
    mentions: z.boolean().optional(),
  }).optional(),
  pushNotifications: z.object({
    enabled: z.boolean().optional(),
    articles: z.boolean().optional(),
    comments: z.boolean().optional(),
  }).optional(),
  preferences: z.object({
    frequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
    digest: z.boolean().optional(),
  }).optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;
export type RemoveFavoriteInput = z.infer<typeof removeFavoriteSchema>;
export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
