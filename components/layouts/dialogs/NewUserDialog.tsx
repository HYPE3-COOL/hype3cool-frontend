'use client';
import React, { useEffect } from 'react';

// form
import { skipTwitterNotification, skipTwitterNotificationReset } from '@/store/slices/auth';
import { dispatch, IRootState, useSelector } from '@/store';
import { showMessage } from '@/utils/toast';
import { closeMainDialog } from '@/store/slices/menu';

import FirstTwitterButton from '@/components/elements/buttons/FirstTwitterButton';
import { closeSidebar } from '@/store/slices/themeConfigSlice';

import { useLinkAccount, usePrivy } from '@privy-io/react-auth';

const NewUserDialog = () => {
    const { authUser, skipTwitterNotificationStatus } = useSelector((state: IRootState) => state.auth);

    const handleSkip = () => {
        if (authUser && authUser._id) {
            dispatch(skipTwitterNotification(authUser?._id));
        }
    };

    useEffect(() => {
        return () => {
            if (skipTwitterNotificationStatus === 'success') {
                dispatch(closeMainDialog());
                dispatch(closeSidebar());
                dispatch(skipTwitterNotificationReset());
            } else if (skipTwitterNotificationStatus === 'failure') {
                showMessage('Failed to skip Twitter notification', 'error');
            }
        };
    }, [skipTwitterNotificationStatus]);

    const { user: privyUser,  ready, authenticated } = usePrivy();

    const { linkTwitter } = useLinkAccount({
        onSuccess: () => {
            dispatch(closeMainDialog());
        },
        onError: (error) => {
            showMessage(error, 'error');
        },
    });

    return (
        <div className="w-full pl-7 pr-6 pt-9 pb-6 bg-black rounded-lg shadow border border-blue-200/10">
            <div className="flex flex-col items-center justify-between space-y-6">
                <div className="text-center text-blue-200 text-md md:text-xl font-semibold font-figtree leading-7 tracking-tight">🔗 Connect X account to claim and manage your creator profile</div>

                <FirstTwitterButton onClick={linkTwitter} disabled={!ready || !authenticated || !!privyUser?.twitter} />

                <button type="button" onClick={handleSkip} className="text-center text-white/70 text-sm font-semibold font-figtree leading-snug tracking-tight">
                    Skip for now 👉🏻
                </button>
            </div>
        </div>
    );
};

export default NewUserDialog;
