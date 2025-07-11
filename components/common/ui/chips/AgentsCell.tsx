import React from 'react';
import Link from 'next/link';

import { Agent, Twitter } from '@/types/types';
import { PAGE_LINKS } from '@/constants/constants';

const MAX_AGENTS_SHOW = 5;

type AgentsCellProps = {
    agents?: Agent[];
};

const AgentsCell = ({ agents }: AgentsCellProps) => {
    if (!agents || agents.length === 0) {
        return <div className="whitespace-nowrap">-</div>;
    }

    return (
        <div className="flex flex-row items-center gap-x-2 overflow-x-auto">
            {agents.slice(0, MAX_AGENTS_SHOW)?.map((agent, index) => (
                <Link key={index} href={`${PAGE_LINKS.AGENT}/${agent._id}`} passHref className="hover:cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <div className="w-6 h-6 min-w-6 min-h-6 rounded-[3px] bg-cover bg-center" style={{ backgroundImage: `url(${agent.avatar})` }} />
                </Link>
            ))}
        </div>
    );
};

export default AgentsCell;
