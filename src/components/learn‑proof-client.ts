
import {
    AnchorProvider,
    BN,
    IdlAccounts,
    Program,
    web3,
} from "@coral-xyz/anchor";
import {
    Adapter as WalletAdapter,
} from "@solana/wallet-adapter-base";
import {
    createMint,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountIdempotent,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import idl from "./idl/learn_proof_contract.json";

const { PublicKey, SystemProgram, Keypair, Connection } = web3;

type CourseAccount = IdlAccounts<typeof idl>["course"];


export class LearnProofClient {
    readonly program: Program<typeof idl>;

    constructor(
        readonly connection: Connection,
        readonly wallet: WalletAdapter,
    ) {
        if (!wallet.publicKey) throw new Error("Wallet not connected");

        const provider = new AnchorProvider(
            connection,            
             wallet as unknown as AnchorProvider["wallet"],
            { commitment: "confirmed" },
        );

        this.program = new Program(
            idl as any,
            new PublicKey(idl.metadata.address),
            provider,
        );
    }




    getCoursePda(instructor: PublicKey) {
        return PublicKey.findProgramAddressSync(
            [Buffer.from("course"), instructor.toBuffer()],
            this.program.programId,
        );
    }


    async createCourseMint(coursePda: PublicKey) {
        return createMint(
            this.connection,
            this.wallet as any,
            coursePda,
            null,
            0,
        );
    }


    async getOrCreateAta(mint: PublicKey, owner: PublicKey) {
        const ata = getAssociatedTokenAddressSync(mint, owner);
        await createAssociatedTokenAccountIdempotent(
            this.connection,
            this.wallet as any,
            mint,
            owner,
        );
        return ata;
    }


    async initializeClosedCourse(opts: {
        participants: PublicKey[];
        endDate: number;
    }) {
        const instructor = this.wallet.publicKey!;
        const [coursePda] = this.getCoursePda(instructor);

        await this.program.methods
            .initializeClosedCourse(opts.participants, new BN(opts.endDate))
            .accounts({
                course: coursePda,
                instructor,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        const mint = await this.createCourseMint(coursePda);

        return { coursePda, mint };
    }


    async initializeOpenCourse(opts: {
        maxParticipants: number;
    }) {
        const instructor = this.wallet.publicKey!;
        const [coursePda] = this.getCoursePda(instructor);

        await this.program.methods
            .initializeOpenCourse(opts.maxParticipants)
            .accounts({
                course: coursePda,
                instructor,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        const mint = await this.createCourseMint(coursePda);
        return { coursePda, mint };
    }


    async registerForCourse(coursePda: PublicKey) {
        await this.program.methods
            .registerForCourse()
            .accounts({
                course: coursePda,
                user: this.wallet.publicKey!,
            })
            .rpc();
    }


    async startCourse(coursePda: PublicKey, endDate: number) {
        await this.program.methods
            .startCourse(new BN(endDate))
            .accounts({
                course: coursePda,
                instructor: this.wallet.publicKey!,
            })
            .rpc();
    }


    async claimNft(opts: {
        coursePda: PublicKey;
        mint: PublicKey;
    }) {
        const { coursePda, mint } = opts;
        const user = this.wallet.publicKey!;
        const ata = await this.getOrCreateAta(mint, user);

        await this.program.methods
            .claimNft()
            .accounts({
                course: coursePda,
                mint,
                userTokenAccount: ata,
                user,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .rpc();
    }


    async fetchCourse(coursePda: PublicKey): Promise<CourseAccount> {
        return this.program.account.course.fetch(coursePda);
    }
}



async function demo() {

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    const wallet = {} as WalletAdapter;

    const client = new LearnProofClient(connection, wallet);

    const participants = [
        new PublicKey("4uStuDeNT111111111111111111111111111111111"),
        new PublicKey("4uStuDeNT222222222222222222222222222222222"),
    ];
    const end = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

    const { coursePda, mint } = await client.initializeClosedCourse({
        participants,
        endDate: end,
    });
    console.log("Course PDA:", coursePda.toBase58());
    console.log("Mint:", mint.toBase58());


    await client.claimNft({ coursePda, mint });
    console.log(" NFT claimed!");
}

;
