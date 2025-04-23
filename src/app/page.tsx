'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { IconSparkles } from '@tabler/icons-react';

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1a] via-[#1a1c3c] to-[#1c005c] text-white p-6">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-md w-full p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center flex items-center justify-center gap-2">
          <IconSparkles className="w-7 h-7 text-purple-400" />
          LearnProof
        </h1>

        <div className="text-center">
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Ім’я"
            className="w-full p-3 rounded-lg border border-white/20 bg-white/10 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <select
            name="course"
            className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <option value="">Оберіть курс</option>
            <option value="web3-basics">Основи Web3</option>
            <option value="solana-nft">Solana та NFT</option>
            <option value="crypto-security">Безпека у крипті</option>
          </select>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
          >
            Отримати сертифікат
          </button>
        </form>
      </div>
    </main>
  );
}
