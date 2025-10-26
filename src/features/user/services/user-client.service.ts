/**
 * User Feature - Client Service (Frontend)
 * 
 * 用户功能前端服务
 * 统一封装所有用户相关的 API 调用
 */

import type {
  UserProfile,
  UserSettings,
  UserStats,
  OAuthAccount,
  UpdateProfileInput,
  UpdateUserSettingsInput,
  ActivityQueryParams,
  ActivityListResponse,
  ConnectOAuthInput,
  AvatarUploadResponse,
} from '../types/user.types';

export class UserClientService {
  // ============================================
  // 用户资料相关
  // ============================================

  /**
   * 获取当前用户资料
   */
  static async getProfile(): Promise<UserProfile> {
    const response = await fetch('/api/user/profile');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch profile');
    }

    return response.json();
  }

  /**
   * 更新用户资料
   */
  static async updateProfile(input: UpdateProfileInput): Promise<UserProfile> {
    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  }

  /**
   * 上传头像
   */
  static async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/user/avatar', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload avatar');
    }

    const data = await response.json();
    return data;
  }

  // ============================================
  // 用户设置相关
  // ============================================

  /**
   * 获取用户设置
   */
  static async getSettings(): Promise<UserSettings> {
    const response = await fetch('/api/user/settings');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch settings');
    }

    return response.json();
  }

  /**
   * 更新用户设置
   */
  static async updateSettings(input: UpdateUserSettingsInput): Promise<UserSettings> {
    const response = await fetch('/api/user/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update settings');
    }

    return response.json();
  }

  /**
   * 重置设置为默认值
   */
  static async resetSettings(): Promise<UserSettings> {
    const response = await fetch('/api/user/settings/reset', {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset settings');
    }

    return response.json();
  }

  // ============================================
  // 用户活动相关
  // ============================================

  /**
   * 获取用户活动列表
   */
  static async getActivities(params?: ActivityQueryParams): Promise<ActivityListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.set('limit', String(params.limit));
    }
    if (params?.offset) {
      queryParams.set('offset', String(params.offset));
    }
    if (params?.activityType) {
      queryParams.set('activityType', params.activityType.join(','));
    }
    if (params?.startDate) {
      queryParams.set('startDate', params.startDate.toISOString());
    }
    if (params?.endDate) {
      queryParams.set('endDate', params.endDate.toISOString());
    }

    const response = await fetch(`/api/user/activity?${queryParams.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch activities');
    }

    return response.json();
  }

  /**
   * 获取用户统计信息
   */
  static async getStats(): Promise<UserStats> {
    const response = await fetch('/api/user/stats');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch stats');
    }

    return response.json();
  }

  // ============================================
  // OAuth 账号关联
  // ============================================

  /**
   * 获取已关联的 OAuth 账号列表
   */
  static async getOAuthAccounts(): Promise<OAuthAccount[]> {
    const response = await fetch('/api/user/oauth');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch OAuth accounts');
    }

    const data = await response.json();
    return data.accounts;
  }

  /**
   * 连接 OAuth 账号
   */
  static async connectOAuth(input: ConnectOAuthInput): Promise<OAuthAccount> {
    const response = await fetch('/api/user/oauth/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to connect OAuth account');
    }

    const data = await response.json();
    return data.account;
  }

  /**
   * 断开 OAuth 账号连接
   */
  static async disconnectOAuth(accountId: string): Promise<void> {
    const response = await fetch(`/api/user/oauth/${accountId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to disconnect OAuth account');
    }
  }

  /**
   * 设置主要 OAuth 账号
   */
  static async setPrimaryOAuth(accountId: string): Promise<OAuthAccount> {
    const response = await fetch(`/api/user/oauth/${accountId}/primary`, {
      method: 'PUT',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to set primary OAuth account');
    }

    const data = await response.json();
    return data.account;
  }
}
