import type { Metadata } from "next";
import './globals.css';
import { SolanaProvider } from '@/components/SolanaProvider';

export const metadata: Metadata = {
  title: 'LearnProof',
  description: 'A platform for issuing and storing course completion certificates as NFTs on the blockchain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <SolanaProvider>{children}</SolanaProvider>
      </body>
    </html>
  );
}