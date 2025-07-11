import React from 'react';
import Link from 'next/link';
import { Twitter } from '@/types/types';
import { PAGE_LINKS } from '@/constants/constants';

type SmallBreededTwittersProps = {
    twittersBreeded: Twitter[];
};

const SmallBreededTwitters = ({ twittersBreeded }: SmallBreededTwittersProps) => {
    return (
        <div className="flex flex-row items-center gap-x-10 overflow-x-auto">
            {twittersBreeded?.map((twitter, index) => (
                <Link key={index} href={`${PAGE_LINKS.CREATOR}/${twitter.username}`}>
                    <div className="flex flex-row items-center gap-x-5">
                        <img className="w-10 h-10 rounded-[5px]" src={twitter?.image} />
                        <div>
                            <div className="text-white text-lg font-normal font-neopixel tracking-tight mb-0.5">{twitter?.name}</div>
                            <div className="text-slate-400 text-xs font-medium font-figtree tracking-tight">@{twitter.username}</div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default SmallBreededTwitters;
