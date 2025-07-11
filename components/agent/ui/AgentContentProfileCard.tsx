import React from 'react';

import { Agent } from '@/types/types';

import { showExplorer } from '@/utils/displayUtils';
import IconLinkButton from '@/components/elements/buttons/IconLinkButton';
import BreededTwitters from './BreededTwitters';

type AgentContentProfileCardProps = {
    agent: Agent;
};

const AgentContentProfileCard = ({ agent }: AgentContentProfileCardProps) => {
    return (
        <div className="agent_content__profile_card relative bg-transparent rounded-lg shadow-inner border border-slate-400/20">
            <div className="flex flex-col px-[38px] py-[30px] space-y-5">
                <div className="agent_content__profile_card__header flex flex-row items-center justify-between">
                    <div className="text-white h-subheading-neo">
                        <span className="text-blue-200">{agent.name}</span>
                    </div>
                    <div className="icon-groups items-center space-x-2 inline-flex">
                        {agent?.twitter?.url && <IconLinkButton icon="twitter" url={agent?.twitter?.url} />}
                        {agent?.telegram?.url && <IconLinkButton icon="telegram" url={agent?.telegram?.url} />}
                        {agent?.website?.url && <IconLinkButton icon="globe" url={agent?.website?.url} />}
                        {agent?.discord?.url && <IconLinkButton icon="discord" url={agent?.discord?.url} />}
                        {agent?.contractAddress && <IconLinkButton icon="expand" url={showExplorer(agent?.contractAddress)} />}
                    </div>
                </div>

                <div className="flex flex-item space-x-[30px] justify-between">
                    <div className="thumbnail-wrapper w-[180px] h-[180px] min-w-[180px] min-h-[180px] relative">
                        <div className="thumbnail-content">
                            <img className="w-full h-full overflow-hidden" src={agent?.avatar} />
                        </div>
                    </div>
                    <div className="flex flex-col justify-start">
                        <div className=" text-white/70 text-sm font-medium font-figtree leading-tight">{agent.character.bio?.[0]}</div>
                    </div>
                </div>
                <div>
                    <div className="mt-[52px] text-white text-xl font-normal font-neopixel tracking-tight">BREEDED FROM 🐣</div>
                    <div className="my-7">
                        <BreededTwitters twittersBreeded={agent?.suggestions ?? []} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentContentProfileCard;
