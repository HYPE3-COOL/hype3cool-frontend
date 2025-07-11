'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import BaseAvatar from '@/components/user/BaseAvatar';
import { User } from '@/types/types';
import confirmDialog from '@/components/elements/confirm-dialog';
import { useAuth } from '@/components/auth/AuthProvider';

type AvatarNavItemProps = {
    user: User;
};

export default function AvatarNavItem({ user }: AvatarNavItemProps) {
    const { logout } = useAuth();

    const [confirmationModal, setConfirmationModal] = useState<any>(false);

    const handleDisconnect = async () => {
        logout();
        setConfirmationModal(false);
    };

    const handleOpenConfirmation = (e: any) => {
        e.preventDefault();
        setConfirmationModal(true);
    };

    // const getSolanaAddress = (linkedAccounts: any[]): string | null => {
    //     const solanaAccount = linkedAccounts.find((account) => account.chain_type === 'solana');
    //     return solanaAccount ? solanaAccount.address : null;
    // };


    // const [solanaWallet, setSolanaWallet] = useState<any>(null);
    
    // useEffect(() => {
    //     const wallet = user?.linkedAccounts.find((account) => account.chain_type === 'solana');
    //     setSolanaWallet(wallet?.address);
    // }, [user?.linkedAccounts]);


    // const [balance, setBalance] = useState<string>('0');
    // const getFundWalletBalance = async (address: string) => {
    //     try {
    //         const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!);
    //         const publicKey = new PublicKey(address);
    //         console.log({publicKey});
    //         const balance = await connection.getBalance(publicKey);
    //         const balanceInString = (balance / 10 ** 9).toString();
    //         setBalance(balanceInString);
    //         // setFundWalletPercentage((parseFloat(balanceInString) / TARGET_FUNDING_AMOUNT) * 100);
    //     } catch (error) {
    //         console.error('Error fetching balance:', error instanceof Error ? error.message : error);
    //     }
    // };

    // useEffect(() => {
    //     const interval = setInterval(
    //         () => {
    //             if (solanaWallet)
    //                 getFundWalletBalance(solanaWallet);
    //         },
    //         1 * 60 * 1000,
    //     );
    //     return () => clearInterval(interval);
    // }, [solanaWallet]);

    // console.log({user});

    return (
        <Menu as="div" className="relative">
            {({ open }) => (
                <>
                    <MenuButton className={`hidden sm:flex items-center sm:order-last flex-col-reverse sm:flex-row gap-2`}>
                        <BaseAvatar image={user?.image} />
                    </MenuButton>
                    <Transition
                        enter="duration-200 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="duration-300 ease-out"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <MenuItems
                            anchor="bottom end"
                            className="relative navbar-dropmenu mt-4"
                        >
                            <MenuItem>
                                <Link href={`/user/${user.username}`}>
                                    <h5 className="navbar-dropmenu-item text-right py-3">
                                        Profile
                                    </h5>
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <Link href="#" onClick={(e) => handleOpenConfirmation(e)}>
                                    <h5 className="navbar-dropmenu-item text-right py-3">
                                        Disconnect
                                    </h5>
                                </Link>
                            </MenuItem>
                            {/* <MenuItem>
                                <Link href="#">
                                    <h5 className="text-right text-slate-400 text-base font-figtree leading-sung tracking-tight hover:text-blue-200 active:text-blue-200 font-semibold py-2.5">
                                        Balance: 0 SOL
                                    </h5>
                                </Link>
                            </MenuItem> */}
                        </MenuItems>
                    </Transition>
                    {confirmDialog('Disconnect wallet?', confirmationModal, setConfirmationModal, handleDisconnect)}
                </>
            )}
        </Menu>
    );
}
