import { NextRequest, NextResponse } from 'next/server';
import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import axios from 'axios';
import bs58 from 'bs58';

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const COLLECTION_ADDRESS = "4QaTuH1E2EhoRFe3GmczvdjWBLP5gtG46k3JvggRFVLS";

// 4QaTuH1E2EhoRFe3GmczvdjWBLP5gtG46k3JvggRFVLS
const mockAllowedWallets = [
  'EBpaYKEkNehWNyNYmy1b7zPLq553pyCTW7NkUSDz6jtt',   
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const  walletAddress = body.wallet;
    console.log(walletAddress)

    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
    }

    if (!mockAllowedWallets.includes(walletAddress)) {
      return NextResponse.json({ error: 'Wallet is not in the list of allowed participants' }, { status: 403 });
    }

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const payer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const metaplex = Metaplex.make(connection).use(keypairIdentity(payer));

    
    const metadata = {
      name: `Course Completion NFT`,
      description: `Congrats on completing the course!`,
      image: 'https://placehold.co/300x300.png?text=NFT', // ned change
    };

    
    const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY!,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
      },
    });

    const metadataUri = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;

    const { nft } = await metaplex.nfts().create({
      uri: metadataUri,
      name: metadata.name,
      sellerFeeBasisPoints: 0,
      symbol: 'LEARN',
      collection: new PublicKey(COLLECTION_ADDRESS),
      collectionAuthority: payer,
      tokenOwner: new PublicKey(walletAddress),
    });

    return NextResponse.json({
      success: true,
      mintAddress: nft.address.toBase58(),
      metadataUri,
    });
  } catch (err: any) {
    console.error('Claim failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
