import { BaseService } from './baseService';
import apiClient from './apiService';
// import { Subscription } from '@/types/types';

export class SubscriptionService extends BaseService<any> {
    constructor() {
        super('subscriptions');
    }

    async checkActiveSubscription(agentId: string): Promise<boolean> {
        const response = await apiClient.get<any>(`${this.entity}/check-active-subscription/${agentId}`, {
            headers: { 'Requires-Auth': false },
        });
        
        return response?.data?.isActive ?? false;
    }

    async getMonthlyPlanCharge(): Promise<number> {
        const response = await apiClient.get<any>(`${this.entity}/get-charge/monthly`, {
            headers: { 'Requires-Auth': false },
        });
        
        return response?.data ?? 0;
    }
}
