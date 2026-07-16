import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shipping Tracker',
  description: 'Track shipments and manage shipment updates.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
