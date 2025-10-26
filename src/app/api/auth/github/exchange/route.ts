import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@logger';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUserInfo {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  company: string;
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
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      logger.error('GitHub token exchange failed:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to exchange authorization code' },
        { status: 400 }
      );
    }

    const tokenData: GitHubTokenResponse = await tokenResponse.json();

    // 第二步：使用访问令牌获取用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'AICoder-App',
      },
    });

    if (!userResponse.ok) {
      logger.error('Failed to fetch GitHub user info');
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user information' },
        { status: 400 }
      );
    }

    const userData: GitHubUserInfo = await userResponse.json();

    // 如果用户没有公开邮箱，需要获取邮箱列表
    let userEmail = userData.email;
    if (!userEmail) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'AICoder-App',
        },
      });

      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((email: any) => email.primary && email.verified);
        userEmail = primaryEmail?.email || emails[0]?.email;
      }
    }

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
          id: userData.id.toString(),
          email: userEmail,
          name: userData.name || userData.login,
          picture: userData.avatar_url,
          provider: 'github',
        },
      },
    };

    return NextResponse.json(authResult);

  } catch (error) {
    logger.error('GitHub OAuth exchange error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}