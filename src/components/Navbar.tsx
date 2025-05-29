'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isMenuOpen]);

  return (
    <nav className="bg-white shadow-md px-4 py-4 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold text-purple-600 hover:text-purple-800">
          LearnProof
        </Link>

        
        <button
          className="md:hidden text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
        >
          {isMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/create-course" className="text-gray-700 hover:text-purple-600">
            Create Course
          </Link>
          <Link href="/create-open-course" className="text-gray-700 hover:text-purple-600">
            Create Open Course
          </Link>
          <Link href="/view-open-course" className="text-gray-700 hover:text-purple-600">
            View Open Course
          </Link>
          <Link href="/my-certificates" className="text-gray-700 hover:text-purple-600">
            My certificates
          </Link>
          <Link href="/claim" className="text-gray-700 hover:text-purple-600">
            Claim certificates
          </Link>
          <div>
            {hasMounted && <WalletMultiButton />}
          </div>
        </div>
      </div>

      
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-10 mt-1 py-2 flex flex-col items-center">
          <Link href="/create-course" className="block py-2 px-4 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
            Create Course
          </Link>
          <Link href="/create-open-course" className="block py-2 px-4 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
            Create Open Course
          </Link>
          <Link href="/view-open-course" className="block py-2 px-4 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
            View Open Course
          </Link>
          <Link href="/my-certificates" className="block py-2 px-4 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
            My certificates
          </Link>
          <Link href="/claim" className="block py-2 px-4 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
            Claim certificates
          </Link>
          <div className="py-2">
            {hasMounted && <WalletMultiButton />}
          </div>
        </div>
      )}
    </nav>
  );
}