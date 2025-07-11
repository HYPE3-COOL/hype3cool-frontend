'use client';

import React, { useEffect } from 'react';

// redux
import { useSelector, IRootState } from '@/store';
import { setActiveAgentId } from '@/store/slices/agent';

import { AgentNameCard, PaymentSection, AgentPreviewProfile } from '../ui';
import { Agent } from '@/types/types';

type EditAgentPaymentContentProps = {
    agent?: Agent;
};

const EditAgentPaymentContent = ({ agent }: EditAgentPaymentContentProps) => {
    const { authUser } = useSelector((state: IRootState) => state.auth);
    const { suggestedTwitters, agentCharacter, profilePic } = useSelector((state: IRootState) => state.agent);

    useEffect(() => {
        if (agent?._id) {
            setActiveAgentId(agent?._id);
        }
    }, [agent]);

    return (
        <div>
            <div className="w-full bg-[#0c131b]/30 rounded-lg border-[0.5px] border-white/10 p-5 flex items-center justify-between">
                <AgentNameCard />
                <div>
                    <a href={`/user/${authUser.username}`} className="text-right text-blue-200 text-sm font-semibold font-figtree">
                        Go to Dashboard
                    </a>
                </div>
            </div>

            <div className="mt-9 bg-[#0c131b]/30 rounded-lg border-[0.5px] border-white/10 w-full">
                <div className="p-5 md:p8 lg:p-10">
                    <div className="flex flex-col lg:flex-row items-start">
                        <div className="w-full pb-10 lg:w-7/12 lg:pb-0 lg:pr-10">
                            {agent && agentCharacter && <AgentPreviewProfile
                                name={agent?.character?.name ?? agentCharacter?.name}
                                description={agentCharacter?.intro}
                                profilePic={profilePic}
                                twittersBreeded={suggestedTwitters}
                            />}
                        </div>

                        <div className="w-full pt-10 border-t-[0.5px] lg:w-5/12 lg:pt-0 lg:pl-10 lg:border-t-0 lg:border-l-[0.5px] border-dashed border-white/10 m-1">
                            {agent && <PaymentSection agent={agent} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAgentPaymentContent;
