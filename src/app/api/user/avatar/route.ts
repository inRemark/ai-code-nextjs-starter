import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { requireAuth } from '@features/auth/middleware/auth.middleware';

/**
 * POST /api/user/avatar - Upload user avatar
 */
export const POST = requireAuth(async (user, request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' }, 
        { status: 400 }
      );
    }
    
    // check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
        }, 
        { status: 400 }
      );
    }
    
    // check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File too large. Maximum size is 2MB.' 
        }, 
        { status: 400 }
      );
    }
    
    // Use unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `avatar_${user.id}_${timestamp}.${extension}`;

    
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // ensure upload directory exists
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
      await mkdir(uploadDir, { recursive: true });
      
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      const avatarUrl = `/uploads/avatars/${fileName}`;
      
      return NextResponse.json({ 
        success: true,
        data: { avatarUrl },
        message: 'Avatar uploaded successfully' 
      });
    } catch (fileError) {
      logger.error('Error saving file:', fileError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save uploaded file' 
        }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    logger.error('Error uploading avatar:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload avatar' 
      }, 
      { status: 500 }
    );
  }
});
