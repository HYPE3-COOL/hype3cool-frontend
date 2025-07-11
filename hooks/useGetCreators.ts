import { useQuery } from '@tanstack/react-query';
import { Creator } from '@/types/types';
import axios from 'axios';

export const getCreators = async (): Promise<Creator[]> => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/creator`);
    return data.data;
};

export const useGetCreators = () => {
    return useQuery({
        queryKey: ['creators'],
        queryFn: () => getCreators(),
    });
};
