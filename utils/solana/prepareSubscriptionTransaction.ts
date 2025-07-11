import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token';

export async function prepareSubscriptionTransaction(connection: Connection, payerWallet: string, receiverAddresses: string[], tokenMintAddress: string, amount: number): Promise<any> {
    if (!payerWallet) {
        throw new Error('Payer wallet is not available');
    }

    if (receiverAddresses.length === 0) {
        throw new Error('At least one receiver address is required');
    }

    try {
        console.log('Starting getTransferTokenTransaction');
        console.log('payerWallet:', payerWallet);
        console.log('receiverAddresses:', receiverAddresses);
        console.log('tokenMintAddress:', tokenMintAddress);
        console.log('amount:', amount);

        const senderWalletAddress = new PublicKey(payerWallet);
        console.log('senderWalletAddress:', senderWalletAddress.toString());

        const tokenMint = new PublicKey(tokenMintAddress);
        console.log('tokenMint:', tokenMint.toString());

        const senderAssociatedTokenAddress = await getAssociatedTokenAddress(tokenMint, senderWalletAddress, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
        console.log('senderAssociatedTokenAddress:', senderAssociatedTokenAddress.toString());

        const transaction = new Transaction();
        const receiverAssociatedTokenAddresses: string[] = [];

        // Check if the sender's associated token account exists
        const senderAccountInfo = await connection.getAccountInfo(senderAssociatedTokenAddress);
        console.log('senderAccountInfo:', senderAccountInfo);
        if (!senderAccountInfo) {
            transaction.add(createAssociatedTokenAccountInstruction(senderWalletAddress, senderAssociatedTokenAddress, senderWalletAddress, tokenMint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID));
        }

        // Calculate the amount to send to each receiver
        const amountPerReceiver = amount / receiverAddresses.length;   

        // const amountPerReceiver = Math.floor(amount / receiverAddresses.length); // Divide total amount by number of receivers

        for (const receiverAddress of receiverAddresses) {
            const receiverWalletAddress = new PublicKey(receiverAddress);
            // console.log('receiverWalletAddress:', receiverWalletAddress.toString());

            const receiverAssociatedTokenAddress = await getAssociatedTokenAddress(tokenMint, receiverWalletAddress, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
            console.log('receiverAssociatedTokenAddress:', receiverAssociatedTokenAddress.toString());

            receiverAssociatedTokenAddresses.push(receiverAssociatedTokenAddress.toString());

            // Check if the receiver's associated token account exists
            const receiverAccountInfo = await connection.getAccountInfo(receiverAssociatedTokenAddress);
            console.log('receiverAccountInfo:', receiverAccountInfo);
            if (!receiverAccountInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(senderWalletAddress, receiverAssociatedTokenAddress, receiverWalletAddress, tokenMint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID),
                );
            }
            console.log({
                senderAssociatedTokenAddress, receiverAssociatedTokenAddress, senderWalletAddress, amountPerReceiver, TOKEN_PROGRAM_ID
            })
            transaction.add(createTransferInstruction(senderAssociatedTokenAddress, receiverAssociatedTokenAddress, senderWalletAddress, amountPerReceiver, [], TOKEN_PROGRAM_ID));
        }

        const { blockhash } = await connection.getLatestBlockhash();
        console.log('blockhash:', blockhash);
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderWalletAddress;
        console.log('transaction:', transaction);

        return transaction;
        // return {
        //   transaction,
        //   senderAssociatedTokenAddress: senderAssociatedTokenAddress.toString(),
        //   receiverAssociatedTokenAddresses,
        // };
    } catch (error) {
        console.error('Payment error:', error);
        throw error;
    }
}
