import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@features/auth/services/next-auth.config';
import { oauthAccountService } from '@features/auth/services/oauth.service';

// GET: 获取用户关联的OAuth账户
export async function GET() {
  try {
    // 使用NextAuth session验证
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accounts = await oauthAccountService.getLinkedAccounts(session.user.id);
    
    return NextResponse.json(accounts);
  } catch (error) {
    logger.error('Get OAuth accounts error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: 解绑OAuth账户
export async function DELETE(request: NextRequest) {
  try {
    // 使用NextAuth session验证
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { provider } = await request.json();
    
    if (!provider) {
      return NextResponse.json(
        { message: 'Provider is required' },
        { status: 400 }
      );
    }

    await oauthAccountService.unlinkOAuthAccount(session.user.id, provider);
    
    return NextResponse.json({ message: 'Account unlinked successfully' });
  } catch (error) {
    logger.error('Unlink OAuth account error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Cannot unlink')) {
        return NextResponse.json(
          { message: error.message },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
