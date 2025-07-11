'use client';

import React, { useState } from 'react';
import { AGENT_LIST_FILTERS, AgentListFilter } from '@/constants/constants';

type AgentListToggleSwitchProps = {
    activeButton: AgentListFilter;
    setActiveButton: (value: AgentListFilter) => void;
};

const AgentListToggleSwitch: React.FC<AgentListToggleSwitchProps> = ({ activeButton, setActiveButton }) => {
    const handleToggle = (value: AgentListFilter) => {
        setActiveButton(value);
    };

    return (
        <div className="flex items-center justify-center w-fit relative h-[30px] bg-slate-400/0 rounded-lg  border border-slate-400/20 overflow-hidden">
            <button
                type="button"
                className={`px-6 py-2.5 h-7 text-base font-semibold font-figtree flex-nowrap  ${activeButton === AGENT_LIST_FILTERS.ALL ? 'bg-blue-200 text-black rounded-lg' : 'bg-transparent text-white'}`}
                onClick={() => handleToggle(AGENT_LIST_FILTERS.ALL)}
            >
                All agents
            </button>
            <button
                type="button"
                className={`px-6 py-2.5 h-7 text-base font-semibold font-figtree flex-nowrap  ${activeButton === AGENT_LIST_FILTERS.TOKEN ? 'bg-blue-200 text-black rounded-lg' : 'bg-transparent text-white'}`}
                onClick={() => handleToggle(AGENT_LIST_FILTERS.TOKEN)}
            >
                Token only
            </button>
        </div>
    );
};

export default AgentListToggleSwitch;
