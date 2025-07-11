// import {
//     ConfirmedSignatureInfo,
//     Connection,
//     LAMPORTS_PER_SOL,
//     ParsedAccountData,
//     PublicKey,
//     SignaturesForAddressOptions,
//     Transaction,
//     TransactionConfirmationStatus,
//     clusterApiUrl,
// } from '@solana/web3.js';
// import * as spl from '@solana/spl-token';
// import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token';
// import { Metaplex } from '@metaplex-foundation/js';
// import { Metadata, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';

import axios from 'axios';

const DEXSCREEN_API = 'https://api.dexscreener.com/latest/dex/tokens';

export interface TokenMetadata {
    name: string;
    symbol: string;
    decimals: number;
}

export class SolanaService {
    static async getTokenMetadata(tokenAddress: string) {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_HELIUS_RPC!, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 'text',
                    method: 'getAsset',
                    params: { id: tokenAddress },
                }),
            });
            const data = await response.json();
            return {
                name: data?.result?.content?.metadata?.name ?? '',
                symbol: data?.result?.content?.metadata?.symbol ?? '',
                decimals: data?.result?.token_info?.decimals ?? 6,
                token_info: data?.result?.token_info ?? {},
                marketCap: (data?.result?.token_info?.price_info?.price_per_token * data?.result?.token_info?.supply) / 10 ** data?.result?.token_info?.decimals,
                currency: data?.result?.token_info?.price_info?.currency,
            };
        } catch (error) {
            console.log('Error in getting token metadata:', error);
            return {
                name: '',
                symbol: '',
                decimals: 6,
            };
        }
    }

    static async getMarketData(tokenAddress: string) {
        try {
            const response = await axios.get(`${DEXSCREEN_API}/${tokenAddress}`);

            if (response.data && response.data.pairs) {
                return {
                    value: response.data?.pairs[0]?.fdv ?? 0,
                };
            } else {
                return {
                    value: 0,
                };
            }

            // if (response.data?.pairs) {
            //     setPairs(response.data.pairs);
            //     if (response.data.pairs.length > 0) {
            //         setVolumn(response.data.pairs[0].volume.h24);
            //         setMarketCap(response.data.pairs[0].fdv);
            //         setPriceNative(parseFloat(response.data.pairs[0].priceNative));
            //         setPriceUsd(parseFloat(response.data.pairs[0].priceUsd));
            //         setDailyChange(parseFloat(response.data.pairs[0].priceChange.h24));
            //     }
            // }
        } catch (error) {
            console.error('Error fetching dex pairs:', error);
            // setPairs([]); // Reset pairs on error
        } finally {
            // setIsLoading(false);
        }
    }

    // static async getTokenMetadata(tokenAddress: string) {
    //     // try {
    //     let tokenJson;
    //     // const connection = new Connection('https://api.mainnet-beta.solana.com');

    //     const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!); // Replace mainnet-beta with the desired network
    //     const metaplex = Metaplex.make(connection);
    //     const mintAddress = new PublicKey(tokenAddress);

    //     const metadataAccount = metaplex.nfts().pdas().metadata({ mint: mintAddress });

    //     const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

    //     if (!metadataAccountInfo)
    //         throw new Error('Metadata account not found');
    //         // throw new NotFoundException('Metadata account not found');

    //     if (metadataAccountInfo) {
    //         const token: any = await Promise.race([
    //             metaplex.nfts().findByMint({ mintAddress: mintAddress }),
    //             new Promise((resolve, reject) => {
    //                 setTimeout(() => {
    //                     reject(new Error('Request timed out'));
    //                 }, 20000);
    //             }),
    //         ]);

    //         tokenJson = token;
    //     }

    //     // console.log({ mintAddress, metadataAccount, metadataAccountInfo });

    //     // const [metadataAddress] = await PublicKey.findProgramAddressSync([Buffer.from('metadata'), PROGRAM_ID.toBuffer(), new PublicKey(tokenAddress).toBuffer()], PROGRAM_ID);

    //     // Fetch the metadata account data
    //     // const accountInfo = await connection.getAccountInfo(metadataAddress);

    //     return {
    //         ...tokenJson,
    //         // key: accountInfo ? Metadata.deserialize(accountInfo.data)[0].key : undefined,
    //     };
    //     // } catch (error) {
    //     //   throw new BadRequestException(error);
    //     //   // throw error;
    //     // }
    // }
}
