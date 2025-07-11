import { BaseService } from './baseService';
import apiClient from './apiService';
import { Agent, GenerateCharacterAndTweetsRequest, Twitter } from '@/types/types';

export class AgentService extends BaseService<Agent> {
    constructor() {
        super('agents');
    }

    // Method to fetch a user by username
    async fetchByUsername(username: string): Promise<Agent[]> {
        const response = await apiClient.get<any>(`${this.entity}/username/${username}`, {
            headers: { 'Requires-Auth': false },
        });

        return response.data;
    }

    async updateAgentTwitter(id: string, data: any): Promise<Agent> {
        const response = await apiClient.put<any>(`${this.entity}/${id}/twitter`, data, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }

    async updateAgentDiscord(id: string, data: any): Promise<Agent> {
        const response = await apiClient.put<any>(`${this.entity}/${id}/discord`, data, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }

    async updateAgentTelegram(id: string, data: any): Promise<Agent> {
        const response = await apiClient.put<any>(`${this.entity}/${id}/telegram`, data, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }

    async updateAgentWebsite(id: string, data: any): Promise<Agent> {
        const response = await apiClient.put<any>(`${this.entity}/${id}/website`, data, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }

    async updateSocialLinks(id: string, data: any): Promise<Agent> {
        const response = await apiClient.put<any>(`${this.entity}/${id}/social-links`, data, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }

    async updateAgentContractAddress(id: string, data: any): Promise<Agent> {
        const response = await apiClient.put<any>(`${this.entity}/${id}/contract-address`, data, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }

    async updateAgentCredentials(id: string, data: any): Promise<Agent> {
        const response = await apiClient.put<any>(`${this.entity}/${id}/credentials`, data, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }

    // get creator wallets by agent id
    async getCreatorsWallet(id: string): Promise<string[]> {
        const response = await apiClient.get<any>(`${this.entity}/${id}/creators/wallet`, {
            headers: { 'Requires-Auth': true },
        });
        return response.data;
    }

    // send tweet manually
    async sendTweet(id: string): Promise<any> {
        const response = await apiClient.post<any>(
            `${this.entity}/${id}/send-tweet`,
            {},
            {
                headers: { 'Requires-Auth': true },
            },
        );
        return response.data;
    }

    async getSuggestTwitterAccounts(username: string): Promise<Twitter[]> {
        const response = await apiClient.post<any>(
            `${this.entity}/ai/suggest-twitter-accounts`,
            { username },
            {
                headers: { 'Requires-Auth': true },
            },
        );
        return response.data;
    }

    async generateBasicCharacter(usernames: string[]): Promise<any> {
        const response = await apiClient.post<any>(
            `${this.entity}/ai/generate-basic-character`,
            { usernames },
            {
                headers: { 'Requires-Auth': true },
            },
        );
        return response.data;
    }

    async generateCharacterAndTweets(data: GenerateCharacterAndTweetsRequest): Promise<any> {
        const response = await apiClient.post<any>(
            `${this.entity}/ai/generate-character-and-tweets`,
            { ...data },
            {
                headers: { 'Requires-Auth': true },
            },
        );
        return response.data;
    }

    async generateImage(prompt: string): Promise<any> {
        const response = await apiClient.post<any>(
            `${this.entity}/ai/generate-image`,
            { prompt },
            {
                headers: { 'Requires-Auth': true },
            },
        );
        return response.data;
    }
}
