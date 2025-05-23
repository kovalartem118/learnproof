'use client'

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Metaplex, Nft } from '@metaplex-foundation/js';
import Image from 'next/image';

interface CertificateNFT {
  name: string;
  description: string;
  image: string;
  mint: string;
}

export default function MyCertificates() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<CertificateNFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!publicKey) return;
      setLoading(true);
      try {
        const connection = new Connection(clusterApiUrl('devnet'));
        const metaplex = Metaplex.make(connection);
        const allNFTs = await metaplex.nfts().findAllByOwner({ owner: publicKey });

        const learnNFTs = allNFTs.filter(nft => nft.symbol === 'LEARN');

        const fetched = await Promise.all(
          learnNFTs.map(async (nft) => {
            const full = await metaplex.nfts().load({ metadata: nft });
            const metadataRes = await fetch(full.uri);
            const metadata = await metadataRes.json();
            return {
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
              mint: full.address.toBase58(),
            };
          })
        );

        setNfts(fetched);
      } catch (err) {
        console.error('Error loading NFTs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center text-gray-700 text-lg">
          🔐 Підключіть гаманець, щоб переглянути сертифікати
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6 text-center">🎓 Мої Сертифікати</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="text-gray-500 mt-2">Завантаження...</p>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Сертифікатів не знайдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {nfts.map((nft, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative h-48 sm:h-56">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{nft.name}</h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">{nft.description}</p>
                  <a
                    href={`https://explorer.solana.com/address/${nft.mint}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm sm:text-base"
                  >
                    <span>🔗 Переглянути в Explorer</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
