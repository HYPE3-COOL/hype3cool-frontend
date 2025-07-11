// src/api/userService.ts
import { ApiResponse } from './apiResponse';
import apiClient from './apiService';
import { BaseService } from './baseService';
import { Holding, User } from '@/types/types';

export class AuthService extends BaseService<User> {
    constructor() {
        super('auth'); // Pass the entity name to the base service
    }

    async linkAsCreator(): Promise<any> {
        const response = await apiClient.post<any>(
            `/${this.entity}/creator/link`,
            {},
            {
                headers: { 'Requires-Auth': true },
            },
        );
        return response.data;
    }

    async unlinkAsCreator(): Promise<any> {
        const response = await apiClient.post<any>(
            `/${this.entity}/creator/unlink`,
            {},
            {
                headers: { 'Requires-Auth': true },
            },
        );
        return response.data;
    }

    // get holdings of linked creator
    async getHoldings(): Promise<Holding[]> {
        const response = await apiClient.get<any>(`/${this.entity}/creator/holdings`, {
            headers: { 'Requires-Auth': true },
        });

        const data = response.data;
        return data.holdings ?? [];
    }

    async createWithdrawal(data: any): Promise<any> {
        const response = await apiClient.post<any>(`/${this.entity}/creator/holdings/withdraw`, data, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }
}
