import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/prisma';
import { hashPassword } from '@features/auth/services/auth.service';
import { AuthResponse } from '@features/auth/types/auth.types';
import { registerApiSchema } from '@/features/auth/validators/auth';
import { ZodError } from 'zod';

// user registration - POST /api/auth/register
export async function POST(request: NextRequest) {
  let body: unknown;
  
  try {
    body = await request.json();

    // use Zod Schema to validate input (no need for confirmPassword)
    const { email, password, name } = registerApiSchema.parse(body);

    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // generate name from email (take the part before @)
    const emailName = email.split('@')[0];
    
    // create new user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || emailName,
        password: hashedPassword,
        role: 'USER', // default role is user
      },
    });

    // set response (no longer generate JWT token)
    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    // Zod validation error
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      logger.error('Zod validation error:', {
        path: firstError.path,
        message: firstError.message,
        code: firstError.code,
        received: body,
      });
      return NextResponse.json(
        { success: false, error: firstError.message },
        { status: 400 }
      );
    }

    // other errors
    logger.error('Registration error:', error);
    console.error('Full error details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
