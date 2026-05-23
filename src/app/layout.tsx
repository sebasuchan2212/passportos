import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EU/UK向け海外販売の準備を、商品ごとに一画面で | PassportOS',
  description: 'GPSR、EU責任者情報、VAT/IOSS、提出証跡、更新期限をSKUごとに見える化。越境ECの販売準備を5分で無料診断できます。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
