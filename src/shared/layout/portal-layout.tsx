"use client";

import React from "react";
import { PortalHeader } from "./portal-header";
import { PortalFooter } from "./portal-footer";

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHero?: boolean;
  className?: string;
}

const PortalLayoutContent: React.FC<PortalLayoutProps> = ({ 
  children, 
  title,
  description,
  showHero = false,
  className = ""
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${className}`}>
      <PortalHeader />
      <main className="flex-1 bg-background">
        {(title || description) && !showHero && (
          <div className="bg-gradient-to-b from-muted/20 to-background dark:from-muted/10 dark:to-background border-b">
            <div className="container mx-auto px-4 py-12 text-center">
              {title && (
                <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
              )}
              {description && (
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
              )}
            </div>
          </div>
        )}
        <div className="bg-background min-h-full">
          {children}
        </div>
      </main>
      <PortalFooter />
    </div>
  );
};

export const PortalLayout: React.FC<PortalLayoutProps> = (props) => {
  return <PortalLayoutContent {...props} />;
};