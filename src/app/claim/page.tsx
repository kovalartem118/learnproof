'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './claim.module.css';

export default function ClaimPage() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() || '';

  const [formData, setFormData] = useState({
    wallet: '',
    courseId: '',
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
    <main className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-8">
      <div className={styles.container}>
        <h1 className={styles.heading}>Claim Your NFT</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="wallet"
            value={formData.wallet}
            readOnly
            className={styles.input}
          />

          <input
            type="text"
            name="courseId"
            placeholder="Course ID"
            value={formData.courseId}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <button type="submit" className={styles.button}>
            Claim NFT
          </button>

          {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}

          {mintAddress && (
            <p className="mt-2 text-sm text-purple-700 break-words">
              Mint address: {mintAddress}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
