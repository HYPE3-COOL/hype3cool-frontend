import { TwitterSmallCard } from '@/components/common/ui';
import { PAGE_LINKS } from '@/constants/constants';
import { Creator } from '@/types/types';
import Link from 'next/link';
import React from 'react';

type CreatorStatCardProps = {
    creator: Creator;
};

const CreatorStatCard = ({ creator }: CreatorStatCardProps) => {
    return (
        <div className="h-[120px] flex items-center justify-between py-5 px-8 bg-slate-400/0 rounded-[5px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.50)] border-[0.5px] border-slate-400/20">
            {creator?.user && (
                <div>
                    <div className="text-white/50 text-xs font-medium font-figtree tracking-tight mb-3">DEV A/C</div>
                    <Link href={`${PAGE_LINKS.USER}/${creator.user?.username}`}>
                        <div className="flex items-center gap-x-3">
                            <img className="w-[45px] h-[45px] rounded-full" src={creator.user?.image} />
                            <div className="text-white text-base font-medium font-figtree leading-snug tracking-tight">{creator.user?.username}</div>
                        </div>
                    </Link>
                </div>
            )}
            <div>
                <div className="text-white text-[40px] font-normal font-neopixel tracking-tight mb-4">{creator.agents.length}</div>
                <div className="flex items-center text-white text-base font-medium font-figtree leading-snug tracking-tight">
                    <span className="icon-agents mr-1.5" />
                    <span className="hidden sm:block">IP agents</span>
                    <span className="block sm:hidden">Agents</span>
                </div>
            </div>
            <div>
                <div className="text-white text-[40px] font-normal font-neopixel tracking-tight mb-4">{0}</div>
                <div className="flex items-center text-white text-base font-medium font-figtree leading-snug tracking-tight">
                    <span className="icon-fee mr-1.5" />
                    <span className="hidden sm:block">IP fees earned</span>
                    <span className="block sm:hidden">Fees</span>
                </div>
            </div>
        </div>
    );
};

export default CreatorStatCard;
