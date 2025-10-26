"use client";

import React from "react";
import { UnifiedLayout } from "@shared/layout/unified-layout";
import { consoleLayoutConfig } from "@shared/layout/layout-config";

interface ConsoleLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ConsoleLayout: React.FC<ConsoleLayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <UnifiedLayout config={consoleLayoutConfig} className={className}>
      {children}
    </UnifiedLayout>
  );
};
