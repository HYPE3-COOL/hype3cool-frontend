'use client';
import React from 'react';

type FirstTwitterButtonProps = {
    onClick: () => void;
    disabled: boolean;
};

const FirstTwitterButton = ({ onClick, disabled }: FirstTwitterButtonProps) => {
    return (
        <button onClick={onClick} type="button" className="h-button h-button-border h-10 px-5 py-2.5 bg-white/10 items-center" disabled={disabled}>
            <div className="text-blue-200 text-sm font-bold font-figtree leading-snug">
                <span className="mr-1 icon-x-twitter text-blue-200 text-sm" />
                CONNECT
            </div>
        </button>
    );
};

export default FirstTwitterButton;
