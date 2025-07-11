import { useSendTransaction, useSolanaWallets, ConnectedSolanaWallet } from '@privy-io/react-auth/solana';

export const getUserActiveWallet = (wallets: ConnectedSolanaWallet[]): ConnectedSolanaWallet | undefined  => {
    let payerWallet: ConnectedSolanaWallet | undefined;

    if (wallets.length > 1) {
        const nonPrivyWallet = wallets.find((wallet) => wallet.walletClientType !== 'privy' && wallet.connectorType !== 'embedded');
        payerWallet = nonPrivyWallet ? nonPrivyWallet : wallets[0];
    } else if (wallets.length === 1) {
        payerWallet = wallets[0];
    } else {
        payerWallet = undefined;
    }

    return payerWallet;
};

export const getUserActiveWalletFromLinkAccounts = (accounts: any[]): string => {
    let payerWallet = '';

    // Filter wallets of type 'wallet'
    const wallets = accounts.filter((account): account is any => account.type === 'wallet');

    if (wallets.length === 0) {
        payerWallet = '';
    }

    if (wallets.length === 1) {
        payerWallet = wallets[0].address;
    }

    if (wallets.length > 1) {
        const nonPrivyWallet = wallets.find((wallet) => wallet.wallet_client_type !== 'privy' && wallet.connector_type !== 'embedded');
        payerWallet = nonPrivyWallet ? nonPrivyWallet.address : wallets[0].address;
    }

    return payerWallet;
};
