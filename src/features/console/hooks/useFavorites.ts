"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConsoleClientService } from '../services/console-client.service';

export function useFavorites(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['favorites', page, limit],
    queryFn: () => ConsoleClientService.getFavorites(page, limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comparisonId: string) =>
      ConsoleClientService.addFavorite(comparisonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favoriteId: string) =>
      ConsoleClientService.removeFavorite(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}
