import { BaseService } from './baseService';
import apiClient from './apiService';

export class AppConfigService extends BaseService<any> {
    constructor() {
        super('app-config');
    }

    async getVault(): Promise<string> {
        const response = await apiClient.get<any>(`/${this.entity}/get-vault`);
        const { data } = response;
        return data.vaultAddress;
    }

    async getStatistics(): Promise<any> {
        const response = await apiClient.get<any>(`/${this.entity}/statistics`);
        return response.data;
    }
    
}
