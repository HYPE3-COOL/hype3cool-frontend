import { useQuery } from '@tanstack/react-query';
import { AuthService } from '@/lib/api/authService';
import { Holding } from '@/types/types';

const authService = new AuthService();

export const useGetHoldings = () => {
    return useQuery<Holding[]>({
        queryKey: ['holdings'],
        queryFn: () => authService.getHoldings(),
    });
};
