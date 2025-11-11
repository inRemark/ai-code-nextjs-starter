import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@features/auth/middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/user/profile - get user profile
 */
export const GET = requireAuth(async (user) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate profile completeness based on available fields
    const completionFields = ['name', 'image', 'emailVerified'];
    const completedFields = completionFields.filter(
      field => profile[field as keyof typeof profile]
    ).length;
    const profileCompletion = Math.round((completedFields / completionFields.length) * 100);

    return NextResponse.json({
      success: true,
      data: {
        ...profile,
        profileCompletion,
      },
    });
  } catch (error) {
    logger.error('Error fetching profile:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
});

/**
 * PATCH /api/user/profile - update user profile
 */
export const PATCH = requireAuth(async (user, request: NextRequest) => {
  try {
    const updates = await request.json();
    
    // Validate and filter allowed fields based on User schema
    const allowedFields = new Set(['name', 'image']);
    
    const filteredUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.has(key)) {
        filteredUpdates[key] = value;
      }
    }

    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...filteredUpdates,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
});
