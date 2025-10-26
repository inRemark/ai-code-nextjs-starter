"use client";

import React from 'react';
import { Card, CardContent } from '@shared/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, description, trend, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {icon}
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{description}</span>
            <span className="text-chart-2 font-medium">{trend}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
