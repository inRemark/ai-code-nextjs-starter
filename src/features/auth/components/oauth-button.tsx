"use client";

import React from "react";
import { Button } from "@shared/ui/button";
import { Loader2 } from "lucide-react";

type OAuthProvider = 'google' | 'github' | 'wechat';

interface OAuthButtonProps {
  provider: OAuthProvider;
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const providerConfig = {
  google: {
    baseStyle: "border-border hover:bg-muted/50 text-foreground",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  github: {
    baseStyle: "border-border bg-muted hover:bg-muted/80 text-foreground dark:bg-muted dark:hover:bg-muted/70",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  wechat: {
    baseStyle: "border-chart-1 bg-chart-1 hover:bg-chart-1/90 text-background",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.24c-.019.061-.024.124-.013.185a.338.338 0 0 0 .498.246l1.626-.75a.739.739 0 0 1 .517-.07 11.168 11.168 0 0 0 3.238.373c-.024-.257-.037-.516-.037-.778 0-4.121 3.891-7.438 8.69-7.438.024 0 .048.002.072.002C16.938 4.188 13.248 2.188 8.691 2.188z"/>
        <path d="M24 14.315c0-3.5-3.357-6.346-7.491-6.346s-7.49 2.846-7.49 6.346c0 3.499 3.357 6.345 7.49 6.345a9.055 9.055 0 0 0 2.785-.424.507.507 0 0 1 .348.048l1.273.573a.24.24 0 0 0 .343-.17c.013-.042.011-.085-.003-.126l-.308-.984a.42.42 0 0 1 .147-.473C22.84 18.208 24 16.467 24 14.315z"/>
      </svg>
    ),
  },
};

export const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  children,
  onClick,
  loading = false,
  disabled = false,
  className = "",
}) => {
  const config = providerConfig[provider];
  
  return (
    <Button
      type="button"
      variant="outline"
      className={`
        h-12 px-6 w-full rounded-lg text-sm font-medium
        transition-colors duration-200
        ${config.baseStyle}
        ${className}
      `}
      onClick={onClick}
      disabled={loading || disabled}
    >
      <div className="flex items-center justify-center gap-3">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          config.icon
        )}
        <span>{children}</span>
      </div>
    </Button>
  );
};