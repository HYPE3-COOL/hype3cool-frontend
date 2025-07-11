'use client';
import React from 'react';

import useHandleCreateAgent from '@/hooks/useHandleCreateAgent';

const CreateAgentButton = () => {
    const label = 'CREATE IP AGENT';
    const icon = 'icon-agents';

    const handleCreateAgentClick = useHandleCreateAgent();

    return (
        <button
            type="button"
            className="w-full min-h-[46px] h-[46px] bg-blue-200 rounded-lg border-[0.5px] border-white/20 text-black disabled:opacity-50 disabled:cursor-not-allowed outline-none"
            onClick={handleCreateAgentClick}
            // disabled={disabled}
        >
            <div className="flex items-center gap-x-1 text-center text-base font-normal font-neopixel leading-tight tracking-tight">
                {icon && <span className={icon} />}
                {label}
            </div>
        </button>
    );
};

export default CreateAgentButton;
