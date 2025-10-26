import { logger } from '@logger';
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/github/callback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // 构建回调页面HTML
  const callbackHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>认证结果</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: #f5f5f5;
        }
        .container {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div class=\"container\">
        <div class=\"loading\"></div>
        <p>正在处理认证结果...</p>
        <p><small>如果页面没有自动关闭，请手动关闭此窗口</small></p>
      </div>
      <script>
        (async function() {
          try {
            if (\"${error}\") {
              // 认证失败
              localStorage.setItem('github_auth_result', JSON.stringify({
                success: false,
                error: \"${error}\"
              }));
              window.close();
              return;
            }

            if (\"${code}\") {
              // 向后端发送授权码，获取用户信息
              const response = await fetch('/api/auth/github/exchange', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: \"${code}\" })
              });

              const result = await response.json();
              
              // 保存结果到localStorage
              localStorage.setItem('github_auth_result', JSON.stringify(result));
              
              // 关闭窗口
              window.close();
            } else {
              throw new Error('No authorization code received');
            }
          } catch (error) {
            logger.error('Auth callback error:', error);
            localStorage.setItem('github_auth_result', JSON.stringify({
              success: false,
              error: 'Authentication failed'
            }));
            window.close();
          }
        })();
      </script>
    </body>
    </html>
  `;

  return new Response(callbackHTML, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}