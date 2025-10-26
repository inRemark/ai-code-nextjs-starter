import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/github/callback';
import { logger } from '@logger';
export async function GET(request: NextRequest) {
  try {
    // 构建GitHub OAuth授权URL
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', GITHUB_CLIENT_ID || '');
    authUrl.searchParams.set('redirect_uri', GITHUB_REDIRECT_URI);
    authUrl.searchParams.set('scope', 'user:email');
    authUrl.searchParams.set('allow_signup', 'true');
    
    // 重定向到GitHub授权页面
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    logger.error('GitHub OAuth error:', error);
    return NextResponse.json(
      { error: 'OAuth initialization failed' },
      { status: 500 }
    );
  }
}