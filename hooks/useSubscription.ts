// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { SubscriptionService } from '@/lib/api/subscriptionService';


const subscriptionService = new SubscriptionService();

export const getMonthlyPlanCharge = () => {
    return useQuery<number>({
        queryKey: ['subscriptionCharge'],
        queryFn: () => subscriptionService.getMonthlyPlanCharge(),
        initialData: 0,
    });
};
