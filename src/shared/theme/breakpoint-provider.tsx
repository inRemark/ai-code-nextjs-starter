"use client";

import { useWindowSize } from "@shared/hooks/useWindowSize";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

/**
 * 应用的断点配置
 * 与 Tailwind CSS 的默认断点保持一致
 * @see https://tailwindcss.com/docs/breakpoints
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;



interface BreakpointContextValue {
  breakpoint: Breakpoint;
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isGreaterThan: (bp: Breakpoint) => boolean;
  isLessThan: (bp: Breakpoint) => boolean;
}

const BreakpointContext = createContext<BreakpointContextValue | null>(null);

export function BreakpointProvider({ children }: { children: ReactNode }) {
  const { width } = useWindowSize();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const value = useMemo((): BreakpointContextValue => {
    // 在服务端渲染或客户端第一次渲染时，使用默认值
    if (!isClient || width === 0) {
      return {
        breakpoint: "lg",
        width: 1024,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isGreaterThan: () => false,
        isLessThan: () => true,
      };
    }

    const breakpoint: Breakpoint =
      width >= BREAKPOINTS["2xl"]
        ? "2xl"
        : width >= BREAKPOINTS.xl
        ? "xl"
        : width >= BREAKPOINTS.lg
        ? "lg"
        : width >= BREAKPOINTS.md
        ? "md"
        : "sm";

    return {
      breakpoint,
      width,
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      isGreaterThan: (bp: Breakpoint) => width >= BREAKPOINTS[bp],
      isLessThan: (bp: Breakpoint) => width < BREAKPOINTS[bp],
    };
  }, [width, isClient]);

  return (
    <BreakpointContext.Provider value={value}>
      {children}
    </BreakpointContext.Provider>
  );
}

export function useBreakpointContext() {
  const context = useContext(BreakpointContext);
  if (!context) {
    throw new Error(
      "useBreakpointContext must be used within a BreakpointProvider"
    );
  }
  return context;
}