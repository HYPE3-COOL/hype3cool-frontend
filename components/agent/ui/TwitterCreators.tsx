import React from 'react';
import Link from 'next/link';
import { Twitter } from '@/types/types';
import { PAGE_LINKS } from '@/constants/constants';

type TwitterCreatorsProps = {
    twittersBreeded: Twitter[];
};

const TwitterCreators = ({ twittersBreeded }: TwitterCreatorsProps) => {
    return (
        <div className="flex flex-row items-center gap-x-20 overflow-x-auto">
            {twittersBreeded?.map((twitter, index) => (
                <Link href={`${PAGE_LINKS.CREATOR}/${twitter.username}`} passHref target="_self" key={index}>
                    <div className="flex flex-row items-center gap-x-5">
                        <img className="w-[70px] h-[70px] rounded-[5px]" src={twitter?.image} />

                        <div>
                            <span className="text-white text-lg font-normal font-neopixel uppercase leading-[18px] tracking-tight">
                                {twitter?.name}
                                <br />
                            </span>
                            <span className="text-slate-400 text-xs font-semibold font-figtree leading-[18px] tracking-tight">{twitter.username}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default TwitterCreators;
