'use client';
import React from 'react';

import { BaseButton } from '@/components/agent/ui';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useSelector, IRootState } from '@/store';

import { showMessage } from '@/utils/toast';
import { PAGE_LINKS } from '@/constants/constants';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLinkAccount, usePrivy } from '@privy-io/react-auth';

const CreateCreatorButton = () => {
    const router = useRouter();
    const { login } = useAuth();
    const { status } = useSession();
    const { authUser } = useSelector((state: IRootState) => state.auth);
    // const devTwitter = authUser?.twitter;

    const { user: privyUser, unlinkTwitter, ready, authenticated } = usePrivy();
    const hasTwitter = authUser && privyUser?.twitter && privyUser?.twitter?.subject;

    const label = status == 'authenticated' && hasTwitter ? 'VIEW CREATOR PROFILE' : 'BECOME CREATOR';
    const icon = 'icon-creators';

    const onClick = async () => {
        if (status === 'unauthenticated') {
            login();
        } else {
            // if (!hasTwitter) {
            //     showMessage('Please connect your Twitter account to create an agent', 'error');
            //     return;
            // } else {
                router.push(`${PAGE_LINKS.CREATOR}/${authUser?.twitter?.username}`);
            // }
        }
    };

    const { linkTwitter } = useLinkAccount({
        onSuccess: () => {
            console.log('success');
        },
        onError: (error) => {
            showMessage(error, 'error');
            console.log({ error });
        },
    });


    if (status == 'authenticated') {
        if (!hasTwitter) {
            return (
                <button
                    type="button"
                    className="w-full min-h-[46px] h-[46px] bg-white rounded-lg border-[0.5px] border-white text-black disabled:opacity-50 disabled:cursor-not-allowed outline-none"
                    onClick={linkTwitter}
                    disabled={!ready || !authenticated || !!privyUser?.twitter}
                    // disabled={disabled}
                >
                    <div className="flex items-center gap-x-1 text-center text-base font-normal font-neopixel leading-tight tracking-tight">
                        {icon && <span className={icon} />}
                        {label}
                    </div>
                </button>
            );
        }
    }

    return (
        <button
            type="button"
            className="w-full min-h-[46px] h-[46px] bg-white rounded-lg border-[0.5px] border-white text-black disabled:opacity-50 disabled:cursor-not-allowed outline-none"
            onClick={onClick}
            // disabled={disabled}
        >
            <div className="flex items-center gap-x-1 text-center text-base font-normal font-neopixel leading-tight tracking-tight">
                {icon && <span className={icon} />}
                {label}
            </div>
        </button>
    );
};

export default CreateCreatorButton;
