'use client';
import React from 'react';
import { useTokenDex } from '@/hooks/useTokenDex';
import Loading from '@/app/loading';

type AgentTokenMarketInfoProps = {
    tokenAddress: string;
};

const AgentTokenMarketInfo = ({ tokenAddress }: AgentTokenMarketInfoProps) => {
    const { volumn, marketCap, isLoading } = useTokenDex(tokenAddress);

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between lg:space-x-10 space-y-5 lg:space-y-0">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-10 justify-start flex-grow lg:flex-grow-0">
                    <div className="flex-grow lg:flex-grow-0">
                        <div className="text-blue-200 text-[10px] font-bold uppercase font-figtree leading-snug tracking-tight">Market CAP</div>
                        <div className="text-white text-base font-bold font-figtree leading-snug">{formatMarketValue(marketCap)}</div>
                    </div>
                    <div className="flex-grow lg:flex-grow-0">
                        <div className="text-blue-200 text-[10px] font-bold uppercase font-figtree leading-snug tracking-tight">VOL (24H)</div>
                        <div className="text-white text-base font-bold font-figtree leading-snug">{formatMarketValue(volumn)}</div>
                    </div>
                </div>
                <div className="flex flex-row gap-x-2 justify-end lg:justify-start flex-grow lg:flex-grow-0">
                    <div>
                        <div className="text-blue-200 text-[10px] font-bold uppercase font-figtree leading-snug tracking-tight">CA</div>
                        <div className="text-white text-base font-bold font-figtree leading-snug">{tokenAddress}</div>
                    </div>
                    {tokenAddress && <IconLinkButton icon="expand" url={showExplorer(tokenAddress)} />}
                </div>
            </div>
        </div>
    );
};

export default AgentTokenMarketInfo;

import { formatMarketValue, showExplorer } from '@/utils/displayUtils';
import IconLinkButton from '@/components/elements/buttons/IconLinkButton';

type TokenMarketVolumeProps = {
    marketCap: number;
    volumn: number;
    className?: string;
};

const TokenMarketVolume = ({ marketCap, volumn, className = 'px-2 py-0.5' }: TokenMarketVolumeProps) => {
    return (
        <>
            <div className={`${className} rounded-[5px] flex flex-row items-center border-[0.5px] border-white/20 bg-black h-[25px]`}>
                <h6 className="text-white/70 font-semibold">Market Cap:</h6>&nbsp;
                <h6 className="text-blue-200 font-bold">{formatMarketValue(marketCap)}</h6>
            </div>

            <div className={`${className} rounded-[5px] flex flex-row items-center border-[0.5px] border-white/20 bg-black h-[25px]`}>
                <h6 className="text-white/70 font-semibold">Volume:</h6>&nbsp;
                <h6 className="text-white font-bold">{formatMarketValue(volumn)}</h6>
            </div>
        </>
    );
};
