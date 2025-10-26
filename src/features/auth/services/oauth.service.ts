import prisma from '@/lib/database/prisma';
import { User } from '@prisma/client';

type OAuthAccount = {
  id: string;
  userId: string;
  provider: string;
  providerId: string;
  providerEmail?: string | null;
  providerName?: string | null;
  providerAvatar?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenExpiresAt?: Date | null;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class OAuthAccountService {
  // 自动账户关联（相同邮箱）
  async autoLinkAccount(
    email: string,
    provider: string,
    providerData: any
  ): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { oauthAccounts: true }
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // 检查是否已关联此OAuth提供商
    const existingOAuth = existingUser.oauthAccounts.find(
      (oa: any) => oa.provider === provider
    );

    if (existingOAuth) {
      // 更新现有OAuth账户信息
      await prisma.oAuthAccount.update({
        where: { id: existingOAuth.id },
        data: {
          providerEmail: email,
          providerName: providerData.name,
          providerAvatar: providerData.avatar,
          accessToken: providerData.accessToken,
          refreshToken: providerData.refreshToken,
          tokenExpiresAt: providerData.tokenExpiresAt,
          updatedAt: new Date(),
        }
      });
    } else {
      // 创建新的OAuth账户关联
      await prisma.oAuthAccount.create({
        data: {
          userId: existingUser.id,
          provider,
          providerId: providerData.providerId,
          providerEmail: email,
          providerName: providerData.name,
          providerAvatar: providerData.avatar,
          accessToken: providerData.accessToken,
          refreshToken: providerData.refreshToken,
          tokenExpiresAt: providerData.tokenExpiresAt,
        }
      });
    }

    return existingUser;
  }

  // 手动绑定OAuth账户
  async linkOAuthAccount(
    userId: string,
    provider: string,
    providerData: any
  ): Promise<void> {
    // 检查是否已关联此OAuth提供商
    const existingOAuth = await prisma.oAuthAccount.findFirst({
      where: {
        userId,
        provider,
      }
    });

    if (existingOAuth) {
      throw new Error(`Account already linked with ${provider}`);
    }

    await prisma.oAuthAccount.create({
      data: {
        userId,
        provider,
        providerId: providerData.providerId,
        providerEmail: providerData.email,
        providerName: providerData.name,
        providerAvatar: providerData.avatar,
        accessToken: providerData.accessToken,
        refreshToken: providerData.refreshToken,
        tokenExpiresAt: providerData.tokenExpiresAt,
      }
    });
  }

  // 解绑OAuth账户
  async unlinkOAuthAccount(
    userId: string,
    provider: string
  ): Promise<void> {
    const oauthAccount = await prisma.oAuthAccount.findFirst({
      where: {
        userId,
        provider,
      }
    });

    if (!oauthAccount) {
      throw new Error(`No ${provider} account linked`);
    }

    // 检查是否是唯一的登录方式
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { oauthAccounts: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 如果用户没有密码且只有一个OAuth账户，不能解绑
    if (!user.password && user.oauthAccounts.length === 1) {
      throw new Error('Cannot unlink the only authentication method');
    }

    await prisma.oAuthAccount.delete({
      where: { id: oauthAccount.id }
    });
  }

  // 获取用户的所有关联账户
  async getLinkedAccounts(userId: string): Promise<OAuthAccount[]> {
    return prisma.oAuthAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    });
  }

  // 检查邮箱是否已存在
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { oauthAccounts: true }
    });
  }

  // 刷新OAuth Token
  async refreshOAuthToken(
    userId: string,
    provider: string,
    newTokenData: any
  ): Promise<void> {
    await prisma.oAuthAccount.updateMany({
      where: {
        userId,
        provider,
      },
      data: {
        accessToken: newTokenData.accessToken,
        refreshToken: newTokenData.refreshToken,
        tokenExpiresAt: newTokenData.tokenExpiresAt,
        updatedAt: new Date(),
      }
    });
  }

  // 检查OAuth账户是否已存在
  async isOAuthAccountExists(
    provider: string,
    providerId: string
  ): Promise<boolean> {
    const account = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        }
      }
    });

    return !!account;
  }
}

// 导出单例实例
export const oauthAccountService = new OAuthAccountService();
