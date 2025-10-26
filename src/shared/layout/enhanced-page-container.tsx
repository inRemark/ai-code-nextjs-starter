"use client";

import React from "react";
import { cn } from "@shared/utils";
import { PageContainer, PageContainerProps } from "./page-container";
import { Skeleton } from "@shared/ui/skeleton";

export interface EnhancedPageContainerProps extends PageContainerProps {
  breadcrumb?: Array<{
    label: string;
    href?: string;
    icon?: React.ReactNode;
  }>;
  helpText?: string;
  loading?: boolean;
  error?: string | null;
}

export const EnhancedPageContainer: React.FC<EnhancedPageContainerProps> = ({
  breadcrumb,
  helpText,
  loading,
  error,
  className,
  ...props
}) => {
  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return <PageError error={error} />;
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* 帮助文本 */}
      {helpText && (
        <div className="px-4 py-2 bg-muted/50 border-b">
          <p className="text-sm text-muted-foreground">{helpText}</p>
        </div>
      )}
      
      <PageContainer {...props} />
    </div>
  );
};

// 页面骨架加载组件
export const PageSkeleton: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* 标题骨架 */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* 操作栏骨架 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      {/* 内容骨架 */}
      <div className="flex-1 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
};

// 页面错误组件
export const PageError: React.FC<{ error: string }> = ({ error }) => {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="text-6xl">😞</div>
        <h2 className="text-2xl font-semibold">出错了</h2>
        <p className="text-muted-foreground max-w-md">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          重新加载
        </button>
      </div>
    </div>
  );
};