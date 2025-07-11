'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { showMessage } from '@/utils/toast';

import { useAuth } from '@/components/auth/AuthProvider';
import { dispatch, IRootState, useSelector } from '@/store';
import { PAGE_LINKS } from '@/constants/constants';
import { toggleSidebar } from '@/store/slices/themeConfigSlice';


const PlaygroundButton = () => {
    const router = useRouter();
    const { login } = useAuth();
    const { data: session, status } = useSession();

    const { authUser } = useSelector((state: IRootState) => state.auth);
    const devTwitter = authUser?.twitter;

    const handleClick = () => {
        // check if user has verified twitter account by devTwitter
        if (status == 'unauthenticated') {
            login();
            return;
        } else {
            if (!devTwitter) {
                showMessage('Please connect your Twitter account to create an agent', 'error');
                return;
            }
        }

        dispatch(toggleSidebar());
        router.push(PAGE_LINKS['AGENT_CREATE']);
    };

    return (
        <button type="button" className="w-full h-[46px] bg-white rounded-lg" onClick={handleClick}>
            <div className="text-center text-black text-base font-normal font-neopixel leading-tight tracking-tight">PLAYGROUND</div>
        </button>
    );
};

export default PlaygroundButton;
