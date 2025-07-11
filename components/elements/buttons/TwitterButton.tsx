'use client';
import React from 'react';

import { useSelector } from '@/store';
import { showMessage } from '@/utils/toast';

import { usePrivy, useLinkAccount } from '@privy-io/react-auth';

const TwitterButton = () => {
    const { user: privyUser, unlinkTwitter, ready, authenticated } = usePrivy();

    const { linkTwitter } = useLinkAccount({
        onSuccess: () => {
            console.log('success');
        },
        onError: (error) => {
            showMessage(error, 'error');
            console.log({ error });
        },
    });

    const { authUser } = useSelector((state: any) => state.auth);

    const hasTwitter = authUser && privyUser?.twitter && privyUser?.twitter?.subject; 

    const onDisconnectTwitter = async (id: string) => {
        try {
            await unlinkTwitter(id);
        } catch (error: any) {
            // console.log({ error });
            showMessage(error?.data?.error, 'error');
        }
    };

    if (hasTwitter) {
        return (
            <button
                disabled={!ready || !authenticated || !privyUser.twitter}
                onClick={() => privyUser?.twitter?.subject && onDisconnectTwitter(privyUser.twitter.subject)}
                type="button"
                className="
                min-w-[195px] h-[38px] py-1.5 px-3 bg-rose-400/10 rounded-[100px] border border-rose-400/20 justify-center items-center gap-1.5 inline-fle
                inline-flex text-rose-400"
            >
                <span className="icon-x-twitter text-xs pl-1.5" />
                <div className="text-center text-xs xs:text-sm font-semibold font-figtree">Disconnect @${privyUser?.twitter?.username}</div>
            </button>
        );
    }

    return (
        <button
            disabled={!ready || !authenticated || !!privyUser?.twitter}
            onClick={linkTwitter}
            type="button"
            className="w-[130px] h-[38px] h-button h-button-border p-1.5 bg-slate-400/10 rounded-[100px] justify-center items-center gap-1.5 inline-flex"
        >
            <div className="text-center text-white text-xs xs:text-sm font-semibold font-figtree">🔗 Connect</div>
            <span className="icon-x-twitter text-white text-xs" />
        </button>
    );
};

export default TwitterButton;
