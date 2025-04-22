"use client"
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import WalletButton from '@/components/WalletButton';


export default function Home() {
  const { publicKey } = useWallet();
  const [formData, setFormData] = useState({ name: '', course: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Підключи гаманець Phantom спочатку!');
      return;
    }
    console.log('Minting NFT for:', formData, 'Wallet:', publicKey.toBase58());    
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Отримати NFT-сертифікат</h1>

        <div className="mb-4">
          <WalletButton  />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Ім’я"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <select
            name="course"
            className="w-full p-2 border rounded"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <option value="">Оберіть курс</option>
            <option value="web3-basics">Основи Web3</option>
            <option value="solana-nft">Solana та NFT</option>
            <option value="crypto-security">Безпека у крипті</option>
          </select>
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Отримати сертифікат
          </button>
        </form>
      </div>
    </main>
  );
}
