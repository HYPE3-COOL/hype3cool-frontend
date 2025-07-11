'use client';
import React from 'react';

import { Creator } from '@/types/types';

type CreatorProfileCardProps = {
    creator: Creator;
};

const CreatorProfileCard = ({ creator }: CreatorProfileCardProps) => {
    const twitterUsername = creator?.twitter?.username || '';

    return (
        <div className="flex items-center">
            <div className="w-20 h-20 rounded-[3px] bg-cover bg-center" style={{ backgroundImage: `url(${creator.image})` }} />
            <div className="ml-2.5">
                <div className="flex items-center text-white text-xl sm:text-6xl font-normal font-neopixel tracking-tight mb-0.5">{creator?.username}</div>
                {twitterUsername && (
                    <div className="flex items-center">
                        <span
                            className="text-slate-400 text-base sm:text-lg font-medium font-figtree tracking-tight cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://x.com/${twitterUsername}`, '_blank');
                            }}
                        >
                            @{twitterUsername}
                        </span>
                        <div className="ml-1 w-4 h-4 icon-badge text-blue-200" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatorProfileCard;
