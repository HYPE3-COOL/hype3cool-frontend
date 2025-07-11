'use client';
import React, { useEffect, useRef, useState } from 'react';

import { Button, FormLabel, Input, FormErrorMessage, InputGroup, InputLeftAddon, InputLeftElement } from '@chakra-ui/react';

// form
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { dispatch, IRootState, useSelector } from '@/store';
import { showMessage } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { closeMainDialog } from '@/store/slices/menu';
import { useGetHoldings } from '@/hooks/useAuthUser';
import OutstandingBalanceTable from '@/components/creator/ui/OutstandingBalanceTable';

// privy
import { useSendTransaction, useSolanaWallets, ConnectedSolanaWallet } from '@privy-io/react-auth/solana';
import { prepareWithdrawTransaction } from '@/utils/solana/prepareWithdrawTransaction';
import { Connection } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/lib/api/authService';
import { sign } from 'crypto';
import { BaseButton } from '@/components/agent/ui';
import { usePrivy } from '@privy-io/react-auth';
import { WalletAddressChip } from '@/components/common/ui';
import { getUserActiveWallet } from '@/utils/privy/privyUtil';

const schema = yup.object().shape({
    receiverAddress: yup.string().required('Receiver address is required'),
});

const WithdrawHoldingsDialog = () => {
    const router = useRouter();
    const { authUser } = useSelector((state: IRootState) => state.auth);
    const { user: userPrivy } = usePrivy();

    const { data: holdings, error, isLoading, refetch } = useGetHoldings();

    // privy hooks
    // const connection = new Connection(process.env.NEXT_PUBLIC_ENV === 'prod' ? 'https://api.mainnet.solana.com' : 'https://api.devnet.solana.com', 'confirmed');
    const connection = new Connection(process.env.NEXT_PUBLIC_ENV === 'prod' ? process.env.NEXT_PUBLIC_HELIUS_RPC! : 'https://api.devnet.solana.com', 'confirmed');
    const { wallets } = useSolanaWallets();
    const { sendTransaction } = useSendTransaction();

    // get the payer wallet (solana wallet of privy user)
    const [payerWallet, setPayerWallet] = useState<ConnectedSolanaWallet>();    
    useEffect(() => {
        if (wallets) {
            const _payerWallet = getUserActiveWallet(wallets);
            if (_payerWallet) {
                setPayerWallet(_payerWallet);
            }
        } else {
            setPayerWallet(undefined);
        }
    }, [wallets]);    

    const {
        control,
        handleSubmit,
        setError,
        register,
        formState: { errors, isValid, isDirty },
        setValue,
        watch,
        reset,
        setFocus,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            receiverAddress: '',
        },
        // mode: 'onChange',
    });

    const [isCreateWithdrawalLoading, setIsCreateWithdrawalLoading] = useState(false);
    const createWithdrawal = useMutation({
        mutationFn: (data: any) => new AuthService().createWithdrawal(data),
        onMutate: () => {
            setIsCreateWithdrawalLoading(true);
        },
        onSuccess: (data: any) => {
            setIsCreateWithdrawalLoading(false);
            showMessage(`The withdraw of all outstanding balances is done successfully!`, 'success');
            dispatch(closeMainDialog());
            // router.push(`/user/${authUser.username}`);
        },
        onError: (error) => {
            // Handle error
            console.error('Error in updating Agent CA:', error);
        },
    });

    const onSubmit = async (formData: any) => {
        if (!payerWallet) {
            showMessage('Payer wallet is not available', 'error');
            return;
        }

        if (!holdings || holdings.length === 0) {
            showMessage('At least one holding is required', 'error');
            return;
        }

        try {
            // fetch receiver wallets (privy embedded wallets)
            // const receiverWallets = await getReceiverWallets(agent?._id as string);
            const transaction = await prepareWithdrawTransaction(connection, payerWallet?.address, formData.receiverAddress, holdings);
            let signature: string;

            if (payerWallet?.walletClientType === 'privy') {
                const txReceipt = await sendTransaction({
                    transaction,
                    connection,
                    uiOptions: {
                        description: 'Withdraw of Outstanding Holdings',
                        buttonText: 'Confirm Withdraw',
                    },
                });

                console.log('txReceipt:', txReceipt);
                signature = txReceipt.signature;

                // await txReceipt.signedTransaction();
            } else {
                const signedTransaction = await payerWallet.signTransaction(transaction);
                signature = await connection.sendRawTransaction(signedTransaction.serialize());
                await connection.confirmTransaction(signature);
                console.log('Transaction confirmed with signature:', signature);
            }

            createWithdrawal.mutate({
                signature,
                payerAddress: payerWallet.address,
                receiverAddress: formData.receiverAddress,
                holdings,
            });
        } catch (error) {
            console.log('Error in sending transaction:', error);
            showMessage('Error in sending transaction', 'error');
        }


    };

    return (
        <div className="w-full pl-7 pr-6 pt-9 pb-6 bg-black rounded-lg shadow border border-blue-200/10">
            {/* {holdings && <OutstandingBalanceTable holdings={holdings} />} */}

            <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="relative mb-6">
                    <div>
                        <div className="justify-start text-slate-400/80 text-base font-semibold font-figtree mb-3">Your wallet address:</div>

                        <div className="flex items-center justify-between">
                            {payerWallet?.address && <WalletAddressChip address={payerWallet?.address} prefix={''} />}
                            <div>
                                <div className="text-right justify-center text-slate-400/80 text-base font-semibold font-figtree">0 SOL</div>
                            </div>
                        </div>

                        {holdings && <OutstandingBalanceTable holdings={holdings} />}
                        <div className="justify-start text-slate-400/80 text-base font-semibold font-figtree mb-2.5">Withdrawal Address</div>

                        <div className="w-full h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3 hover:border-blue-200 hover:border">
                            <input
                                {...register('receiverAddress')}
                                className="w-full h-full bg-transparent text-white text-sm font-semibold font-figtree outline-none"
                                placeholder="Enter your CA address"
                                // disabled={disabled}
                                autoComplete="off"
                            />
                        </div>

                        {errors.receiverAddress && typeof errors.receiverAddress?.message === 'string' && <div className="mt-2 font-semibold text-rose-400">{errors.receiverAddress?.message}</div>}
                    </div>
                </div>

                <div className="flex flex-col gap-5 py-4">
                    <BaseButton type="submit" label="WITHDRAW" disabled={!isValid} />
                </div>
            </form>
        </div>
    );
};

export default WithdrawHoldingsDialog;
