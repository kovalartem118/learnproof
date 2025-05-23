'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function ClaimPage() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() || '';

  const [formData, setFormData] = useState({
    wallet: '',
    collectionAddress: '',
  });
  const [status, setStatus] = useState('');
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      setFormData(prev => ({ ...prev, wallet: walletAddress }));
    }
  }, [walletAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus('Claiming your NFT...');
    setMintAddress(null);

    try {
      const response = await fetch('/api/claim-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('NFT successfully claimed!');
        setMintAddress(data.mintAddress);
      } else {
        setStatus(`Error: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error claiming NFT');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6 text-center">Claim Your NFT</h1>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your Wallet Address</label>
              <input
                type="text"
                name="wallet"
                value={formData.wallet}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Course ID</label>
              <input
                type="text"
                name="collectionAddress"
                placeholder="Enter course ID"
                value={formData.collectionAddress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Claim NFT
            </button>

            {status && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{status}</p>
              </div>
            )}

            {mintAddress && (
              <div className="mt-4 p-4 bg-purple-50 rounded-md">
                <p className="text-sm text-gray-700">Mint address:</p>
                <p className="text-sm text-purple-600 break-words mt-1">{mintAddress}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
