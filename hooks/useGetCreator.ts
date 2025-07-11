import { useQuery } from '@tanstack/react-query';
import { CreatorService } from '@/lib/api/creatorService';

const creatorService = new CreatorService();

export const useGetCreator = (username: string) => {
    return useQuery({
        queryKey: ['creator', username],
        queryFn: () => creatorService.fetchByUsername(username),
        enabled: !!username,
        // retry: false,
    });
};