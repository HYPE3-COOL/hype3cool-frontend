import { BaseService } from './baseService';
import apiClient from './apiService';
// import { Agent } from '@/types/types';

export class TokenService extends BaseService<any> {
    constructor() {
        super('tokens');
    }

    async getAll(): Promise<any[]> {
        const response = await apiClient.get<any>(`${this.entity}`, {
            headers: { 'Requires-Auth': false },
        });

        return response.data;
    }
}
