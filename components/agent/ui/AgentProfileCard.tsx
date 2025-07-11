'use client';
import React from 'react';

import { Agent } from '@/types/types';
import AgentStatCard from './AgentStatCard';
import PlainIconLinkButton from '@/components/elements/buttons/PlainIconLinkButton';
import { showExplorer } from '@/utils/displayUtils';

type AgentProfileCardProps = {
    agent: Agent;
};

const AgentProfileCard = ({ agent }: AgentProfileCardProps) => {
    // const twitterUsername = agent?.twitter?.username || '';

    return (
        <div className="flex flex-col space-y-9">
            <div className="flex flex-row">
                <div className="w-20 h-20 min-w-20 min-h-20 rounded-[3px] bg-cover bg-center" style={{ backgroundImage: `url(${agent.avatar})` }} />
                <div className="ml-[25px] flex flex-col justify-between -mt-2.5">
                    <div className="text-white text-xl sm:text-6xl font-normal font-neopixel tracking-tight mb-1.5">{agent?.name}</div>
                    <div className="icon-groups items-center space-x-0.5 inline-flex">
                        {agent?.twitter?.url && <PlainIconLinkButton className="text-sm" icon="twitter" url={agent?.twitter?.url} />}
                        {agent?.telegram?.url && <PlainIconLinkButton className="text-sm" icon="telegram" url={agent?.telegram?.url} />}
                        {agent?.website?.url && <PlainIconLinkButton className="text-sm" icon="globe" url={agent?.website?.url} />}
                        {agent?.discord?.url && <PlainIconLinkButton className="text-sm" icon="discord" url={agent?.discord?.url} />}
                        {agent?.contractAddress && <PlainIconLinkButton className="text-sm" icon="expand" url={showExplorer(agent?.contractAddress)} />}
                    </div>
                </div>
            </div>
            <div className="text-white text-base font-medium font-figtree leading-snug">{agent.character.intro}</div>
            <AgentStatCard agent={agent} />
        </div>
    );
};

export default AgentProfileCard;
