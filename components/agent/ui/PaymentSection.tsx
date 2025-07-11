'use client';
import React, { useState, useEffect } from 'react';
import BaseButton from './BaseButton';

import { useMutation } from '@tanstack/react-query';

import { showMessage } from '@/utils/toast';
import { Agent } from '@/types/types';
import { PlanType } from '@/constants/constants';

// form
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// solana
import { Connection, PublicKey, SendTransactionError } from '@solana/web3.js';
import { SubscriptionService } from '@/lib/api/subscriptionService';
import { useRouter } from 'next/navigation';
import { IRootState, useSelector } from '@/store';

// privy
import { useSendTransaction, useSolanaWallets, ConnectedSolanaWallet } from '@privy-io/react-auth/solana';
import { prepareSubscriptionTransaction } from '@/utils/solana/prepareSubscriptionTransaction';
import { AgentService } from '@/lib/api/agentService';
import Link from 'next/link';
import { SolanaService } from '@/lib/api/solanaService';
import { getUserActiveWallet } from '@/utils/privy/privyUtil';
import { getMonthlyPlanCharge } from '@/hooks/useSubscription';

const schema = yup.object().shape({
    agent: yup.string().required('Agent is required'),
    plan: yup.string().oneOf(Object.values(PlanType)).required('Plan is required'),
    contractAddress: yup.string().when('plan', ([plan], schema) => {
        return plan == PlanType.MONTHLY ? schema.required('Contract address is required') : schema.notRequired();
    }),
});

type PaymentSectionProps = {
    agent?: Agent;
};

const PaymentSection = ({ agent }: PaymentSectionProps) => {
    const router = useRouter();

    const { authUser } = useSelector((state: IRootState) => state.auth);

    const { data: subscriptionCharge, error, isLoading } = getMonthlyPlanCharge();
    const [planAmount, setPlanAmount] = useState<number>(subscriptionCharge ?? 0);

    useEffect(() => {
        if (subscriptionCharge > 0) {
            setPlanAmount(subscriptionCharge);
        }
    }, [subscriptionCharge]);
    
    // privy hooks
    const { wallets } = useSolanaWallets();
    const { sendTransaction } = useSendTransaction();

    const connection = new Connection(process.env.NEXT_PUBLIC_ENV === 'prod' ? process.env.NEXT_PUBLIC_HELIUS_RPC! : 'https://api.devnet.solana.com', 'confirmed');
    // const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!, 'confirmed');

    const [payerWallet, setPayerWallet] = useState<ConnectedSolanaWallet>();

    const { register, handleSubmit, setValue, watch, formState } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            agent: agent?._id ?? '',
            plan: PlanType.TRIAL, // TODO: show the latest subscription plan
            contractAddress: agent?.contractAddress ?? '',
        },
    });

    const plan = watch('plan');

    const [isCreateSubscriptionLoading, setIsCreateSubscriptionLoading] = useState(false);
    const createSubscription = useMutation({
        mutationFn: (data: any) => new SubscriptionService().create(data),
        onMutate: () => {
            setIsCreateSubscriptionLoading(true);
        },
        onSuccess: (data: any) => {
            setIsCreateSubscriptionLoading(false);
            showMessage(`The subscription service of your agent starts successful!`, 'success');
            router.push(`/user/${authUser.username}`);
        },
        onError: (error) => {
            // Handle error
            console.error('Error in updating Agent CA:', error);
        },
    });

    const isContractAddressValid = (address: string | undefined) => {
        // Add your validation logic here if needed
        if (!address) return false;
        return address && address.trim() !== '';
    };

    const onSubmit = async (data: any) => {
        if (agent && agent?._id) {
            if (await checkActiveSubscription(agent?._id)) {
                showMessage('Agent already has an active subscription', 'error');
                return;
            }

            if (data.plan === PlanType.MONTHLY && !isContractAddressValid(data.contractAddress)) {
                showMessage('Contract address is required', 'error');
                return;
            }

            if (data.plan === PlanType.MONTHLY && !payerWallet) {
                showMessage('Payer wallet is not available', 'error');
                return;
            }

            if (data.plan === PlanType.MONTHLY && !connection) {
                showMessage('Connection is not available', 'error');
                return;
            }

            if (data.plan === PlanType.MONTHLY && !planAmount) {
                showMessage('Plan amount is not available', 'error');
                return;
            }

            if (data.plan === PlanType.MONTHLY && payerWallet?.address) {
                try {
                    // const {name, symbol, decimals} = await getTokenMetadata(data.contractAddress);
                    const { name, symbol, decimals } = await SolanaService.getTokenMetadata(data.contractAddress);

                    // fetch receiver wallets (privy embedded wallets)
                    const receiverWallets = await getReceiverWallets(agent?._id as string);
                    const transaction = await prepareSubscriptionTransaction(connection, payerWallet?.address, receiverWallets, data?.contractAddress!, planAmount * 10 ** decimals);
                    let signature: string;

                    if (payerWallet?.walletClientType === 'privy') {
                        const txReceipt = await sendTransaction({
                            transaction,
                            connection,
                            uiOptions: {
                                description: 'Subscription Payment',
                                buttonText: 'Confirm Payment',
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

                    createSubscription.mutate({
                        agent: data.agent,
                        plan: data.plan,
                        contractAddress: data.contractAddress,
                        payment: {
                            signature,
                            payerAddress: wallets[0].address,
                            receiverAddress: receiverWallets,
                            tokenAddress: data?.contractAddress!,
                            name,
                            symbol,
                            amount: planAmount,
                        },
                    });
                } catch (error) {
                    if (error instanceof SendTransactionError) {
                        console.error('Error in sending transaction:', error);
                        console.error('Transaction logs:', error.logs);
                    } else {
                        console.error('Error in sending transaction:', error);
                    }
                    showMessage('Error in sending transaction', 'error');
                }
            } else if (data.plan === PlanType.TRIAL) {
                createSubscription.mutate({
                    agent: data.agent,
                    plan: data.plan,
                });
            }
        }
    };

    const checkActiveSubscription = async (agentId: string): Promise<boolean> => {
        try {
            const isActive = await new SubscriptionService().checkActiveSubscription(agentId);
            return isActive;
        } catch (error) {
            console.error('Error in checking active subscription:', error);
            return false;
        }
    };

    const getReceiverWallets = async (agentId: string): Promise<string[]> => {
        return (await new AgentService().getCreatorsWallet(agentId)) ?? [];
    };

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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div className="text-white text-xl font-normal font-neopixel tracking-tight mb-[32px]">SUBSCRIZPTION</div>

                <div className="flex flex-row items-center justify-between mb-[32px]">
                    <div className="flex flex-col">
                        <div className="text-slate-400/80 text-xs font-semibold font-figtree mb-[3px]">Subscription</div>
                        <div className="text-white text-sm font-semibold font-figtree">{agent?.isActive ? 'Active' : 'Inactive'}</div>
                    </div>
                    {plan == PlanType.MONTHLY && (
                        <div className="text-right text-white/70 text-sm font-medium font-figtree leading-snug">
                            {agent?.suggestions?.length == 2 ? '50/50 of the fee will be credited to IP creators' : '100% of the fee will be credited to IP creator'}
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-y-5 mb-[30px]">
                    <button
                        id="plan-trial"
                        type="button"
                        onClick={() => setValue('plan', PlanType.TRIAL)}
                        className={`w-full h-[70px] bg-white/5 rounded-[5px] flex flex-row items-center justify-between space-x-4 px-6 py-4 hover:bg-blue-200/5 border ${
                            plan === PlanType.TRIAL ? 'border-blue-200' : 'border-transparent'
                        }`}
                        disabled={agent?.isActive}
                    >
                        <div className="text-white text-2xl font-normal font-neopixel uppercase leading-[18px] tracking-wide min-w-[100px] text-left">FREE</div>
                        <div className="text-white text-base font-medium font-figtree leading-snug text-right">1-week pass for automated X tweeting</div>
                    </button>

                    <button
                        id="plan-monthly"
                        type="button"
                        onClick={() => setValue('plan', PlanType.MONTHLY)}
                        className={`w-full h-[70px] bg-white/5 rounded-[5px] flex flex-row items-center justify-between space-x-4 px-6 py-4 hover:bg-blue-200/5 border ${
                            plan === PlanType.MONTHLY ? 'border-blue-200' : 'border-transparent'
                        }`}
                        disabled={agent?.isActive}
                    >
                        <div className="text-white text-2xl font-normal font-neopixel uppercase leading-[18px] tracking-wide min-w-[100px] text-left">
                            0.1 %<div className="text-white text-xs font-bold font-figtree uppercase mt-2">Pump Token Supply</div>
                        </div>
                        <div className="text-white text-base font-medium font-figtree leading-snug text-right">1-month pass for automated X tweeting</div>
                    </button>

                    <div className="mt-1.5">
                        <Link href="https://pump.fun/" target="_blank" className="flex items-center justify-end">
                            <div className="text-right text-blue-200 text-sm font-medium font-figtree leading-snug">
                                Don’t have a token? Launch one on pumpdotfun
                                {/* <div className="w-5 h-5 bg-cover bg-center" style={{ backgroundImage: `url('/assets/icons/pump-logo.webp'})` }} /> */}
                            </div>
                            <img className="w-5 h-5 ml-1" src="/assets/icons/pump-logo.webp" />
                        </Link>
                    </div>
                </div>
            </div>

            {plan === PlanType.MONTHLY && (
                <div className="mb-[35px] flex flex-col items-centerl gap-y-3">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center w-full">
                        <div className="text-slate-400/80 text-base font-semibold font-figtree whitespace-nowrap mb-2 lg:mb-0 lg:mr-2.5 flex items-center lg:w-1/4">Agent CA:</div>
                        {/* TODO: check the wallet of user if holding this agent ca */}
                        <div className="w-full lg:w-3/4 h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3 hover:border-blue-200 hover:border">
                            <input
                                {...register('contractAddress')}
                                className="w-full h-full bg-transparent text-white text-sm font-semibold font-figtree outline-none"
                                placeholder="Enter your CA address"
                                disabled={agent?.isActive || agent?.isSubscribed}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    {formState.errors['contractAddress'] && <div className="w-full text-right  font-semibold text-rose-400">{formState.errors['contractAddress']?.message}</div>}
                </div>
            )}
            <div>
                <BaseButton
                    type="submit"
                    label="SUBSCRIBE"
                    onClick={() => {}}
                    disabled={isCreateSubscriptionLoading || agent?.isActive}
                />
            </div>
        </form>
    );
};

export default PaymentSection;
