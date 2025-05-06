'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex space-x-6">
        <Link href="/" className="text-lg font-bold text-purple-600 hover:text-purple-800">
          LearnProof
        </Link>
        <Link href="/create-course" className="text-gray-700 hover:text-purple-600">
          Create Course
        </Link>
        <Link href="/certificates" className="text-gray-700 hover:text-purple-600">
          My certificates
        </Link>
        <Link href="/claim" className="text-gray-700 hover:text-purple-600">
          Claim certificates
        </Link>
      </div>
      <div>
        {hasMounted && <WalletMultiButton />}
      </div>
    </nav>
  );
}
