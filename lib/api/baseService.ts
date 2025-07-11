// src/api/baseService.ts
import apiClient from './apiService';
import qs from 'qs';

export class BaseService<T> {
    entity: string;

    constructor(entity: string) {
        this.entity = entity;
    }

    async fetchAll(query: any = {}, requiresAuth: boolean = true): Promise<T[]> {
        let queryString = '';
        if (query) {
            queryString = qs.stringify(query, { encode: true });
        }

        const response = await apiClient.get<T[]>(`/${this.entity}${queryString ? '?' + queryString : ''}`, {
            headers: { 'Requires-Auth': requiresAuth },
        });
        return response.data;
    }

    async fetchOne(id: string, requiresAuth: boolean = true): Promise<T> {
        const response = await apiClient.get<T>(`/${this.entity}/${id}`, {
            headers: { 'Requires-Auth': requiresAuth },
        });
        return response.data;
    }

    async create(data: T): Promise<T> {
        const response = await apiClient.post<T>(`/${this.entity}`, data, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }

    async update(id: string, data: T): Promise<T> {
        const response = await apiClient.put<T>(`/${this.entity}/${id}`, data, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/${this.entity}/${id}`, {
            headers: { 'Requires-Auth': true },
        });
    }
}
