'use client';

import React from 'react';
import { useStatistics } from '@/hooks/useAppConfig';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

const HomeStatCard = () => {
    const { data: statistics, error, isLoading } = useStatistics();

    if (isLoading) {
        return (
            <div className="flex flex-col h-full items-center justify-center relative">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="h-[120px] flex items-center justify-between py-5 px-8 bg-slate-400/0 rounded-[5px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.50)] border-[0.5px] border-slate-400/20">
            <div>
                <div className="text-white text-[40px] font-normal font-neopixel tracking-tight mb-4">{statistics?.creatorCount}</div>
                <div className="flex items-center text-white text-base font-medium font-figtree leading-snug tracking-tight">
                    <span className="icon-creators mr-1.5" />
                    <span className="hidden sm:block">Creators onboarded</span>
                    <span className="block sm:hidden">Creators</span>
                </div>
            </div>
            <div>
                <div className="text-white text-[40px] font-normal font-neopixel tracking-tight mb-4">{statistics?.agentCount}</div>
                <div className="flex items-center text-white text-base font-medium font-figtree leading-snug tracking-tight">
                    <span className="icon-agents mr-1.5" />
                    <span className="hidden sm:block">IP agents</span>
                    <span className="block sm:hidden">Agents</span>
                </div>
            </div>
            <div>
                <div className="text-white text-[40px] font-normal font-neopixel tracking-tight mb-4">{statistics?.totalAssignedFee ?? 0}</div>
                <div className="flex items-center text-white text-base font-medium font-figtree leading-snug tracking-tight">
                    <span className="icon-fee mr-1.5" />
                    <span className="hidden sm:block">IP fees assigned</span>
                    <span className="block sm:hidden">Fees</span>
                </div>
            </div>
        </div>
    );
};

export default HomeStatCard;
