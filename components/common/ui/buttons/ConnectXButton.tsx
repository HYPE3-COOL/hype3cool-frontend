'use client';
import React, { useState } from 'react';

import { usePrivy, useLinkAccount } from '@privy-io/react-auth';

import { dispatch, useSelector } from '@/store';
import { showMessage } from '@/utils/toast';
import confirmDialog from '@/components/elements/confirm-dialog';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/lib/api/authService';
import { AxiosError } from 'axios';
import { getMe } from '@/store/slices/auth';

const icon = 'icon-x-twitter';

const authService = new AuthService();

const ConnectXButton = () => {
    const { user: privyUser, unlinkTwitter, ready, authenticated } = usePrivy();
    const { authUser } = useSelector((state: any) => state.auth);
    const hasTwitter = authUser && privyUser?.twitter && privyUser?.twitter?.subject;

    const { linkTwitter } = useLinkAccount({
        onSuccess: () => {
            console.log('success');
        },
        onError: (error) => {
            showMessage(error, 'error');
            console.log({ error });
        },
    });

    const [confirmationModal, setConfirmationModal] = useState<any>(false);
    const handleOpenConfirmation = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setConfirmationModal(true);
    };


    const unlinkAsCreator = useMutation({
        mutationFn: () => authService.unlinkAsCreator(),
        onError: (error: any) => {
            if (error instanceof AxiosError) {
                showMessage(error?.response?.data?.message, 'error');
            } else {
                showMessage(error.message, 'error');
            }
        },
        onSuccess: () => {
            dispatch(getMe());
            setConfirmationModal(false);
            showMessage(`Successfully disconnected Twitter account`, 'success');
        },
    });

    const [isUnlinking, setIsUnlinking] = useState(false);
    const onDisconnectTwitter = async () => {
        try {
            if (privyUser?.twitter?.subject) {
                setIsUnlinking(true);
                const user = await unlinkTwitter(privyUser?.twitter?.subject);

                if (user) {
                    setIsUnlinking(false);

                    // check if the user has linked twitter account
                    const twitterAccount = user.linkedAccounts.find((account: any) => account.type === 'twitter_oauth');

                    // successfully unlinked twitter account
                    if (!twitterAccount) {
                        unlinkAsCreator.mutate();
                    }
                }
            }
        } catch (error: any) {
            showMessage(error?.data?.error, 'error');
        }
    };

    

    if (hasTwitter) {
        return (
            <>
                <button
                    type="button"
                    className="w-full h-[46px] bg-rose-400/10 rounded-lg border-[0.5px] border-rose-400/20 hover:bg-rose-400 hover:border hover:border-rose-400 text-rose-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed outline-none"
                    onClick={(e) => handleOpenConfirmation(e)}
                    disabled={!ready || !authenticated || !privyUser.twitter || !privyUser?.twitter?.subject}
                >
                    <div className="flex items-center gap-x-1 text-center text-base font-normal font-neopixel leading-tight tracking-tight">
                        {icon && <span className={icon} />}
                        DISCONNECT
                    </div>
                </button>
                {confirmDialog('Disconnect X account?', confirmationModal, setConfirmationModal, onDisconnectTwitter)}
            </>
        );
    }

    return (
        <button
            type="button"
            className="w-full h-[46px] bg-white rounded-lg border-[0.5px] border-white text-black disabled:opacity-50 disabled:cursor-not-allowed outline-none"
            onClick={linkTwitter}
            disabled={!ready || !authenticated || !!privyUser?.twitter}
        >
            <div className="flex items-center gap-x-1 text-center text-base font-normal font-neopixel leading-tight tracking-tight">
                {icon && <span className={icon} />}
                CONNECT X
            </div>
        </button>
    );
};

export default ConnectXButton;
