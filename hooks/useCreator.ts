// src/hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatorService } from '@/lib/api/creatorService';
import { Creator } from '@/types/types';

const creatorService = new CreatorService();

// export const useAgentByUsername = (username: string) => {
//     return useQuery<Agent[]>({
//         queryKey: ['agents', username],
//         queryFn: () => agentService.fetchByUsername(username),
//         enabled: !!username,
//         retry: false,
//     });
// };

// export const useAgentById = (id: string) => {
//     return useQuery<Agent>({
//         queryKey: ['agent', id],
//         queryFn: () => agentService.fetchOne(id, false),
//         enabled: !!id,
//         retry: false,
//     });
// };

export const useCreators = (query: any) => {
    return useQuery<Creator[]>({
        queryKey: ['creators', query],
        queryFn: () => creatorService.fetchAll(query),
    });
};
