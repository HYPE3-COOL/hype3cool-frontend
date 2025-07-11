import React from 'react';
import Link from 'next/link';
import { Twitter } from '@/types/types';

type BreededTwittersProps = {
    twittersBreeded: Twitter[];
};

const BreededTwitters = ({ twittersBreeded }: BreededTwittersProps) => {
    return (
        <div className="flex flex-row items-center gap-x-20 overflow-x-auto">
            {twittersBreeded?.map((twitter, index) => (
                <Link href={`https://x.com/${twitter.username}`} passHref target="_blank" key={index}>
                    <div className="flex flex-row items-center gap-x-5">
                        <img className="w-[70px] h-[70px] rounded-[5px]" src={twitter?.image} />
                        {/* <img className="w-[70px] h-[70px] rounded-[5px]" src={twitter?.avatar} /> */}

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

export default BreededTwitters;
