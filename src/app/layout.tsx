import '../index.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VSeek',
  description: 'Professional Email Service Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}