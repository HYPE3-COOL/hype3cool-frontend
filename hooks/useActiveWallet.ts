import { useEffect, useState } from 'react';
import { ConnectedSolanaWallet, useSolanaWallets } from '@privy-io/react-auth/solana';

const useActiveWallet = () => {
    const { wallets } = useSolanaWallets();

    const [activeWallet, setActiveWallet] = useState<ConnectedSolanaWallet>();
    const [isPrivyWallet, setIsPrivyWallet] = useState<boolean>(false);

    useEffect(() => {
        getUserActiveWallet();
    }, [wallets]);

    const getUserActiveWallet = () => {
        if (wallets.length > 1) {
            const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy' && wallet.connectorType === 'embedded');
            setActiveWallet(embeddedWallet ? embeddedWallet : wallets[0]);
            setIsPrivyWallet(embeddedWallet ? true : false);
        } else if (wallets.length === 1) {
            setActiveWallet(wallets[0]);
        } else {
            setActiveWallet(undefined);
        }
    };

    return {
        activeWallet,
        isPrivyWallet,
    };
};

export default useActiveWallet;
