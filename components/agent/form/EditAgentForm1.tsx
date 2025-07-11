import React, { useEffect, useState } from 'react';

import * as yup from 'yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { fetchProfile } from '@/hooks/useGetTwitterProfile';

import { useMutation } from '@tanstack/react-query';
import { Agent, Character, Twitter } from '@/types/types';
import { showMessage } from '@/utils/toast';

// ui
import LoadingSpinner from '@/components/elements/LoadingSpinner';
import BaseButton from '../ui/BaseButton';
import { transformToTwitter } from '@/utils/transform';

import { dispatch, IRootState, useSelector } from '@/store';
import { setSuggestedTwitters, setProfilePic,  setIsBreedLoading, setAgentCharacter, setSampleTweets } from '@/store/slices/agent';
import { AgentService } from '@/lib/api/agentService';

// Define the validation schema using yup
const schema = yup.object().shape({
    personalities: yup
        .array()
        .of(
            yup.object().shape({
                username: yup.string().required('Username is required'),
                avatar: yup.string().nullable(),
                name: yup.string().nullable(),
                id: yup.string().nullable(),
                image: yup.string().nullable(),
                description: yup.string().nullable(),
                biography: yup.string().nullable(),
                banner: yup.string().nullable(),
                verified: yup.boolean().nullable(),
                followersCount: yup.number().nullable(),
                followingCount: yup.number().nullable(),
                friendsCount: yup.number().nullable(),
                mediaCount: yup.number().nullable(),
                likesCount: yup.number().nullable(),
                listedCount: yup.number().nullable(),
                location: yup.string().nullable(),
                tweetsCount: yup.number().nullable(),
                url: yup.string().nullable(),
                joined: yup.date().nullable(),
            }),
        )
        .max(2, 'You can only add up to 2 personalities'),
});

type EditAgentForm1Props = {
    agent?: Agent;
};

const EditAgentForm1 = ({ agent }: EditAgentForm1Props) => {
    const { suggestedTwitters, isBreedLoading, isGenerateCharacterAndTweetsStatus } = useSelector((state: IRootState) => state.agent);

    const { control, handleSubmit, watch, register, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            personalities: suggestedTwitters?.length > 0 ? suggestedTwitters : [],
        },
    });

    const [loadingStates, setLoadingStates] = useState<boolean[]>([]);
    const [isFetchingTwitterProfile, setIsFetchingTwitterProfile] = useState(false);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'personalities',
    });

    const watchPersonalities = watch('personalities');

    useEffect(() => {
        setValue('personalities', suggestedTwitters);
    }, [suggestedTwitters]);

    // 1. Generate character
    const generateBasicCharacter = useMutation({
        mutationFn: (usernames: string[]) => new AgentService().generateBasicCharacter(usernames),
        onMutate: () => {
            dispatch(setIsBreedLoading('loading'));
        },
        onSuccess: async (data: Character) => {
            dispatch(
                setAgentCharacter({
                    name: data?.name ?? '',
                    intro: data?.description ?? '',
                    bio: '',
                    lore: '',
                    knowledge: '',
                    topics: '',
                    style: '',
                    chat: '',
                    posts: '',
                    adjectives: '',
                    language: 'en',
                    withHashTags: false,
                }),
            );

            dispatch(setProfilePic(data?.avatar ?? ''));
            dispatch(setIsBreedLoading('success'));
            dispatch(setSampleTweets([]));
            dispatch(setSuggestedTwitters(watchPersonalities));
        },
        onError: (error) => {
            // Handle error
            console.error('Error suggesting Twitter accounts:', error);
        },
    });

    // Handle form submission
    const onSubmit = async (data: any) => {
        const hasValidPersonality = data.personalities.length >= 1 && data.personalities[0].username && data.personalities[0].id;

        if (!hasValidPersonality) {
            showMessage('Please add at least 1 personality', 'error');
            return; // Early return is okay here
        }
        
        const usernames = data.personalities.map((personality: Twitter) => personality.username);
        generateBasicCharacter.mutate(usernames);
    };

    const getTwitterProfile = async (index: number) => {
        const username = watchPersonalities?.[index]?.username;

        if (!username) return;

        if (username) {
            try {
                setLoadingStates((prev) => {
                    const newLoadingStates = [...prev];
                    newLoadingStates[index] = true;
                    return newLoadingStates;
                });

                setIsFetchingTwitterProfile(true);

                const profile = await fetchProfile(username);
                if (profile) {
                    setValue(`personalities.${index}`, {
                        ...transformToTwitter(profile),
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setIsFetchingTwitterProfile(false);
                setLoadingStates((prev) => {
                    const newLoadingStates = [...prev];
                    newLoadingStates[index] = false;
                    return newLoadingStates;
                });
            }
        }
    };

    const handleAddPersonality = () => {
        append({ username: '', avatar: '', id: '', name: '' });
        setLoadingStates((prev) => [...prev, false]);
    };

    const handleRemovePersonality = (index: number) => {
        remove(index);
        setLoadingStates((prev) => prev.filter((_, i) => i !== index));
    };

    const disableClick =
        generateBasicCharacter.isPending ||
        isBreedLoading === 'loading' ||
        !watchPersonalities?.[0]?.username ||
        !watchPersonalities[0]?.id ||
        isFetchingTwitterProfile ||
        isGenerateCharacterAndTweetsStatus === 'loading' ||
        agent?.isActive;

    const isDisabled = () => {
        return isBreedLoading === 'loading' || isFetchingTwitterProfile || isGenerateCharacterAndTweetsStatus === 'loading' || agent?.isActive;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="text-white text-2xl font-normal font-neopixel tracking-tight mb-[30px]">STEP 1</div>
            <div className="flex-grow">
                <div className="flex-grow overflow-x-auto overflow-y-auto mb-4">
                    <div className="whitespace-nowrap">
                        {fields?.map((field, index) => (
                            <div key={index} className="personality-card flex flex-row items-center gap-x-5 mb-5">
                                <Controller
                                    name={`personalities.${index}.avatar`}
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            {loadingStates[index] ? (
                                                <div className="w-[70px] h-[70px] min-w-[70px] min-h-[70px] bg-black rounded-[5px] flex items-center justify-center">
                                                    <LoadingSpinner />
                                                </div>
                                            ) : field?.value ? (
                                                <img className="w-[70px] h-[70px] rounded-[5px]" src={field?.value} alt="Personality" />
                                            ) : (
                                                <div className="w-[70px] h-[70px] min-w-[70px] min-h-[70px] bg-black rounded-[5px]" />
                                            )}
                                        </>
                                    )}
                                />

                                <div className="w-full flex flex-col justify-between h-[70px]">
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="text-slate-400/80 text-base font-semibold font-figtree">Personality {index + 1}</div>
                                        <button
                                            type="button"
                                            className="text-[#ff6389] text-base font-semibold font-figtree disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleRemovePersonality(index)}
                                            disabled={isDisabled()}
                                        >
                                            <span className="icon-circle-minus" />
                                        </button>
                                    </div>

                                    <div className="w-full h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3 hover:border-blue-200 hover:border focus:border-blue-200 focus:border">
                                        <input
                                            {...register(`personalities.${index}.username`)}
                                            className="w-full bg-transparent outline-none  text-white text-sm font-semibold font-figtree"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            disabled={isDisabled()}
                                        />

                                        <button
                                            type="button"
                                            className="ml-4 text-right text-blue-200 text-sm font-semibold font-figtree disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => getTwitterProfile(index)}
                                            disabled={isDisabled()}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-[30px] mb-[20px]">
                    <button
                        type="button"
                        className="text-blue-200 text-sm font-semibold font-figtree disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleAddPersonality}
                        disabled={fields.length >= 2 || isDisabled()}
                    >
                        <span className="icon-circle-plus mr-2" />
                        Add personality
                    </button>
                </div>
            </div>
            <BaseButton type="submit" label="BREED" disabled={disableClick} />
        </form>
    );
};

export default EditAgentForm1;
