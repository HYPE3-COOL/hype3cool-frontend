import React from 'react';

const AgentNameCard = () => {
    return (
        <div className="flex flex-row items-center">
            <img className="w-[60px] h-[60px] rounded-[5px]" src="/assets/images/coolos-agent.png" />
            <div className="flex flex-col ml-5">
                <div className="text-slate-400/80 text-base font-semibold font-figtree">Your agent is using</div>
                <div className="text-white text-2xl font-normal font-neopixel tracking-tight">COOLOS</div>
            </div>
        </div>
    );
};

export default AgentNameCard;
