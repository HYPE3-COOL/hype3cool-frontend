// src/api/userService.ts
import { ApiResponse } from './apiResponse';
import apiClient from './apiService';
import { BaseService } from './baseService';
import { User } from '@/types/types';

export class UserService extends BaseService<User> {
    constructor() {
        super('users'); // Pass the entity name to the base service
    }

    // Method to fetch a user by username
    async fetchByUsername(username: string): Promise<User> {
        const response = await apiClient.get<any>(`/users/username/${username}`, {
            headers: { 'Requires-Auth': false }, // Assuming this is a public endpoint
        });
        
        return response.data;
    }
}
