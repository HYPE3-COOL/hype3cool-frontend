'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

type TwitterSignUpProps = {
    agentId: string;
};

const TwitterSignUp = ({ agentId }: TwitterSignUpProps) => {
    const router = useRouter();

    const handleConnectTwitter = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        router.push(`/api/twitter?agentId=${agentId}`);
    };

    return (
        <button
            type="button"
            className="xs:w-[130px] h-[38px] h-button h-button-border py-1.5 px-3 bg-slate-400/10 rounded-[100px] justify-center items-center gap-1.5 inline-flex disabled:cursor-not-allowed disabled:ocacity-50"
            onClick={(e) => handleConnectTwitter(e)}
        >
            <div className="text-center text-white text-sm font-semibold font-figtree">
                ⚙️️ <span className="hidden xs:inline-block text-xs sm:text-sm">Manage agent</span>
            </div>
        </button>
    );
};

export default TwitterSignUp;
