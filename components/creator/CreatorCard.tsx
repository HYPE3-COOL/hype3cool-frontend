'use client';
import React from 'react';

import { Creator } from '@/types/types';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TwitterLinkButton } from '../elements/buttons';

type CreatorCardProps = {
    creator: Creator;
};

const CreatorCard = ({ creator }: CreatorCardProps) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/creator/${creator.twitter?.username}`);
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="creator-card min-h-[180px] md:min-h-[240px] cursor-pointer" onClick={handleCardClick}>
            <div className="flex">
                <div className="shrink-0 relative w-[100px] md:w-40 rounded-tl-lg rounded-bl-lg overflow-hidden pt-[40%] h-full">
                    <img className="size-full absolute top-0 start-0 object-cover" src={creator.image} alt="Card Image" />
                </div>
                <div className="flex flex-wrap">
                    <div className="p-4 flex flex-col h-full sm:p-7">
                        {creator?.user && (
                            <Link href={`/user/${creator?.user?.username}`} onClick={handleLinkClick}>
                                <div className="absolute top-4 right-4 flex items-center space-x-1.5">
                                    <img loading="lazy" className="w-[18px] h-[18px] rounded-full" src={creator?.user?.image} />
                                    <div className="text-white text-sm font-semibold font-figtree tracking-tight">{creator?.user?.username}</div>
                                </div>
                            </Link>
                        )}

                        <div className="absolute bottom-4">
                            {creator?.twitter?.username && <TwitterLinkButton username={creator?.twitter?.username} onClick={handleLinkClick} />}
                            <span className="mt-2.5 text-white text-xl md:text-2xl font-normal font-neopixel uppercase leading-tight tracking-wide">
                                {creator?.twitter?.name}
                                <br />
                            </span>
                            <span className="text-slate-400 text-[10px] md:text-xs font-semibold font-figtree leading-tight tracking-tight">@{creator.username}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorCard;
