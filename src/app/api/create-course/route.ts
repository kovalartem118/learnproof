import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import bs58 from 'bs58';

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

const approvedWallets = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as Blob;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    //const participants = JSON.parse(formData.get('participants') as string);
    const participants: string[] = [];

    const seats = parseInt(formData.get('seats') as string, 10);
    for (let i = 1; i <= seats; i++) {
      const addr = formData.get(`participant_${i}`);
      if (typeof addr === 'string' && addr.trim()) {
        participants.push(addr.trim());
      }
    }

    const requester = formData.get('wallet') as string;
    console.log(participants)
    if (!image || !title || !description || !participants || !requester) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }


    if (!participants.includes(requester)) {
      return NextResponse.json({ error: 'Unauthorized wallet address' }, { status: 403 });
    }


    participants.forEach((addr) => approvedWallets.add(addr));

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imageFormData = new FormData();
    imageFormData.append('file', imageBuffer, 'nft-image.png');

    const imageRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', imageFormData, {
      headers: {
        ...imageFormData.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    const imageHash = imageRes.data.IpfsHash;
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;

    const metadata = {
      name: title,
      description,
      image: imageUrl,
    };

    const metadataRes = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    const metadataHash = metadataRes.data.IpfsHash;
    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataHash}`;

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const wallet = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));

    const { nft } = await metaplex.nfts().create({
      uri: metadataUrl,
      name: title,
      sellerFeeBasisPoints: 0,
      symbol: 'LEARN',
      isCollection: true,
    });

    return NextResponse.json({
      metadataUrl,
      imageUrl,
      mintAddress: nft.address.toBase58(),
      approvedParticipants: Array.from(approvedWallets),
    });
  } catch (err: any) {
    console.error('NFT creation failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
