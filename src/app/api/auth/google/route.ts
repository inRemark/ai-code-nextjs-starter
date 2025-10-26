import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/google/callback';

export async function GET(request: NextRequest) {
  try {
    // 构建Google OAuth授权URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID || '');
    authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    
    // 重定向到Google授权页面
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    logger.error('Google OAuth error:', error);
    return NextResponse.json(
      { error: 'OAuth initialization failed' },
      { status: 500 }
    );
  }
}