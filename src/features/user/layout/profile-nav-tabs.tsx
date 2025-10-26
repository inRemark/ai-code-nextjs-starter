"use client";

import React from "react";
import { Button } from "@shared/ui/button";
import { 
  User, 
  Settings,
  FileText
} from "lucide-react";

interface ProfileNavTabsProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'articles', label: '文章', icon: FileText },
  { id: 'profile', label: '资料', icon: User },
  { id: 'settings', label: '设置', icon: Settings }
];

export const ProfileNavTabs: React.FC<ProfileNavTabsProps> = ({
  currentSection,
  onSectionChange
}) => {
  return (
    <div className="bg-background border-b mb-6">
      {/* 桌面端：水平标签页 */}
      <div className="hidden lg:flex items-center gap-1 py-4">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={currentSection === section.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onSectionChange(section.id)}
            className="gap-2 dashboard-tab"
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </Button>
        ))}
      </div>

      {/* 移动端：滚动标签页 */}
      <div className="lg:hidden">
        <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={currentSection === section.id ? "default" : "outline"}
              size="sm"
              onClick={() => onSectionChange(section.id)}
              className="gap-2 whitespace-nowrap flex-shrink-0 dashboard-tab"
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
