'use client';

import React from 'react';
import { useGetCreator } from '@/hooks/useGetCreator';

import { CreatorProfileCard, CreatorAgentDataTable, CreatorStatCard } from './ui';

import LoadingSpinner from '../elements/LoadingSpinner';

type CreatorProfileContentProps = {
    username: string;
};

const CreatorProfileContent = ({ username }: CreatorProfileContentProps) => {
    const { data: creator, error, isLoading } = useGetCreator(username);

    if (isLoading)
        return (
            <div className="flex items-center justify-center relative">
                <LoadingSpinner />
            </div>
        );
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {creator && (
                <>
                    <CreatorProfileCard creator={creator} />

                    <div className="mt-12 mb-[19px]">
                        <CreatorStatCard creator={creator} />
                    </div>

                    {creator.agents && (
                        <div className="mt-10">
                            <CreatorAgentDataTable username={username} agents={creator.agents || []} creator={creator} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CreatorProfileContent;
