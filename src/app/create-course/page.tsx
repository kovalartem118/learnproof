'use client';

import { useState, useEffect } from 'react';
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
  const [participantAddresses, setParticipantAddresses] = useState<string[]>([]);
  const [numSeats, setNumSeats] = useState<number | ''>('');
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  useEffect(() => {
    const seatsNumber = parseInt(formData.seats, 10);
    if (!isNaN(seatsNumber) && seatsNumber > 0) {
      setParticipantAddresses(Array(seatsNumber).fill(''));
      setNumSeats(seatsNumber);
    } else {
      setParticipantAddresses([]);
      setNumSeats('');
    }
  }, [formData.seats]);

  const handleInputChange = (index: number, value: string) => {
    const newAddresses = [...participantAddresses];
    newAddresses[index] = value;
    setParticipantAddresses(newAddresses);
  };

  const handlePasteAddresses = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const addressesArray = pastedText.split(',').map(addr => addr.trim());

    if (addressesArray.length <= participantAddresses.length) {
      const newAddresses = [...participantAddresses];
      addressesArray.forEach((addr, index) => {
        if (newAddresses[index] !== undefined) {
          newAddresses[index] = addr;
        }
      });
      setParticipantAddresses(newAddresses);
    } else {
      setStatus('You pasted more addresses than the number of seats.');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setStatus('Please add a course image.');
      return;
    }

    if (participantAddresses.some(addr => addr.trim() === '') && participantAddresses.length > 0) {
      setStatus('Please fill in all participant addresses.');
      return;
    }

    setStatus('Creating course...');
    setMintAddress(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('seats', formData.seats);
    data.append('wallet', walletAddress);
    data.append('image', imageFile);
    participantAddresses.forEach((address, index) => {
      data.append(`participant_${index + 1}`, address.trim());
    });

    try {
      const res = await fetch('/api/create-course', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Error creating course');
      }
      console.log(result);
      setStatus(`Course created! Mint address: ${result}`);
      setMintAddress(result.mintAddress);
      setFormData({ title: '', description: '', seats: '' });
      setImageFile(null);
      setParticipantAddresses([]);
      setNumSeats('');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-8">
      <div className={styles.container}>
        <h1 className={styles.heading}>Create Course</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="number"
            name="seats"
            placeholder="Number of Seats"
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

          {numSeats > 0 && (
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Participant Addresses:</label>
              {participantAddresses.map((address, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Address ${index + 1}`}
                  value={address}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onPaste={handlePasteAddresses}
                  className={`${styles.input} mb-2`}
                />
              ))}
              <p className="text-xs text-gray-500">You can paste multiple addresses separated by commas.</p>
            </div>
          )}

          <button type="submit" className={styles.button}>
            Create Course
          </button>

          {status && <p className="text-sm text-gray-700">{status}</p>}
          {mintAddress && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                Course NFT Mint Address:
              </p>
              <p className="font-semibold text-purple-600 break-words">
                {mintAddress}
              </p>
              <p className="text-xs text-gray-500">
                Share this address to view the course NFT.
              </p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}