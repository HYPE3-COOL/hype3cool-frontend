import { TwitterSmallCard } from '@/components/common/ui';
import { User } from '@/types/types';
import React from 'react';

type UserStatCardProps = {
    user: User;
};

const UserStatCard = ({ user }: UserStatCardProps) => {
    // check if the user has linked twitter account
    const twitterAccount = user.linkedAccounts.find((account: any) => account.type === 'twitter_oauth');

    return (
        <div className="h-[120px] flex items-center justify-between py-5 px-8 bg-slate-400/0 rounded-[5px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.50)] border-[0.5px] border-slate-400/20">
            <div>
                <div className="text-white/50 text-xs font-medium font-figtree tracking-tight mb-3">CREATOR PROFILE</div>
                {twitterAccount && (
                    <TwitterSmallCard username={user.twitter?.username || ''} name={user.twitter?.name || ''} image={user.twitter?.image || ''} verified={user.twitter?.verified || false} />
                )}
            </div>

            <div>
                <div className="text-white text-[40px] font-normal font-neopixel tracking-tight mb-4">{0}</div>
                <div className="flex items-center text-white text-base font-medium font-figtree leading-snug tracking-tight">
                    <span className="icon-fee mr-1.5" />
                    <span className="hidden sm:block">IP fees earned</span>
                    <span className="block sm:hidden">Fees</span>
                </div>
            </div>
        </div>
    );
};

export default UserStatCard;
