'use client';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors, useFundWallet } from '@privy-io/react-auth/solana';

const solanaConnectors = toSolanaWalletConnectors({
    shouldAutoConnect: true,
});

export default function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
    // const isTest = process.env.NEXT_PUBLIC_ENV === 'prod' ? false : true;

    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
                embeddedWallets: {
                    solana: {
                        createOnLogin: 'users-without-wallets',
                    },
                    // createOnLogin: "off", // 'off', 'users-without-wallets', and 'all-users'
                    // requireUserPasswordOnCreate: false,
                },
                appearance: {
                    // Use 'solana-only' or 'ethereum-and-solana'
                    walletChainType: 'solana-only',
                    logo: '/assets/images/hype3-full-logo.png',
                    landingHeader: 'Welcome to HYPE3.cool',
                    accentColor: '#6A6FF5',
                    theme: '#222224',
                    showWalletLoginFirst: false,
                    walletList: ['detected_solana_wallets'],
                },
                externalWallets: {
                    solana: {
                        connectors: solanaConnectors,
                    },
                },
                // loginMethods: ['wallet', 'email', 'twitter', 'google'],
                loginMethods: ['wallet', 'twitter'],
                // loginMethods: isTest ? ['wallet', 'email', 'twitter'] : ['wallet'],
                fundingMethodConfig: {
                    moonpay: {
                        useSandbox: true,
                    },
                },
                mfa: {
                    noPromptOnMfaRequired: false,
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
