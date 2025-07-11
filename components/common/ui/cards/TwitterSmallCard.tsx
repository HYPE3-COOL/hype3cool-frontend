import { PAGE_LINKS } from '@/constants/constants';
import Link from 'next/link';
import React from 'react';

type TwitterSmallCardProps = {
    name: string;
    username: string;
    image: string;
    verified?: boolean;
};

const TwitterSmallCard = ({ name, username, image, verified }: TwitterSmallCardProps) => {
    return (
        <Link
            href={`${PAGE_LINKS.CREATOR}/${username}`}
            passHref
            target="_self"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <div className="flex items-center">
                <div className="w-10 h-10 min-w-10 min-h-10 rounded-[3px] bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
                <div className="ml-2.5">
                    <div className="flex items-center text-white text-sm sm:text-lg font-normal font-neopixel tracking-tight">
                        {name}
                        {verified && <span className="ml-1 text-sm icon-badge text-blue-200" />}
                    </div>
                    {username && (
                        <span
                            className="text-slate-400 text-xs font-medium font-figtree tracking-tight mt-0.5 cursor-pointer"
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     window.open(`https://x.com/${username}`, '_blank');
                            // }}
                        >
                            @{username}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default TwitterSmallCard;
