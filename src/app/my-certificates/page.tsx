'use client'

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import Image from 'next/image';

export default function MyCertificates() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<any[]>([]);
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
    return <div className="text-center mt-10">🔐 Підключіть гаманець, щоб переглянути сертифікати.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎓 Мої Сертифікати</h1>
      {loading ? (
        <p className="text-center text-gray-500">Завантаження...</p>
      ) : nfts.length === 0 ? (
        <p className="text-center text-gray-500">Сертифікатів не знайдено.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft, index) => (
            <div key={index} className="border rounded-2xl p-4 shadow-lg bg-white">
              <Image
                src={nft.image}
                alt={nft.name}
                width={300}
                height={300}
                className="rounded-xl w-full h-60 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{nft.name}</h2>
              <p className="text-gray-600 text-sm mt-1">{nft.description}</p>
              <a
                href={`https://explorer.solana.com/address/${nft.mint}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 hover:underline text-sm"
              >
                🔗 Переглянути в Explorer
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
