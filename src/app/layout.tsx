import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'POLAI | Decentralized Prediction Markets on Stellar',
  description: 'Engineering-grade binary prediction markets powered by Stellar Soroban smart contracts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
