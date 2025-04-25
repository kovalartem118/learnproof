'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex space-x-6">
        <Link href="/" className="text-lg font-bold text-purple-600 hover:text-purple-800">
          LearnProof
        </Link>
        <Link href="/create-course" className="text-gray-700 hover:text-purple-600">
          Курси
        </Link>
        <Link href="/certificates" className="text-gray-700 hover:text-purple-600">
          Сертифікати
        </Link>
      </div>
      <div>
        <WalletMultiButton />
      </div>
    </nav>
  );
}
