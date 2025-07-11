'use client';
import React from 'react';

import { useAgentById } from '@/hooks/useAgent';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

import TwitterTimeline from '@/components/coin/elements/TwitterTimeline';
import TokenPriceChart from '../ui/TokenPriceChart';
import AgentProfileCard from '../ui/AgentProfileCard';

type AgentContentPageContainerProps = {
    id: string;
};

const AgentContentPageContainer = ({ id }: AgentContentPageContainerProps) => {
    const { data: agent, error, isLoading } = useAgentById(id);

    if (isLoading) {
        return (
            <div className="flex flex-col h-full items-center justify-center relative">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) return <div>Error: {error.message}</div>;

    const twitterUsername = agent?.twitter?.url?.split('/')[3] || '';
    const contractAddress = agent?.contractAddress || '';

    return (
        <div>
            {agent && agent?._id && (
                <>
                    <AgentProfileCard agent={agent} />

                    <div className="mt-12 mb-[19px]">
                        {contractAddress && <TokenPriceChart tokenAddress={contractAddress} />}
                        {twitterUsername && <TwitterTimeline username={twitterUsername} />}
                    </div>
                </>
            )}
        </div>
    );
};

export default AgentContentPageContainer;
