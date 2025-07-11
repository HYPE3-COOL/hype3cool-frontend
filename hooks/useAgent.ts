// src/hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgentService } from '@/lib/api/agentService';
import { Agent } from '@/types/types';

const agentService = new AgentService();

export const useAgentByUsername = (username: string) => {
    return useQuery<Agent[]>({
        queryKey: ['agents', username],
        queryFn: () => agentService.fetchByUsername(username),
        enabled: !!username,
        retry: false,
    });
};

export const useAgentById = (id: string) => {
    return useQuery<Agent>({
        queryKey: ['agent', id],
        queryFn: () => agentService.fetchOne(id, false),
        enabled: !!id,
        retry: false,
    });
};

export const useAgents = (query: any) => {
    return useQuery<Agent[]>({
        queryKey: ['agents', query],
        queryFn: () => agentService.fetchAll(query),
    });
};

export const useGetCreatorsWallet = (id: string) => {
    return useQuery<string[]>({
        queryKey: ['receiverWallets', id],
        queryFn: () => agentService.getCreatorsWallet(id),
        enabled: !!id,
        retry: false,
    });
}
