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
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6 text-center">Create Course</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Course Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter course title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Course Description</label>
            <textarea
              name="description"
              placeholder="Enter course description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Number of Seats</label>
            <input
              type="number"
              name="seats"
              placeholder="Enter number of seats"
              value={formData.seats}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Your Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Course Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {numSeats > 0 && (
            <div className="space-y-4 mt-6">
              <label className="block text-sm font-medium text-gray-700">Participant Addresses:</label>
              <div className="space-y-2">
                {participantAddresses.map((address, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Address ${index + 1}`}
                    value={address}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onPaste={handlePasteAddresses}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">You can paste multiple addresses separated by commas.</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Create Course
          </button>

          {status && (
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{status}</p>
          )}
          
          {mintAddress && (
            <div className="mt-4 p-4 bg-purple-50 rounded-md">
              <p className="text-sm text-gray-700">
                Course NFT Mint Address:
              </p>
              <p className="font-semibold text-purple-600 break-words mt-1">
                {mintAddress}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Share this address to view the course NFT.
              </p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}