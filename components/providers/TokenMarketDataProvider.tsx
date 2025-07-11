'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePrivy, useToken, useLogout, useLogin } from '@privy-io/react-auth';
import { jwtDecode } from 'jwt-decode';

// redux
import { dispatch, IRootState, useSelector } from '@/store';
import { getMe } from '@/store/slices/auth';
import { setMainDialog } from '@/store/slices/menu';
import { closeSidebar } from '@/store/slices/themeConfigSlice';
import { useMarketData } from '@/hooks/useToken';
import { Token } from '@/types/types';

interface TokenMarketDataProviderProps {
    children: ReactNode;
}

interface TokenPricesContextValue {
    tokenPrices: Record<string, Token>;
}

export const TokenPricesContext = createContext<TokenPricesContextValue>({
    tokenPrices: {},
});

export const TokenMarketDataProvider = ({ children }: TokenMarketDataProviderProps) => {
    // const { data } = useQuery(['tokenPrices'], fetchTokenPrices);
    const { data, isLoading, error } = useMarketData();

    const [tokenPrices, setTokenPrices] = useState<Record<string, Token>>({});

    useEffect(() => {
        if (data) {
            const tokenPricesMap = data.reduce((acc: Record<string, Token>, token: Token) => {
                acc[token.address] = token;
                return acc;
            }, {});
            setTokenPrices(tokenPricesMap);
        }
    }, [data]);

    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error.message}</div>;

    // return <TokenPricesContext.Provider value={value}>{children}</TokenPricesContext.Provider>;

    const value: TokenPricesContextValue = {
        tokenPrices,
    };

    return <TokenPricesContext.Provider value={value}>{children}</TokenPricesContext.Provider>;
};

// export const useAuth = () => useContext(AuthContext);
export const useTokenPrices = () => useContext(TokenPricesContext);
