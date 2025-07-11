import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token';

interface TransferTokenTransactionResponse {
    transaction: Transaction;
    senderAssociatedTokenAddress: string;
    receiverAssociatedTokenAddress: string;
}


export async function getTransferTokenTransaction(
    connection: Connection,
    payerWallet: string,
    receiverAddress: string,
    tokenMintAddress: string,
    amount: number
): Promise<TransferTokenTransactionResponse> {
    if (!payerWallet) {
        throw new Error('Payer wallet is not available');
    }

    try {
        console.log('Starting getTransferTokenTransaction');
        console.log('payerWallet:', payerWallet);
        console.log('receiverAddress:', receiverAddress);
        console.log('tokenMintAddress:', tokenMintAddress);
        console.log('amount:', amount);

        const senderWalletAddress = new PublicKey(payerWallet);
        console.log('senderWalletAddress:', senderWalletAddress.toString());
        const receiverWalletAddress = new PublicKey(receiverAddress);
        console.log('receiverWalletAddress:', receiverWalletAddress.toString());


        const tokenMint = new PublicKey(tokenMintAddress);
        console.log('tokenMint:', tokenMint.toString());

        const senderAssociatedTokenAddress = await getAssociatedTokenAddress(tokenMint, senderWalletAddress, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
        console.log('senderAssociatedTokenAddress:', senderAssociatedTokenAddress.toString());

        const receiverAssociatedTokenAddress = await getAssociatedTokenAddress(tokenMint, receiverWalletAddress, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
        console.log('receiverAssociatedTokenAddress:', receiverAssociatedTokenAddress.toString());


        // console.log(`Sender Associated Token Account Address: ${senderAssociatedTokenAddress.toBase58()}`);
        // console.log(`Receiver Associated Token Account Address: ${receiverAssociatedTokenAddress.toBase58()}`);

        const transaction = new Transaction();

        // Check if the sender's associated token account exists
        const senderAccountInfo = await connection.getAccountInfo(senderAssociatedTokenAddress);
        console.log('senderAccountInfo:', senderAccountInfo);
        if (!senderAccountInfo) {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    senderWalletAddress,
                    senderAssociatedTokenAddress,
                    senderWalletAddress,
                    tokenMint,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                )
            );
        }

        // Check if the receiver's associated token account exists
        const receiverAccountInfo = await connection.getAccountInfo(receiverAssociatedTokenAddress);
        console.log('receiverAccountInfo:', receiverAccountInfo);
        if (!receiverAccountInfo) {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    senderWalletAddress,
                    receiverAssociatedTokenAddress,
                    receiverWalletAddress,
                    tokenMint,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                )
            );
        }

        transaction.add(
            createTransferInstruction(
                senderAssociatedTokenAddress,
                receiverAssociatedTokenAddress,
                senderWalletAddress,
                amount,
                [],
                TOKEN_PROGRAM_ID
            )
        );

        const { blockhash } = await connection.getLatestBlockhash();
        console.log('blockhash:', blockhash);
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderWalletAddress;
        console.log('transaction:', transaction);

        return {
            transaction,
            senderAssociatedTokenAddress: senderAssociatedTokenAddress.toString(),
            receiverAssociatedTokenAddress: receiverAssociatedTokenAddress.toString(),
        }
    } catch (error) {
        console.error('Payment error:', error);
        throw error;
    }
}