'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './CreateCourse.module.css';

export default function CreateCoursePage() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() || '';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    seats: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setStatus('Будь ласка, додайте зображення курсу.');
      return;
    }

    setStatus('Створення курсу...');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('seats', formData.seats);
    data.append('wallet', walletAddress);
    data.append('image', imageFile);

    try {
      const res = await fetch('/api/create-course', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Помилка при створенні курсу');
      }
      console.log(result)
      setStatus(`Курс створено! Mint address: ${result}`);
    } catch (err: any) {
      setStatus(`Помилка: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-8">
      <div className={styles.container}>
        <h1 className={styles.heading}>Створити курс</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Назва курсу"
            value={formData.title}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <textarea
            name="description"
            placeholder="Опис курсу"
            value={formData.description}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="number"
            name="seats"
            placeholder="Кількість учасників"
            value={formData.seats}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <input
            type="text"
            value={walletAddress}
            disabled
            className={styles.input}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            required
          />

          <button type="submit" className={styles.button}>
            Створити курс
          </button>

          {status && <p className="text-sm text-gray-700">{status}</p>}
        </form>
      </div>
    </main>
  );
}
