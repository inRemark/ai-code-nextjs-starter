"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConsoleClientService } from '../services/console-client.service';
import type { UpdateNotificationSettingsInput } from '../types/console.types';
export function useNotificationSettings() {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: () => ConsoleClientService.getNotificationSettings(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateNotificationSettingsInput) =>
      ConsoleClientService.updateNotificationSettings(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
  });
}
