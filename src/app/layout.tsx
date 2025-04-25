import type { Metadata } from "next";
import { SolanaProvider } from '@/components/SolanaProvider';
import Navbar from '@/components/Navbar';
import './globals.css';
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
        <SolanaProvider>
          <Navbar />
          <main>{children}</main>
        </SolanaProvider>
      </body>
    </html>
  );
}