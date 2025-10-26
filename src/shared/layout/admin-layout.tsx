"use client";

import React from "react";
import { UnifiedLayout } from "@shared/layout/unified-layout";
import { adminLayoutConfig } from "@shared/layout/layout-config";

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <UnifiedLayout config={adminLayoutConfig} className={className}>
      {children}
    </UnifiedLayout>
  );
};
