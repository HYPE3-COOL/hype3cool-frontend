'use client';
import React from 'react';

import { User } from '@/types/types';
import WalletAddressChip from '@/components/common/ui/chips/WalletAddressChip';
import AvatarWithUploadButton from '@/components/profile/auth/AvatarWithUploadButton';
import { getUserActiveWalletFromLinkAccounts } from '@/utils/privy/privyUtil';

type UserProfileCardProps = {
    user: User;
};

const UserProfileCard = ({ user }: UserProfileCardProps) => {
    const getUserActiveWallet = () => {
        if (!user) return '';
        return getUserActiveWalletFromLinkAccounts(user.linkedAccounts);
    };

    return (
        <div className="flex items-center">
            <AvatarWithUploadButton imageUrl={user.image} isEditable={false} onClick={() => {}} />
            <div className="ml-6">
                <div className="flex items-end text-white text-xl sm:text-6xl font-normal font-neopixel tracking-tight mb-2">{user?.username}</div>
                {getUserActiveWallet() && <WalletAddressChip address={getUserActiveWallet()} prefix={''} />}
            </div>
        </div>
    );
};

export default UserProfileCard;
