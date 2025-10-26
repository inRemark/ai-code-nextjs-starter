import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/google/callback';

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // 第一步：用授权码换取访问令牌
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID || '',
        client_secret: GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      logger.error('Google token exchange failed:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to exchange authorization code' },
        { status: 400 }
      );
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json();

    // 第二步：使用访问令牌获取用户信息
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      logger.error('Failed to fetch Google user info');
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user information' },
        { status: 400 }
      );
    }

    const userData: GoogleUserInfo = await userResponse.json();

    // 第三步：在这里应该集成你的用户认证逻辑
    // 检查用户是否已存在，如果不存在则创建新用户
    // 生成JWT令牌等
    
    // 模拟用户认证成功的响应
    const authResult = {
      success: true,
      data: {
        accessToken: 'mock_jwt_token', // 这里应该是真实的JWT令牌
        refreshToken: 'mock_refresh_token',
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          provider: 'google',
        },
      },
    };

    return NextResponse.json(authResult);

  } catch (error) {
    logger.error('Google OAuth exchange error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}