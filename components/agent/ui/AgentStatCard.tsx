import { PAGE_LINKS } from '@/constants/constants';
import { Agent } from '@/types/types';
import Link from 'next/link';
import React from 'react';
import BreededTwitters from './BreededTwitters';
import SmallBreededTwitters from './SmallBreededTwitter';

type AgentStatCardProps = {
    agent: Agent;
};

const AgentStatCard = ({ agent }: AgentStatCardProps) => {
    return (
        <div className="h-[120px] flex items-center justify-between py-5 px-8 bg-slate-400/0 rounded-[5px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.50)] border-[0.5px] border-slate-400/20">
            {agent?.user && (
                <div>
                    <div className="text-white/50 text-xs font-medium font-figtree tracking-tight mb-3">DEV A/C</div>
                    <Link href={`${PAGE_LINKS.USER}/${agent?.user?.username}`}>
                        <div className="flex items-center gap-x-3">
                            <img className="w-[45px] h-[45px] rounded-full" src={agent.user?.image} />
                            <div className="text-white text-base font-medium font-figtree leading-snug tracking-tight">{agent.user?.username}</div>
                        </div>
                    </Link>
                </div>
            )}
            <div>
                <div className="text-white/50 text-xs font-medium font-figtree tracking-tight mb-3">BREED FROM</div>
                <SmallBreededTwitters twittersBreeded={agent?.suggestions ?? []} />
            </div>
        </div>
    );
};

export default AgentStatCard;
