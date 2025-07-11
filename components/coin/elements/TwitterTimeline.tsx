'use client';

import React from 'react';
import LoadingSpinner from '@/components/elements/LoadingSpinner';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import IconLinkButton from '@/components/elements/buttons/IconLinkButton';

interface TwitterTimelineProps {
    username: string;
    height?: number;
}

const TwitterTimeline: React.FC<TwitterTimelineProps> = ({ username }) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-x-[14px]">
                    <div className="w-4 h-4 bg-blue-200 rounded-full border-2 border-blue-200/30" />
                    <div className="text-white text-lg font-medium font-figtree tracking-tight">Live Sentient Tweets</div>
                </div>
                <div>
                    <IconLinkButton icon="twitter" url={`https://x.com/${username}`} />
                </div>
            </div>

            <TwitterTimelineEmbed
                sourceType="profile"
                screenName={username}
                options={{}}
                theme="dark"
                noHeader
                noFooter
                noBorders
                transparent
                placeholder={<LoadingSpinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
            />
        </div>
    );
};

export default TwitterTimeline;
