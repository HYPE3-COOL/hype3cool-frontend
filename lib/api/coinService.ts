import apiClient from './apiService';
import { BaseService } from './baseService';
import { Coin } from '@/types/types';

export class CoinService extends BaseService<Coin> {
    constructor() {
        super('coins'); // Pass the entity name to the base service
    }

    // create coin by agent
    async createByAgent(data: any): Promise<Coin> {
        const response = await apiClient.post(`/coins/create-by-agent`, data, {
            headers: { 'Requires-Auth': true },
        });

        return response.data;
    }

    // create coin by address
    async createByAddress(data: any): Promise<Coin> {
        const response = await apiClient.post(`/coins/create-by-address`, data, {
            headers: { 'Requires-Auth': true },
        });

        return response.data;
    }
}
