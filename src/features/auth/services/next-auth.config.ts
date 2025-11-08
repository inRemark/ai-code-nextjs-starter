import NextAuth, { NextAuthOptions } from 'next-auth';
import { UserRole } from '@shared/types/user';
import { logger } from '@logger';
// NextAuth 类型扩展已移至 @features/auth/types/next-auth.d.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { verifyPassword } from './auth.service';
import prisma from '@/lib/database/prisma';

export const authConfig: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7天
  },
  providers: [
    // OAuth提供商：需要时在环境变量中配置并取消注释
    // 参考文档 Phase 6 了解如何启用OAuth
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          if (process.env.NODE_ENV === 'development') {
            logger.warn('🔍 Credentials authorization attempt:', credentials.email);
          }
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          });

          if (process.env.NODE_ENV === 'development') {
            logger.warn('👤 User found:', user ? { 
              id: user.id, 
              email: user.email, 
              hasPassword: !!user.password,
              role: user.role 
            } : null);
          }

          if (!user || !user.password) {
            if (process.env.NODE_ENV === 'development') {
              logger.warn('❌ User not found or no password');
            }
            return null;
          }

          const isValidPassword = await verifyPassword(
            credentials.password as string,
            user.password
          );

          if (process.env.NODE_ENV === 'development') {
            logger.warn('🔐 Password valid:', isValidPassword);
          }

          if (!isValidPassword) {
            if (process.env.NODE_ENV === 'development') {
              logger.warn('❌ Invalid password');
            }
            return null;
          }

          if (process.env.NODE_ENV === 'development') {
            logger.warn('✅ Authorization successful for user:', user.email);
          }
          // NextAuth v4 database session 必须返回完整用户对象
          // 返回 NextAuth 需要的最小用户对象
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? '',
            role: user.role as UserRole,
          };
        } catch (error) {
          logger.error('💥 Credentials authorization error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // 自动账户关联逻辑和 JWT token 创建
    async signIn({ user, account, profile }) {
      // 按照架构文档，完全使用 JWT 策略
      if (!account || account.provider === 'credentials') {
        // 对于 Credentials Provider，确保用户已验证
        // NextAuth v4 会自动在 JWT 策略下创建 token
        return true;
      }

      const email = user.email || profile?.email;
      
      if (!email) {
        throw new Error('Email is required for OAuth login');
      }
      
      // 查找现有用户
      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { accounts: true }
      });
      
      if (existingUser) {
        // 检查是否已关联此OAuth提供商
        const existingAccount = existingUser.accounts.find(
          (acc) => acc.provider === account.provider
        );
        
        if (!existingAccount) {
          // 自动关联新的OAuth账户到现有用户
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            }
          });
        }
        user.id = existingUser.id;
      }
      
      return true;
    },
    async jwt({ token, user }) {
      // 初始登录时，将用户信息添加到 token 中
      if (user) {
        token.sub = user.id;
        // 安全地访问user对象的role属性，避免SonarQube警告
        token.role = ('role' in user && typeof user.role === 'string') ? user.role as UserRole : 'USER';
        token.email = user.email;
        token.name = user.name;
        // 添加调试日志
        if (process.env.NODE_ENV === 'development') {
          logger.warn('JWT token created:', token);
        }
      }
      // 添加调试日志
      if (process.env.NODE_ENV === 'development') {
        logger.warn('JWT token:', token);
      }
      return token;
    },
    async session({ session, token }) {
      // 在 JWT 策略下，我们需要从 token 中获取用户信息
      if (session.user && token) {
        // 类型安全地扩展 session.user 字段
        Object.assign(session.user, {
          id: token.sub || '',
          role: (token.role as UserRole) || 'USER',
          email: token.email || '',
          name: token.name || '',
        });
        if (process.env.NODE_ENV === 'development') {
          logger.warn('Session callback user:', session.user);
        }
      }
      // 添加调试日志
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Session created:', session);
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
};

// NextAuth v4 导出方式
export default NextAuth(authConfig);