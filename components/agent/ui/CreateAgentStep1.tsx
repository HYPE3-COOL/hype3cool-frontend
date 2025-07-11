'use client';
import React from 'react';

import { TwitterLinkButton } from '@/components/elements/buttons';

import { useMutation } from '@tanstack/react-query';
import { Character, Twitter } from '@/types/types';


import BaseButton from './BaseButton';
import { transformToTwitter } from '@/utils/transform';

import { setSuggestedTwitters, setProfilePic, setIsAnalyzeLoading, setCreateAgentStep, setAgentCharacter } from '@/store/slices/agent';
import { dispatch, useSelector } from '@/store';
import { AgentService } from '@/lib/api/agentService';

type CreateAgentStep1Props = {
    twitter: any;
};

const CreateAgentStep1 = ({ twitter }: CreateAgentStep1Props) => {
    const { isAnalyzeLoading } = useSelector((state: any) => state.agent);

    // 1. Get suggested twitter accounts
    const getSuggestTwitterAccounts = useMutation({
        mutationFn: (username: string) => new AgentService().getSuggestTwitterAccounts(username),
        onMutate: () => {
            dispatch(setIsAnalyzeLoading('loading'));
        },
        onSuccess: async (data: Twitter[]) => {
            // 1. get suggested twitter accounts
            let accounts: Twitter[] = [];

            for (let i = 0; i < data.length; i++) {
                accounts.push(transformToTwitter(data[i]));
            }

            dispatch(setSuggestedTwitters(accounts));

            // 2. generate character based on suggested twitter accounts
            if (accounts.length > 0) {
                const usernames = accounts.map((account) => account.username);
                generateBasicCharacter.mutate(usernames);
            }
        },
        onError: (error) => {
            // Handle error
            console.error('Error suggesting Twitter accounts:', error);
        },
    });

    // 2. Generate basic character
    const generateBasicCharacter = useMutation({
        mutationFn: (usernames: string[]) => new AgentService().generateBasicCharacter(usernames),
        onSuccess: (data: Character) => {
            dispatch(
                setAgentCharacter({
                    name: data?.name ?? '',
                    intro: data?.description ?? '',
                    bio: '',
                    lore: '',
                    knowledge: '',
                    topics: '',
                    style: '',
                    chat: '',
                    posts: '',
                    adjectives: '',
                    language: 'en',
                    withHashTags: false,
                }),
            );

            dispatch(setProfilePic(data?.avatar ?? ''));
            dispatch(setIsAnalyzeLoading('success'));
        },
        onError: (error) => {
            // Handle error
            console.error('Error suggesting Twitter accounts:', error);
        },
    });

    const handleSuggestTwitterAccounts = async (username: string) => {
        getSuggestTwitterAccounts.mutate(username);
    };

    return (
        <div className="w-60 pb-[60px]">
            <div className="text-white h-subheading-neo mb-[42px]">PROFILE</div>

            <div className="rounded-lg w-60 h-60 mb-6">
                <img className="rounded-lg w-full h-full" src={twitter?.image} alt={twitter.name} />
            </div>

            <div className="mt-6 mb-2.5">{twitter.username && <TwitterLinkButton username={twitter.username} />}</div>
            <div className="creator-basic-info mb-6">
                <div className="text-white text-2xl font-normal font-neopixel uppercase leading-tight tracking-wide">{twitter?.name}</div>
                <div className="flex flex-row items-center space-x-1">
                    <span className="text-slate-400 text-xs font-semibold font-figtree leading-tight tracking-tight">@{twitter.username}</span>
                    {twitter?.verified && <span className="icon-badge text-blue-200" />}
                </div>

                <div className="mt-[30px] mb-[26px]">
                    <BaseButton
                        type="button"
                        label="ANALYZE"
                        onClick={() => handleSuggestTwitterAccounts(twitter.username)}
                        disabled={getSuggestTwitterAccounts.isPending || isAnalyzeLoading === 'loading'}
                    />
                </div>
                <button
                    type="button"
                    className="text-center text-blue-200 text-base font-semibold font-figtree leading-snug tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => dispatch(setCreateAgentStep(2))}
                    disabled={getSuggestTwitterAccounts.isPending || isAnalyzeLoading === 'loading'}
                >
                    Skip to manually create 👉🏻
                </button>
            </div>
        </div>
    );
};

export default CreateAgentStep1;
