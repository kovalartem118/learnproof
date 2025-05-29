'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './claim.module.css';

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
    <main className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Claim Your NFT</h1>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Your Wallet Address</label>
              <input
                type="text"
                name="wallet"
                value={formData.wallet}
                readOnly
                className={`${styles.input} ${styles.disabledInput}`}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Course ID</label>
              <input
                type="text"
                name="collectionAddress"
                placeholder="Enter course ID"
                value={formData.collectionAddress}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
            >
              Claim NFT
            </button>

            {status && (
              <div className={styles.statusMessage}>
                <p className={styles.statusText}>{status}</p>
              </div>
            )}

            {mintAddress && (
              <div className={styles.mintAddressContainer}>
                <p className={styles.mintAddressLabel}>Mint address:</p>
                <p className={styles.mintAddress}>{mintAddress}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}