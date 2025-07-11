import { useQuery } from '@tanstack/react-query';

export const fetchProfile = async (username: string) => {
    const response = await fetch('/api/twitter/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }

    return response.json();
};

export const useGetTwitterProfile = (username: string) => {
    return useQuery<any>({
        queryKey: ['twitterProfile', username],
        queryFn: () => fetchProfile(username),
        enabled: !!username,
    });
};
