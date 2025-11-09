import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import prisma from '@/lib/database/prisma';
import { verifyPassword } from './auth.service';
import { logger } from '@logger';
import type { UserRole } from '@shared/types/user';

export const authConfig: any = {
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt' as const,
    maxAge: 7 * 24 * 60 * 60, // 7天
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
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
            where: { email: credentials.email as string },
          });

          if (process.env.NODE_ENV === 'development') {
            logger.warn('👤 User found:', user ? {
              id: user.id,
              email: user.email,
              hasPassword: !!user.password,
              role: user.role,
            } : null);
          }

          if (!user) {
            if (process.env.NODE_ENV === 'development') {
              logger.warn('❌ User not found');
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
      },
    }),
    // OAuth providers
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider === 'credentials') {
        return true;
      }

      const email = user.email || profile?.email;

      if (!email) {
        throw new Error('Email is required for OAuth login');
      }

      // 查找现有用户
      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { accounts: true },
      });

      if (existingUser) {
        // 检查是否已关联此OAuth提供商
        const existingAccount = existingUser.accounts.find(
          (acc: { provider: string }) => acc.provider === account.provider
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
            },
          });
        }
        user.id = existingUser.id;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = ('role' in user && typeof user.role === 'string')
          ? user.role as UserRole
          : 'USER';
        token.email = user.email;
        token.name = user.name;

        if (process.env.NODE_ENV === 'development') {
          logger.warn('JWT token created:', token);
        }
      }

      if (process.env.NODE_ENV === 'development') {
        logger.warn('JWT token:', token);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
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

      if (process.env.NODE_ENV === 'development') {
        logger.warn('Session created:', session);
      }

      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
