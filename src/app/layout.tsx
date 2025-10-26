import '../index.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthSessionProvider } from '@features/auth/components/session-provider';
import { UnifiedAuthProvider } from '@features/auth/components/unified-auth-provider';
import { BreakpointProvider } from '@shared/theme/breakpoint-provider';
import { ReactQueryProvider } from '@/lib/react-query';
import { ThemeProvider } from '@shared/theme/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AICoder',
  description: 'Professional Email Service Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'system';
                const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = theme === 'dark' || (theme === 'system' && isSystemDark);
                // Store the theme preference for ThemeProvider to use
                window.__THEME_PREFERENCE__ = { theme, shouldBeDark };
                document.documentElement.classList.toggle('dark', shouldBeDark);
              } catch (e) {
                // Fallback to system preference if localStorage is not available
                const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                window.__THEME_PREFERENCE__ = { theme: 'system', shouldBeDark: isSystemDark };
                document.documentElement.classList.toggle('dark', isSystemDark);
              }
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <ReactQueryProvider>
            <BreakpointProvider>
              <AuthSessionProvider>
                <UnifiedAuthProvider>
                  {children}
                </UnifiedAuthProvider>
              </AuthSessionProvider>
            </BreakpointProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}