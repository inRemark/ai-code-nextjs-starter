import React, { Suspense } from "react";
import { PortalLayout } from "@shared/layout/portal-layout";
import { ProfilePageClient } from "@features/user";
import ProtectedRoute from "@features/auth/components/protected-route";

export default async function ProfilePage() {

  return (
    <ProtectedRoute>
      <PortalLayout>
        <Suspense fallback={
          <div className="container mx-auto px-4 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        }>
          <ProfilePageClient />
        </Suspense>
      </PortalLayout>
    </ProtectedRoute>
  );
}