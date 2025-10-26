import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ConsoleService {
  static async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      user,
      stats: {
        totalArticles: user._count.articles,
      },
    };
  }
}
