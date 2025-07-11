import React from 'react';
import Link from 'next/link';

import { Twitter } from '@/types/types';
import { PAGE_LINKS } from '@/constants/constants';

type BreedFromCellProps = {
    twitters?: Twitter[];
};

const BreedFromCell = ({ twitters }: BreedFromCellProps) => {
    if (!twitters || twitters.length === 0) {
        return <div className="whitespace-nowrap">-</div>;
    }

    return (
        <div className="flex flex-row items-center gap-x-2 overflow-x-auto">
            {twitters?.map((twitter, index) => (
                <Link key={index} href={`${PAGE_LINKS.CREATOR}/${twitter.username}`} passHref className="hover:cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <div className="w-6 h-6 rounded-[3px] bg-cover bg-center" style={{ backgroundImage: `url(${twitter.image})` }} />
                </Link>
            ))}
        </div>
    );
};

export default BreedFromCell;
