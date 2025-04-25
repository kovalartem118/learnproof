'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function CreateCoursePage() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() || '';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    seats: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      ...formData,
      creatorWallet: walletAddress,
    };

    console.log('Course Created:', courseData);
    // Тут у майбутньому буде запит до бекенду / mint логіка
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">Створити курс</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Назва курсу"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Опис курсу"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded h-32"
          />
          <input
            type="number"
            name="seats"
            placeholder="Кількість учасників"
            value={formData.seats}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            value={walletAddress}
            disabled
            className="w-full p-2 border rounded bg-gray-100 text-gray-600"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Створити курс
          </button>
        </form>
      </div>
    </main>
  );
}
