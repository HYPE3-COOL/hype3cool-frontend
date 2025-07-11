// src/hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/lib/api/userService';
import { User } from '@/types/types';

const userService = new UserService();

export const useGetUser = (username: string) => {
    return useQuery<User>({
        queryKey: ['user', username],
        queryFn: () => userService.fetchByUsername(username),
        // queryFn: () => getUser(username),
        enabled: !!username,
    });
};