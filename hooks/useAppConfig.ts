import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppConfigService } from '@/lib/api/appConfigService';
import { Agent, Statistics } from '@/types/types';

const appConfigService = new AppConfigService();

export const useMainVault = () => {
    return useQuery<string>({
        queryKey: ['mainVault'],
        queryFn: () => appConfigService.getVault(),
    });
};


export const useStatistics = () => {
    return useQuery<Statistics>({
        queryKey: ['statistics'],
        queryFn: () => appConfigService.getStatistics(),
    });
}
