'use client';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { dispatch } from '@/store';
import { useAgentById } from '@/hooks/useAgent';
import { EditAgentContent } from '@/components/agent/layout';

import LoadingSpinner from '@/components/elements/LoadingSpinner';
import { EmptyCharacter } from '@/constants/constants';
import { initialEditAgent } from '@/store/slices/agent';

type CreateAgentWrapperProps = {
    id?: string;
};

const CreateAgentWrapper = ({ id }: CreateAgentWrapperProps) => {
    const searchParams = useSearchParams(); // Access the search params
    const { data: agent, error, isLoading } = useAgentById(id ?? '');

    useEffect(() => {
        const queryStep = searchParams.get('step'); // Retrieve the 'step' query parameter
        if (agent?._id) {
            dispatch(
                initialEditAgent({
                    createAgentStep: Number(queryStep) || 2,
                    suggestedTwitters: agent?.suggestions,
                    profilePic: agent?.avatar || '',
                    agentCharacter: agent?.character || EmptyCharacter,
                    activeAgentId: agent?._id,
                }),
            );
        }
    }, [agent]);

    if (isLoading)
        return (
            <div className="flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );

    if (error) return <div>Error: {error.message}</div>;

    return agent && agent._id && <EditAgentContent agent={agent} />;
};

export default CreateAgentWrapper;
