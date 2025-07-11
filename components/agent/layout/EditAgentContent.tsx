'use client';
import React from 'react';

import { useSelector, IRootState } from '@/store';

import { AgentNameCard } from '../ui';
import EditAgentSection from '../ui/EditAgentSection';
import { Agent } from '@/types/types';
import EditAgentPaymentContent from './EditAgentPaymentContent';

type EditAgentContentProps = {
    agent: Agent;
};

const EditAgentContent = ({ agent }: EditAgentContentProps) => {
    const { authUser } = useSelector((state: IRootState) => state.auth);
    const { createAgentStep } = useSelector((state: IRootState) => state.agent);

    return (
        <div className="mt-16 text-white">
            {createAgentStep == 2 && (
                <div>
                    <div className="w-full bg-[#0c131b]/30 rounded-lg border-[0.5px] border-white/10 p-5 flex items-center justify-between">
                        <AgentNameCard />
                        <div>
                            <a href={`/user/${authUser.username}`} className="text-right text-blue-200 text-sm font-semibold font-figtree">
                                Go to Dashboard
                            </a>
                        </div>
                    </div>
                    <EditAgentSection agent={agent} />
                </div>
            )}
            {createAgentStep == 3 && <EditAgentPaymentContent agent={agent} />}
        </div>
    );
};

export default EditAgentContent;
