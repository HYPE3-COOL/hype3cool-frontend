// src/api/userService.ts

import apiClient from './apiService';
import { BaseService } from './baseService';


export class UploadService extends BaseService<any> {
    constructor() {
        super('upload'); // Pass the entity name to the base service
    }
    
    async uploadImageByUrl(url: string): Promise<any> {
        const response = await apiClient.post(`/${this.entity}/url`, { url }, {
            headers: { 'Requires-Auth': true },
        });
        console.log({uploadImageByUrl: response})
        return response.data;
    }
}
