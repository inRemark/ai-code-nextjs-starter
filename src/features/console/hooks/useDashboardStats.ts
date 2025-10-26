"use client";

import { useQuery } from '@tanstack/react-query';
import { ConsoleClientService } from '../services/console-client.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => ConsoleClientService.getDashboardStats(),
    staleTime: 1000 * 60 * 5,
  });
}
