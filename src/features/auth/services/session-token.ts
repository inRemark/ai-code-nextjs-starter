import crypto from 'node:crypto';
import prisma from '@/lib/database/prisma';
import { User } from '@prisma/client';
import { logger } from '@logger';
export interface DeviceInfo {
  deviceType?: 'web' | 'ios' | 'android';
  deviceName?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface SessionData {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  deviceType?: string;
  deviceName?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 生成安全的Session Token
 * 使用crypto.randomBytes生成32字节随机数据，然后转换为base64url格式
 */
export function generateSessionToken(): string {
  const randomBytes = crypto.randomBytes(32);
  return `sess_${randomBytes.toString('base64url')}`;
}

/**
 * 创建新的Session记录
 * @param userId 用户ID
 * @param deviceInfo 设备信息
 * @returns Session数据
 */
export async function createSession(
  userId: string,
  deviceInfo?: DeviceInfo
): Promise<SessionData> {
  const sessionToken = generateSessionToken();
  
  // 根据设备类型设置不同的过期时间
  const expiresInDays = deviceInfo?.deviceType === 'web' ? 7 : 30;
  const expires = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
  
  const session = await prisma.userSession.create({
    data: {
      sessionToken,
      userId,
      expires,
      deviceType: deviceInfo?.deviceType || 'web',
      deviceName: deviceInfo?.deviceName,
      userAgent: deviceInfo?.userAgent,
      ipAddress: deviceInfo?.ipAddress,
    }
  });
  
  // 转换Prisma返回的数据以匹配SessionData接口
  return {
    id: session.id,
    sessionToken: session.sessionToken,
    userId: session.userId,
    expires: session.expires,
    deviceType: session.deviceType || undefined,
    deviceName: session.deviceName || undefined,
    userAgent: session.userAgent || undefined,
    ipAddress: session.ipAddress || undefined,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

/**
 * 验证Session Token并返回用户信息
 * @param sessionToken Session Token
 * @returns 用户信息，如果无效则返回null
 */
export async function validateSessionToken(sessionToken: string): Promise<User | null> {
  try {
    const session = await prisma.userSession.findUnique({
      where: { sessionToken },
      include: { user: true }
    });
    
    // 检查session是否存在、未过期且用户活跃
    if (
      session &&
      session.expires > new Date() &&
      session.user.isActive
    ) {
      return session.user;
    }
    
    // 如果session过期，删除它
    if (session && session.expires <= new Date()) {
      await prisma.userSession.delete({
        where: { id: session.id }
      });
    }
    
    return null;
  } catch (error) {
    logger.error('Session token validation error:', error);
    return null;
  }
}

/**
 * 删除指定的Session
 * @param sessionToken Session Token
 */
export async function deleteSession(sessionToken: string): Promise<void> {
  try {
    await prisma.userSession.deleteMany({
      where: { sessionToken }
    });
  } catch (error) {
    logger.error('Delete session error:', error);
    throw error;
  }
}

/**
 * 删除用户的所有Session
 * @param userId 用户ID
 */
export async function deleteUserSessions(userId: string): Promise<void> {
  try {
    await prisma.userSession.deleteMany({
      where: { userId }
    });
  } catch (error) {
    logger.error('Delete user sessions error:', error);
    throw error;
  }
}

/**
 * 删除过期的Session
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const result = await prisma.userSession.deleteMany({
      where: {
        expires: {
          lt: new Date()
        }
      }
    });
    
    return result.count;
  } catch (error) {
    logger.error('Cleanup expired sessions error:', error);
    throw error;
  }
}

/**
 * 获取用户的所有Session
 * @param userId 用户ID
 * @returns Session列表
 */
export async function getUserSessions(userId: string): Promise<SessionData[]> {
  try {
    const sessions = await prisma.userSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
  // 转换Prisma返回的数据以匹配SessionData接口
  return sessions.map(session => ({
    id: session.id,
    sessionToken: session.sessionToken,
    userId: session.userId,
    expires: session.expires,
    deviceType: session.deviceType || undefined,
    deviceName: session.deviceName || undefined,
    userAgent: session.userAgent || undefined,
    ipAddress: session.ipAddress || undefined,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  }));
  } catch (error) {
    logger.error('Get user sessions error:', error);
    throw error;
  }
}

/**
 * 刷新Session Token
 * @param oldSessionToken 旧的Session Token
 * @param deviceInfo 设备信息
 * @returns 新的Session数据
 */
export async function refreshSessionToken(
  oldSessionToken: string,
  deviceInfo?: DeviceInfo
): Promise<SessionData | null> {
  try {
    // 验证旧token
    const user = await validateSessionToken(oldSessionToken);
    if (!user) {
      return null;
    }
    
    // 生成新token
    const newSessionToken = generateSessionToken();
    const expiresInDays = deviceInfo?.deviceType === 'web' ? 7 : 30;
    const expires = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    
    // 更新session记录
    const updatedSession = await prisma.userSession.update({
      where: { sessionToken: oldSessionToken },
      data: {
        sessionToken: newSessionToken,
        expires,
        deviceType: deviceInfo?.deviceType,
        deviceName: deviceInfo?.deviceName,
        userAgent: deviceInfo?.userAgent,
        ipAddress: deviceInfo?.ipAddress,
        updatedAt: new Date(),
      }
    });
    
  // 转换Prisma返回的数据以匹配SessionData接口
  return {
    id: updatedSession.id,
    sessionToken: updatedSession.sessionToken,
    userId: updatedSession.userId,
    expires: updatedSession.expires,
    deviceType: updatedSession.deviceType || undefined,
    deviceName: updatedSession.deviceName || undefined,
    userAgent: updatedSession.userAgent || undefined,
    ipAddress: updatedSession.ipAddress || undefined,
    createdAt: updatedSession.createdAt,
    updatedAt: updatedSession.updatedAt,
  };
  } catch (error) {
    logger.error('Refresh session token error:', error);
    throw error;
  }
}

/**
 * 从请求头中提取设备信息
 * @param request NextRequest对象
 * @returns 设备信息
 */
export function extractDeviceInfo(request: Request): DeviceInfo {
  const userAgent = request.headers.get('user-agent') || undefined;
  const deviceType = request.headers.get('x-device-type') as 'web' | 'ios' | 'android' | undefined;
  const deviceName = request.headers.get('x-device-name') || undefined;
  const ipAddress = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   undefined;
  
  return {
    deviceType,
    deviceName,
    userAgent,
    ipAddress,
  };
}
