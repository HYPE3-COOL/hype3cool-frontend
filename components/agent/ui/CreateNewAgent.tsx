'use client';
import React from 'react';

import { dispatch, IRootState, useSelector } from '@/store';
import { showMessage } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { PAGE_LINKS } from '@/constants/constants';
import { setCreateAgentStep } from '@/store/slices/agent';

const CreateNewAgent = () => {
    const { authUser } = useSelector((state: IRootState) => state.auth);
    const devTwitter = authUser?.twitter;

    const router = useRouter();

    const handleClick = () => {
        // check if user has verified twitter account by devTwitter
        if (!devTwitter) {
            showMessage('Please connect your Twitter account to create an agent', 'error');
            return;
        }

        dispatch(setCreateAgentStep(1));
        router.push(PAGE_LINKS['AGENT_CREATE']);
    };

    return (
        <button onClick={handleClick} type="button" className="w-full">
            <div className="w-full h-[200px] relative bg-slate-400/5 rounded-lg shadow-inner border border-[#92f7cb]/5 p-2.5 hover:bg-slate-400/10 hover:border-[#92f7cb]/10 transition-all duration-300">
            <div className="h-full flex flex-col items-center justify-center bg-slate-400/5 rounded-lg border border-dashed border-white/30 hover:bg-slate-400/10 transition-all duration-300">
                <div className="w-[60px] h-[60px] rounded-[5px] border border-white/10 justify-center items-center flex flex-col hover:border-white/40 transition-all duration-300">
                    <div className="w-[30px] h-[30px] relative">
                        <div className="w-[30px] h-[1.80px] left-[14.10px] top-[30px] absolute origin-top-left -rotate-90 bg-white/20 hover:bg-white/40 transition-all duration-300" />
                        <div className="w-[30px] h-[1.80px] left-0 top-[14.10px] absolute bg-white/20 hover:bg-white/40 transition-all duration-300" />
                    </div>
                </div>
                <div className="text-white/50 text-lg font-semibold font-figtree mt-[22px] hover:text-white/70 transition-all duration-300">
                    Create New Agent
                </div>
            </div>
        </div>
        </button>
    );
};

export default CreateNewAgent;
