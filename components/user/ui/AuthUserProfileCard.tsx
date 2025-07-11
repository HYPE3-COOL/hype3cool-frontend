'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { User } from '@/types/types';

import { setMainDialog } from '@/store/slices/menu';
import { dispatch, IRootState, useSelector } from '@/store';

import { DIALOG_NAMES } from '@/constants/constants';

import { usePrivy } from '@privy-io/react-auth';
import WalletAddressChip from '@/components/common/ui/chips/WalletAddressChip';
import AvatarWithUploadButton from '@/components/profile/auth/AvatarWithUploadButton';

type AuthUserProfileCardProps = {
    user: User;
};

const AuthUserProfileCard = ({ user }: AuthUserProfileCardProps) => {
    const { authUser } = useSelector((state: IRootState) => state.auth);
    const { user: userPrivy } = usePrivy();

    const handleUpdateUsername = () => {
        dispatch(setMainDialog({ type: DIALOG_NAMES.UPDATE_USERNAME, data: { username: authUser.username } }));
    };

    const handleUploadProfilePic = () => {
        dispatch(setMainDialog({ type: DIALOG_NAMES.UPLOAD_IMAGE, data: {} }));
    };

    return (
        <div className="flex items-center">
            <AvatarWithUploadButton imageUrl={authUser.image} isEditable={true} onClick={handleUploadProfilePic} />
            <div className="ml-6">
                <div className="flex items-end text-white text-xl sm:text-6xl font-normal font-neopixel tracking-tight mb-2">
                    {authUser?.username}
                    <button type="button" onClick={handleUpdateUsername}>
                        <span className="icon-pen text-white/70 text-xs pl-1.5" />
                    </button>
                </div>
                {userPrivy?.wallet?.address && <WalletAddressChip address={userPrivy?.wallet?.address} prefix={''} />}
            </div>
        </div>
    );
};

export default AuthUserProfileCard;
