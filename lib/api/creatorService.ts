import { BaseService } from './baseService';
import apiClient from './apiService';
import { Creator } from '@/types/types';

export class CreatorService extends BaseService<Creator> {
    constructor() {
        super('creator');           // no 's', TODO: will do later
    }

    async fetchByUsername(username: string): Promise<Creator> {
        const response = await apiClient.get<any>(`${this.entity}/${username}`, {
            headers: { 'Requires-Auth': false },
        });

        return response.data;
    }
}
