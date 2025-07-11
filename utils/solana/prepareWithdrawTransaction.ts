import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token';
import { Holding } from '@/types/types';

export async function prepareWithdrawTransaction(connection: Connection, payerWallet: string, receiverAddress: string, holdings: Holding[]): Promise<Transaction> {
    if (!payerWallet) {
        throw new Error('Payer wallet is not available');
    }

    if (holdings.length === 0) {
        throw new Error('At least one holding is required');
    }

    try {
        console.log('Starting prepareWithdrawTransaction');
        console.log('payerWallet:', payerWallet);
        console.log('receiverAddress:', receiverAddress);
        console.log('holdings:', holdings);

        const senderWalletAddress = new PublicKey(payerWallet);
        console.log('senderWalletAddress:', senderWalletAddress.toString());

        const receiverWalletAddress = new PublicKey(receiverAddress);
        console.log('receiverWalletAddress:', receiverWalletAddress.toString());

        const transaction = new Transaction();

        for (const holding of holdings) {
            const tokenMint = new PublicKey(holding.tokenAddress);
            console.log('tokenMint:', tokenMint.toString());

            const senderAssociatedTokenAddress = await getAssociatedTokenAddress(tokenMint, senderWalletAddress, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
            console.log('senderAssociatedTokenAddress:', senderAssociatedTokenAddress.toString());

            const receiverAssociatedTokenAddress = await getAssociatedTokenAddress(tokenMint, receiverWalletAddress, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
            console.log('receiverAssociatedTokenAddress:', receiverAssociatedTokenAddress.toString());

            // Check if the sender's associated token account exists
            const senderAccountInfo = await connection.getAccountInfo(senderAssociatedTokenAddress);
            console.log('senderAccountInfo:', senderAccountInfo);
            if (!senderAccountInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(senderWalletAddress, senderAssociatedTokenAddress, senderWalletAddress, tokenMint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID),
                );
            }

            // Check if the receiver's associated token account exists
            const receiverAccountInfo = await connection.getAccountInfo(receiverAssociatedTokenAddress);
            console.log('receiverAccountInfo:', receiverAccountInfo);
            if (!receiverAccountInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(senderWalletAddress, receiverAssociatedTokenAddress, receiverWalletAddress, tokenMint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID),
                );
            }

            const amount = holding.amount * 10 ** 6; // Adjust the amount based on the token's decimals
            console.log({
                senderAssociatedTokenAddress,
                receiverAssociatedTokenAddress,
                senderWalletAddress,
                amount,
                TOKEN_PROGRAM_ID,
            });
            transaction.add(createTransferInstruction(senderAssociatedTokenAddress, receiverAssociatedTokenAddress, senderWalletAddress, amount, [], TOKEN_PROGRAM_ID));
        }

        const { blockhash } = await connection.getLatestBlockhash();
        console.log('blockhash:', blockhash);
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderWalletAddress;
        console.log('transaction:', transaction);

        return transaction;
    } catch (error) {
        console.error('Payment error:', error);
        throw error;
    }
}
