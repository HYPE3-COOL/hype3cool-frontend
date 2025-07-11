import React from 'react';
import Link from 'next/link';

type TwitterLinkButtonProps = {
    username: string;
    onClick?: (e: React.MouseEvent) => void;
};

const TwitterLinkButton = ({ username, onClick }: TwitterLinkButtonProps) => {
    return (
        <Link href={`https://x.com/${username}`} target="_blank" className="cursor-hand" onClick={onClick}>
            <div className="w-6 h-6 rounded-[5px] border border-white/25 flex items-center justify-center mb-2.5">
                <span className="icon-x-twitter text-white text-xs" />
            </div>
        </Link>
    );
};

export default TwitterLinkButton;
