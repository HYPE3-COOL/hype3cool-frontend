'use client';
import React from 'react';

import { useSession } from 'next-auth/react';
import { useSelector } from '@/store';
import { useAuth } from '../AuthProvider';
import AvatarNavItem from '@/components/layouts/navbar/navitem/AvatarNavItem';

const ConnectButton = () => {
    const { login } = useAuth();

    const { status } = useSession();
    const { authUser } = useSelector((state: any) => state.auth);

    return (
        <>
            {status === 'authenticated' && authUser ? (
                <AvatarNavItem user={authUser} />
            ) : (
                <div className="hidden sm:block">
                    <button type="button" className="w-[100px] h-[46px] bg-white rounded-lg" onClick={login}>
                        <div className="text-center text-black text-base font-normal font-neopixel leading-tight tracking-tight">SIGN IN</div>
                    </button>
                </div>
            )}
        </>
    );
};

export default ConnectButton;
