/**
 * User Feature - React Hooks
 * 
 * 用户功能相关 Hooks
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserClientService } from '../services/user-client.service';
import type {
  UpdateProfileInput,
  UpdateUserSettingsInput,
  ActivityQueryParams,
  ConnectOAuthInput,
} from '../types/user.types';

// ============================================
// 用户资料 Hooks
// ============================================

/**
 * 获取用户资料
 */
export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => UserClientService.getProfile(),
    staleTime: 1000 * 60 * 5, // 5分钟
  });
}

/**
 * 更新用户资料
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      UserClientService.updateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
    },
  });
}

/**
 * 上传头像
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => UserClientService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}

// ============================================
// 用户设置 Hooks
// ============================================

/**
 * 获取用户设置
 */
export function useUserSettings() {
  return useQuery({
    queryKey: ['user', 'settings'],
    queryFn: () => UserClientService.getSettings(),
    staleTime: 1000 * 60 * 5, // 5分钟
  });
}

/**
 * 更新用户设置
 */
export function useUpdateUserSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserSettingsInput) =>
      UserClientService.updateSettings(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'settings'] });
    },
  });
}

/**
 * 重置用户设置
 */
export function useResetUserSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => UserClientService.resetSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'settings'] });
    },
  });
}

// ============================================
// 用户活动 Hooks
// ============================================

/**
 * 获取用户活动列表
 */
export function useUserActivities(params?: ActivityQueryParams) {
  return useQuery({
    queryKey: ['user', 'activities', params],
    queryFn: () => UserClientService.getActivities(params),
    staleTime: 1000 * 60, // 1分钟
  });
}

/**
 * 获取用户统计信息
 */
export function useUserStats() {
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: () => UserClientService.getStats(),
    staleTime: 1000 * 60 * 5, // 5分钟
  });
}

// ============================================
// OAuth 账号关联 Hooks
// ============================================

/**
 * 获取 OAuth 账号列表
 */
export function useOAuthAccounts() {
  return useQuery({
    queryKey: ['user', 'oauth-accounts'],
    queryFn: () => UserClientService.getOAuthAccounts(),
    staleTime: 1000 * 60 * 5, // 5分钟
  });
}

/**
 * 连接 OAuth 账号
 */
export function useConnectOAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ConnectOAuthInput) =>
      UserClientService.connectOAuth(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'oauth-accounts'] });
    },
  });
}

/**
 * 断开 OAuth 账号连接
 */
export function useDisconnectOAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) =>
      UserClientService.disconnectOAuth(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'oauth-accounts'] });
    },
  });
}

/**
 * 设置主要 OAuth 账号
 */
export function useSetPrimaryOAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) =>
      UserClientService.setPrimaryOAuth(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'oauth-accounts'] });
    },
  });
}
