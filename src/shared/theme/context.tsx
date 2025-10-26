"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@shared/utils";

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  rootClassName: string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = 'theme';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage after hydration
  useEffect(() => {
    // Use the pre-set theme preference from the inline script
    const preSetTheme = (window as any).__THEME_PREFERENCE__;
    if (preSetTheme) {
      setTheme(preSetTheme.theme);
      setSystemTheme(getSystemTheme());
      setIsInitialized(true);
      // Clean up the global variable
      delete (window as any).__THEME_PREFERENCE__;
    } else {
      // Fallback to normal initialization
      const savedTheme = localStorage.getItem(THEME_KEY);
      const currentTheme = (savedTheme as Theme) || 'system';
      setTheme(currentTheme);
      
      const currentSystemTheme = getSystemTheme();
      setSystemTheme(currentSystemTheme);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setThemeWithPersist = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    const root = window.document.documentElement;
    if (newTheme === 'system') {
      const isSystemDark = getSystemTheme() === 'dark';
      root.classList.toggle('dark', isSystemDark);
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }

    root.classList.add('theme-transition');
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  };

  const toggleDarkMode = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    setThemeWithPersist(currentTheme === 'dark' ? 'light' : 'dark');
  };

  // Only apply theme changes after initialization to prevent flashing
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    const root = window.document.documentElement;
    const isDark = theme === 'system' ? systemTheme === 'dark' : theme === 'dark';
    
    // Only update if the class actually needs to change
    const hasDarkClass = root.classList.contains('dark');
    if (hasDarkClass !== isDark) {
      root.classList.toggle('dark', isDark);
    }
  }, [theme, systemTheme, isInitialized]);

  const isDarkMode = theme === 'system' ? systemTheme === 'dark' : theme === 'dark';

  const rootClassName = useMemo(
    () => cn(
      "h-screen w-screen flex flex-col overflow-hidden",
      // Use neutral background during initialization to prevent hydration mismatch
      isInitialized 
        ? (isDarkMode ? "bg-gray-900" : "bg-gray-50")
        : "bg-background"
    ),
    [isDarkMode, isInitialized]
  );

  const value = {
    theme,
    setTheme: setThemeWithPersist,
    isDarkMode,
    toggleDarkMode,
    rootClassName,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 