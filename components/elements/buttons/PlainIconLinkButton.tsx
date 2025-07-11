'use client';

import React from 'react';
import Link from 'next/link';
import { iconMap } from '@/constants/constants';

type IconLinkButtonProps = {
    icon: keyof typeof iconMap;
    url: string;
    className?: string;
};

const PlainIconLinkButton: React.FC<IconLinkButtonProps> = ({ icon, url, className }) => {
    className = className || 'text-sm';

    return (
        <Link href={url} passHref target="_blank" onClick={(e) => e.stopPropagation()}>
            <button type="button" className={`px-1.5 py-2 h-[30px] min-h-[30px] text-white hover:text-blue-200 ${className} font-bold font-figtree leading-tight tracking-tight whitespace-nowrap`}>
                <span className={iconMap[icon]} />
            </button>
        </Link>
    );
};
export default PlainIconLinkButton;
