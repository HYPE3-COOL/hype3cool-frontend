'use client';
import React from 'react';
import { useAuth } from '../AuthProvider';

const MobileSignInButton = () => {
    const { login } = useAuth();
    return (
        <button type="button" className="w-full h-[46px] bg-white rounded-lg" onClick={login}>
            <div className="text-center text-black text-base font-normal font-neopixel leading-tight tracking-tight">SIGN IN</div>
        </button>
    );
};

export default MobileSignInButton;