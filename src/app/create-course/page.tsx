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
  const [numSeats, setNumSeats] = useState<number>(0);
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  useEffect(() => {
    const seatsNumber = parseInt(formData.seats, 10);
    if (!isNaN(seatsNumber) && seatsNumber > 0) {
      setParticipantAddresses(Array(seatsNumber).fill(''));
      setNumSeats(seatsNumber);
    } else {
      setParticipantAddresses([]);
      setNumSeats(0);
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
    //data.append('participants', JSON.stringify(participantAddresses));

    console.log(participantAddresses)
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
      setNumSeats(0);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setStatus(`Error: ${error}`);
    }
  };


  return (
    <main className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Create Course</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Course Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter course title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Course Description</label>
            <textarea
              name="description"
              placeholder="Enter course description"
              value={formData.description}
              onChange={handleChange}
              required
              className={`${styles.input} ${styles.textarea}`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Seats</label>
            <input
              type="number"
              name="seats"
              placeholder="Enter number of seats"
              value={formData.seats}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Your Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              disabled
              className={`${styles.input} ${styles.disabledInput}`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Course Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              required
              className={styles.fileInput}
            />
          </div>

          {numSeats > 0 && (
            <div className={styles.participantsContainer}>
              <label className={styles.label}>Participant Addresses:</label>
              <div className={styles.formGroup}>
                {participantAddresses.map((address, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Address ${index + 1}`}
                    value={address}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onPaste={handlePasteAddresses}
                    className={`${styles.input} ${styles.participantInput}`}
                  />
                ))}
              </div>
              <p className={styles.hintText}>You can paste multiple addresses separated by commas.</p>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
          >
            Create Course
          </button>

          {status && (
            <p className={styles.statusMessage}>{status}</p>
          )}

          {mintAddress && (
            <div className={styles.mintAddressContainer}>
              <p className={styles.mintAddressLabel}>
                Course NFT Mint Address:
              </p>
              <p className={styles.mintAddress}>
                {mintAddress}
              </p>
              <p className={styles.mintAddressHint}>
                Share this address to view the course NFT.
              </p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}