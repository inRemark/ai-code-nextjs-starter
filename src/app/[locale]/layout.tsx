import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { AuthSessionProvider } from '@features/auth/components/session-provider';
import { UnifiedAuthProvider } from '@features/auth/components/unified-auth-provider';
import { BreakpointProvider } from '@shared/theme/breakpoint-provider';
import { ReactQueryProvider } from '@/lib/react-query';
import { ThemeProvider } from '@shared/theme/context';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// 为SEO添加多语言元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

  // 生成hreflang链接
  const alternates = routing.locales.reduce(
    (acc, lang) => {
      acc[lang as 'zh' | 'en' | 'ja'] = `${baseUrl}/${lang}`;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: alternates,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 验证 locale
  if (!routing.locales.includes(locale as 'zh' | 'en' | 'ja')) {
    notFound();
  }

  // 获取翻译消息
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'system';
                const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = theme === 'dark' || (theme === 'system' && isSystemDark);
                window.__THEME_PREFERENCE__ = { theme, shouldBeDark };
                document.documentElement.classList.toggle('dark', shouldBeDark);
              } catch (e) {
                const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                window.__THEME_PREFERENCE__ = { theme: 'system', shouldBeDark: isSystemDark };
                document.documentElement.classList.toggle('dark', isSystemDark);
              }
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ReactQueryProvider>
              <BreakpointProvider>
                <AuthSessionProvider>
                  <UnifiedAuthProvider>{children}</UnifiedAuthProvider>
                </AuthSessionProvider>
              </BreakpointProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
