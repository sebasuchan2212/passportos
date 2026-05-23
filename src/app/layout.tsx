import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PassportOS | SKU Launch Readiness SaaS',
  description: 'SKU単位で越境ECの規制タスク・証跡・期限を管理するRegOps SaaS MVP',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
