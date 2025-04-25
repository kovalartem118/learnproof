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

          <button
            type="submit"
            className={styles.button}
          >
            Створити курс
          </button>
        </form>
      </div>
    </main>
  );
}
