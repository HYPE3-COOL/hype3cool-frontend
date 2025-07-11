'use client';
import React, { useEffect } from 'react';

import { usePrivy } from '@privy-io/react-auth';

import { useSelector, IRootState, dispatch } from '@/store';
import { setCreateAgentStep } from '@/store/slices/agent';

import { AgentNameCard, CreateAgentStep1, CreateAgentStep2, EditAgentSection } from '@/components/agent/ui';

const CreateAgentContent = () => {
    const { user: privyUser, unlinkTwitter, ready, authenticated } = usePrivy();
    const { authUser } = useSelector((state: IRootState) => state.auth);

    const { createAgentStep, isAnalyzeLoading } = useSelector((state: IRootState) => state.agent);

    const hasTwitter = authUser && privyUser?.twitter && privyUser?.twitter?.subject;

    useEffect(() => {
        if (hasTwitter) {
            dispatch(setCreateAgentStep(1));
        } else {
            dispatch(setCreateAgentStep(2));
        }
    }, [hasTwitter]);

    if (createAgentStep === 1) {
        return (
            <div className="container mx-auto !max-w-[900px]">
                <div className="text-center md:text-left text-white text-4xl lg:text-5xl font-normal font-neopixel tracking-wide">INITIALIZING AGENT...</div>
                <div className="mt-16">
                    <div className="grid grid-cols-3 gap-0">
                        <div className="col-span-3 md:col-span-1 flex justify-center md:justify-start">{hasTwitter && <CreateAgentStep1 twitter={authUser?.twitter} />}</div>
                        <div className="col-span-3 md:col-span-2 md:pl-[100px] flex flex-col justify-center md:justify-start md:border-l-[0.5px] md:border-white/10 md:border-dashed relative">
                            {isAnalyzeLoading == 'idle' && (
                                <div className="wrapper text-center text-white/30 text-xs xxs:text-sm xs:text-lg sm:text-xl md:text-2xl font-medium font-jetbrains leading-tight">
                                    <div className="analyze_to_start">Analyze to start...</div>
                                </div>
                            )}
                            {isAnalyzeLoading == 'loading' && (
                                <div className="w-full flex justify-center md:justify-start mb-10">
                                    <div className="wrapper text-center text-white/30 text-xs xxs:text-sm xs:text-lg sm:text-xl md:text-2xl font-medium font-jetbrains leading-tight">
                                        <div className="waiting-for-analysis">Waiting for analysis...</div>
                                    </div>
                                </div>
                            )}
                            {isAnalyzeLoading != 'idle' && <CreateAgentStep2 />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (createAgentStep === 2) {
        return (
            <div className="container mx-auto !max-w-[1440px]">
                <div className="w-full bg-[#0c131b]/30 rounded-lg border-[0.5px] border-white/10 p-5">
                    <AgentNameCard />
                </div>

                <EditAgentSection />
            </div>
        );
    }

    return null;
};

export default CreateAgentContent;
