// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { SolanaService } from '@/lib/api/solanaService';
import { TokenService } from '@/lib/api/tokenService';
import { Token } from '@/types/types';

const tokenService = new TokenService();

export const useTokenMarketData = (mintAddress: string) => {
    return useQuery<any>({
        queryKey: ['marketData', mintAddress],
        // queryFn: () => SolanaService.getMarketData(mintAddress),
        queryFn: () => SolanaService.getTokenMetadata(mintAddress),
        enabled: !!mintAddress,
        // retry: false,
        refetchInterval: 60000, // 60 seconds
    });
};

export const useMarketData = () => {
    return useQuery<Token[]>({
        queryKey: ['tokenPrices'],
        queryFn: () => tokenService.fetchAll(),
        refetchInterval: 60000, // 60 seconds
        refetchOnMount: true, // Refetch when the component mounts
        refetchOnWindowFocus: true, // Refetch when the window regains focus
    });
};
