import { NextRequest, NextResponse } from 'next/server';
import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import axios from 'axios';
import bs58 from 'bs58';

const PRIVATE_KEY = process.env.PRIVATE_KEY!;


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const walletAddress = body.wallet;
    const collectionAddress = body.collectionAddress;
    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
    }

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const payer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const metaplex = Metaplex.make(connection).use(keypairIdentity(payer));


    const collectionNft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(collectionAddress) });

    if (!collectionNft || !collectionNft.uri) {
      return NextResponse.json({ error: 'Failed to load collection metadata' }, { status: 500 });
    }


    const collectionMetaRes = await fetch(collectionNft.uri);
    if (!collectionMetaRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch collection metadata from URI' }, { status: 500 });
    }
    const collectionMetadata = await collectionMetaRes.json();

    const metadataUri = collectionNft.uri;
    const metadataRes = await axios.get(metadataUri);

    const attributes = metadataRes.data.attributes;
    const participantsAttr = attributes.find((attr: any) => attr.trait_type === 'Participants');
    const allowedWallets = JSON.parse(participantsAttr?.value || '[]');

    if (!allowedWallets.includes(walletAddress)) {
      return NextResponse.json({ error: 'Wallet is not in the list of allowed participants' }, { status: 403 });
    }


    const metadata = {
      name: `${collectionMetadata.name} Completion NFT`,
      description: `Congrats, ${walletAddress}, on completing the course!`,
      image: collectionMetadata.image,
    };

    const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY!,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
      },
    });

    const newMetadataUri = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;

    const { nft } = await metaplex.nfts().create({
      uri: newMetadataUri,
      name: metadata.name,
      sellerFeeBasisPoints: 0,
      symbol: 'LEARN',
      collection: new PublicKey(collectionAddress),
      collectionAuthority: payer,
      tokenOwner: new PublicKey(walletAddress),
    });

    return NextResponse.json({
      success: true,
      mintAddress: nft.address.toBase58(),
      metadataUri: newMetadataUri,
    });
  } catch (err: any) {
    console.error('Claim failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}