'use client';
import React, { useEffect, useState } from 'react';

import { Agent, StatusType } from '@/types/types';
import BaseButton from './BaseButton';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

import styles from './EditAgentSection.module.css';
import EditAgentForm1 from '../form/EditAgentForm1';
import EditAgentForm2 from '../form/EditAgentForm2';

// redux
import { dispatch, IRootState, useSelector } from '@/store';
import { setActiveAgentId, setCreateAgentStep, setProfilePic } from '@/store/slices/agent';
import { removeHashtags } from '@/utils/displayUtils';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { AgentService } from '@/lib/api/agentService';

import { UploadService } from '@/lib/api/uploadService';

type EditAgentSectionProps = {
    agent?: Agent;
};

const EditAgentSection = ({ agent }: EditAgentSectionProps) => {
    const router = useRouter();

    const { suggestedTwitters, profilePic, sampleTweets, isBreedLoading, isGenerateCharacterAndTweetsStatus, activeAgentId, agentCharacter } = useSelector((state: IRootState) => state.agent);

    const [isCreateAgentLoading, setIsCreateAgentLoading] = useState<StatusType>('idle');
    // create new agent
    const createAgent = useMutation({
        mutationFn: (data: any) => new AgentService().create(data),
        onMutate: () => {
            setIsCreateAgentLoading('loading');
        },
        onSuccess: (data: any) => {
            setIsCreateAgentLoading('success');
            dispatch(setActiveAgentId(data._id));
        },
        onError: (error) => {
            console.error('Error in creating agent:', error);
        },
    });

    // update agent
    const editAgent = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => new AgentService().update(id as string, data),
        onMutate: () => {
            setIsCreateAgentLoading('loading');
        },
        onSuccess: (data: any) => {
            setIsCreateAgentLoading('success');
        },
        onError: (error) => {
            console.error('Error in creating agent:', error);
        },
    });

    const handleInitialize = async () => {
        // upload to s3 before creating agent
        let agentAvatar = profilePic;
        if (profilePic) {
            if (!profilePic.startsWith('https://cdn.hype3.cool')) {
                try {
                    const result = await new UploadService().uploadImageByUrl(profilePic);
                    if (result) {
                        agentAvatar = `https://cdn.hype3.cool/uploads/${result.filename}`;
                        dispatch(setProfilePic(agentAvatar));
                    }
                } catch (error) {
                    console.log('error', error);
                }
            }
        }

        // if agent exists, update agent
        if (agent) {
            editAgent.mutate({
                id: (agent?._id || activeAgentId) as string,
                data: {
                    name: agentCharacter.name,
                    avatar: agentAvatar,
                    character: agentCharacter,
                    suggestions: suggestedTwitters,
                },
            });
        } else {
            createAgent.mutate({
                name: agentCharacter.name,
                avatar: agentAvatar,
                character: agentCharacter,
                suggestions: suggestedTwitters,
            });
        }
    };

    useEffect(() => {
        if (isCreateAgentLoading == 'success' && activeAgentId) {
            dispatch(setCreateAgentStep(3));
            router.push(`/agent-create/${activeAgentId}?step=3`); // why the page is not redirecting?
        }
    }, [activeAgentId, isCreateAgentLoading]);

    const disableClick = suggestedTwitters.length == 0 || sampleTweets.length == 0 || isGenerateCharacterAndTweetsStatus == 'loading' || isCreateAgentLoading === 'loading';

    return (
        // step-wrapper
        <div className={`relative mt-9 w-full flex flex-col lg:flex-row gap-10 overflow-x-auto h-[calc(100vh-300px)] lg:min-h-[600px]`}>
            <div className="relative w-full h-full min-h-[600px] lg:w-[25%] lg:h-full bg-[#0c131b]/30 rounded-lg border-[0.5px] border-white/10 p-[30px]">
                <EditAgentForm1 agent={agent} />
            </div>
            <div className="relative w-full h-full min-h-[600px] lg:w-[35%] lg:h-full bg-[#0c131b]/30 rounded-lg border-[0.5px] border-white/10 p-[30px]">
                {isBreedLoading == 'loading' ? (
                    <div className="flex flex-col h-full items-center justify-center relative">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <EditAgentForm2 agent={agent} isEditMode={agent ? true : false} />
                )}
            </div>

            <div className="relative w-full h-full min-h-[600px] lg:w-[35%] lg:h-full bg-[#0c131b]/30 rounded-lg border-[0.5px] border-white/10 p-[30px]">
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="text-white text-2xl font-normal font-neopixel tracking-tight mb-[30px]">STEP 3</div>
                    <div className="flex-grow overflow-y-auto">
                        {isGenerateCharacterAndTweetsStatus === 'loading' ? (
                            <div className="flex flex-col h-full items-center justify-center relative">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div className="overflow-y-auto">
                                <div className="text-white text-xl font-normal font-neopixel tracking-tight">REVIEW SAMPLE TWEETS</div>
                                <div className="mt-9">
                                    {sampleTweets.map((sampleTweet, index) => (
                                        <div className="flex flex-row items-start gap-5 mb-2" key={index}>
                                            <div className="flex-shrink-0">
                                                <div className="flex flex-col items-center gap-y-2">
                                                    <img className="w-[60px] h-[60px] rounded-full" src={profilePic} />
                                                    {index < sampleTweets.length - 1 && <img className="min-h-[25px] h-full w-[1px]" src="/assets/images/vertical-line.svg" />}
                                                </div>
                                            </div>
                                            <div className="text-white/70 text-sm font-medium font-figtree leading-[18px]">{removeHashtags(sampleTweet)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <BaseButton type="button" label="INITIALIZE" onClick={handleInitialize} disabled={disableClick} />
                </div>
            </div>
        </div>
    );
};

export default EditAgentSection;
