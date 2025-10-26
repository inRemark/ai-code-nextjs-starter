"use client";

import { useQuery } from '@tanstack/react-query';
import { ConsoleClientService } from '../services/console-client.service';

export function useActivities(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['user-activities', page, limit],
    queryFn: () => ConsoleClientService.getActivities(page, limit),
    staleTime: 1000 * 60 * 2, // 2分钟
  });
}

export function useActivityStats() {
  return useQuery({
    queryKey: ['activity-stats'],
    queryFn: () => ConsoleClientService.getActivityStats(),
    staleTime: 1000 * 60 * 5, // 5分钟
  });
}
