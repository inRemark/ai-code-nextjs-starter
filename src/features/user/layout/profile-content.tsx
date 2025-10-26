"use client";

import React from "react";
import { ProfileAccountSettings } from "../components/profile-account-settings";
import { ProfileInfoContent } from "../components/profile-info-content";
import { ProfileArticlesContent } from "../components/profile-articles-content";

// 设置内容组件
const SettingsContent: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">设置</h2>
    <ProfileAccountSettings />
  </div>
);

interface ProfileContentProps {
  section: string;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({ section }) => {
  const renderContent = () => {
    switch (section) {
      case 'profile':
        return <ProfileInfoContent />;
      case 'articles':
        return <ProfileArticlesContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <ProfileInfoContent />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};
