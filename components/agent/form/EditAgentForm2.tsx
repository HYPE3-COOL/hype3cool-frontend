import React, { useEffect, useState } from 'react';

import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useMutation } from '@tanstack/react-query';
import { Agent, GenerateCharacterAndTweetsRequest } from '@/types/types';

// ui
import LoadingSpinner from '@/components/elements/LoadingSpinner';
import BaseButton from '../ui/BaseButton';
import UploadAvatarDialog from '@/components/elements/dialogs/UploadAvatarDialog';
import { AgentService } from '@/lib/api/agentService';

import { dispatch, useSelector, IRootState } from '@/store';
import { setProfilePic, setSampleTweets, setIsGenerateCharacterAndTweetsStatus, setAgentCharacter } from '@/store/slices/agent';

import { useRouter } from 'next/navigation';

import { Select } from '@chakra-ui/react';

// Define the validation schema using yup
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    intro: yup.string().required('Description is required'),
    language: yup.string().required('Language is required'),
    withHashTags: yup.number(),
});

type EditAgentForm2Props = {
    isEditMode: boolean;
    agent?: Agent;
};

const EditAgentForm2 = ({ isEditMode, agent }: EditAgentForm2Props) => {
    const router = useRouter();

    const { suggestedTwitters, profilePic, agentCharacter, isBreedLoading, activeAgentId, isGenerateCharacterAndTweetsStatus } = useSelector(
        (state: IRootState) => state.agent,
    );

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: agentCharacter?.name ?? '',
            intro: agentCharacter?.intro ?? '',
            language: agentCharacter?.language ?? 'en',
            withHashTags: agentCharacter?.withHashTags ? 1 : 0,
        },
    });

    const { control, handleSubmit, watch, register, setValue, formState } = methods;
    const [isOpen, setIsOpen] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const [isChangePfp, setIsChangePfp] = useState(false);
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        if (agentCharacter) {
            methods.reset({
                name: agentCharacter.name,
                intro: agentCharacter.intro,
            });
        }
    }, [agentCharacter, methods]);

    // generate image and upload directly to s3
    const generateImage = useMutation({
        mutationFn: ({ prompt }: { prompt: string }) => new AgentService().generateImage(prompt),
        onMutate: () => {
            setIsChangePfp(true);
        },
        onSuccess: (data: any) => {
            dispatch(setProfilePic(data.filename));
            setIsChangePfp(false);
        },
        onError: (error) => {
            console.error('Error suggesting Twitter accounts:', error);
        },
    });

    const handleChangePfp = async () => {
        generateImage.mutate({ prompt });
    };    

    const name = methods.watch('name');
    const intro = methods.watch('intro');
    const language = methods.watch('language');
    const withHashTags = methods.watch('withHashTags');

    useEffect(() => {
        if (agentCharacter) {
            methods.setValue('name', agentCharacter.name);
        }
    }, [agentCharacter]);



    // generate character and sample tweets
    const generateCharacterAndTweets = useMutation({
        mutationFn: ({ name, intro, language, withHashTags }: GenerateCharacterAndTweetsRequest) => new AgentService().generateCharacterAndTweets({ name, intro, language, withHashTags }),
        onMutate: () => {
            dispatch(setIsGenerateCharacterAndTweetsStatus('loading'));
        },
        onSuccess: (data: any) => {
            dispatch(setIsGenerateCharacterAndTweetsStatus('success'));
            // dispatch(setActiveAgentId(data._id));
            dispatch(
                setAgentCharacter({
                    ...data.character,
                    intro: intro,
                    language: language,
                    withHashTags: withHashTags == 1 ? true : false,
                }),
            );
            dispatch(setSampleTweets(data.tweets));
        },
        onSettled: () => {
            setIsGenerateCharacterAndTweetsStatus('idle');
        },
        onError: (error) => {
            setIsGenerateCharacterAndTweetsStatus('failure');
            console.error('Error in generate character and sample tweets', error);
        },
    });

    // form submission
    const onSubmit = async (data: any) => {
        generateCharacterAndTweets.mutate({
            name: data.name,
            intro: data.intro,
            language: data.language,
            withHashTags: data.withHashTags == 1 ? true : false,
        });
    };

    const disableClick = isGenerateCharacterAndTweetsStatus == 'loading' || isBreedLoading == 'loading' || !formState.isValid || suggestedTwitters.length == 0;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col h-full overflow-hidden">
                <div className="text-white text-2xl font-normal font-neopixel tracking-tight mb-[30px]">STEP 2 {isEditMode ? '[EDIT]' : ''}</div>
                <div className="flex-grow overflow-y-auto">
                    <div className="flex flex-col gap-y-2 mb-4">
                        <div className="flex flex-row items-center justify-between">
                            <div className="sticky left-0 text-white text-xl font-normal font-neopixel tracking-tight">EDIT AGENT</div>
                        </div>
                    </div>

                    <div className="overflow-y-auto mb-4">
                        <div className="flex flex-row items-center gap-5">
                            {isChangePfp ? (
                                <div className="w-[100px] h-[100px] min-w-[100px] min-h-[100px] bg-black rounded-[5px] flex items-center justify-center">
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                <div>
                                    {profilePic ? (
                                        <div className="w-[100px] h-[100px] rounded-[5px] bg-black overflow-hidden">
                                            <img className=" overflow-hidden" src={profilePic} />
                                        </div>
                                    ) : (
                                        <div className="w-[100px] h-[100px] rounded-[5px] bg-black overflow-hidden" />
                                    )}
                                </div>
                            )}

                            <div className="w-full h-[100px] bg-black rounded-[5px] border border-white/10 relative px-[15px] py-[12px] flex flex-col justify-between">
                                <textarea
                                    className="border-none w-full flex-1 resize-none !rounded-none outline-none !text-white text-sm font-semibold font-figtree placeholder:text-slate-400/40 bg-transparent pb-[30px] overflow-y-auto"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Enter your prompt here to regenerate the profile picture"
                                />
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        className="text-blue-200 text-sm font-semibold font-figtree disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setIsOpen(true)}
                                        disabled={isRegenerating}
                                    >
                                        Upload
                                    </button>
                                    <UploadAvatarDialog message="Upload Image?" open={isOpen} setOpen={setIsOpen} confirmText="Upload" callback={async () => {}} />

                                    <button
                                        type="button"
                                        className="flex items-center text-blue-200 text-sm font-semibold font-figtree disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleChangePfp}
                                        disabled={isChangePfp || !prompt}
                                    >
                                        Regenerate
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 mb-10">
                            <div className="text-slate-400/80 text-base font-semibold font-figtree mb-4">Agent name</div>
                            <div className="w-full h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3">
                                <input
                                    type="text"
                                    className="border-none w-full !rounded-none outline-none !text-white text-sm font-semibold font-figtree placeholder:text-slate-400/40"
                                    {...methods.register('name')}
                                />
                            </div>
                            {methods.formState.errors.name && <p className="text-red-500">{methods.formState.errors.name.message}</p>}
                        </div>

                        <div className="mt-6 mb-10">
                            <div className="text-slate-400/80 text-base font-semibold font-figtree mb-4">Agent description</div>

                            <div>
                                <div className="w-full bg-black rounded-[5px] border border-white/10 flex flex-row justify-between px-4 py-3 mb-2 relative">
                                    <textarea
                                        className="bg-transparent border-none w-full pr-4 !rounded-none outline-none text-white text-sm font-semibold font-figtree placeholder:text-slate-400/40"
                                        rows={5}
                                        {...methods.register('intro')}
                                    />
                                </div>
                                {methods.formState.errors.intro && <p className="text-red-500">{methods.formState.errors.intro.message}</p>}
                            </div>
                        </div>

                        <div className="mt-6 mb-10">
                            <div className="text-slate-400/80 text-base font-semibold font-figtree mb-4">Language</div>
                            <div className="w-full h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3">
                                <Select
                                    {...methods.register('language')}
                                    className="border-none w-full !rounded-none outline-none !text-white text-sm font-semibold font-figtree placeholder:text-slate-400/40 bg-transparent"
                                    sx={{
                                        appearance: 'none',
                                        background: 'none',
                                        paddingRight: '2rem',
                                    }}
                                >
                                    <option value="en">English</option>
                                    <option value="cn">Chinese</option>
                                </Select>
                            </div>
                            {methods.formState.errors.language && <p className="text-red-500">{methods.formState.errors.language.message}</p>}
                        </div>

                        <div className="mt-6 mb-10">
                            <div className="text-slate-400/80 text-base font-semibold font-figtree mb-4">Hashtag & Emoji</div>
                            <div className="w-full h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3">
                                <Select
                                    {...methods.register('withHashTags')}
                                    className="border-none w-full !rounded-none outline-none !text-white text-sm font-semibold font-figtree placeholder:text-slate-400/40 bg-transparent"
                                    sx={{
                                        appearance: 'none',
                                        background: 'none',
                                        paddingRight: '2rem',
                                    }}
                                >
                                    <option value={0}>Without</option>
                                    <option value={1}>With</option>
                                </Select>
                            </div>
                            {methods.formState.errors.language && <p className="text-red-500">{methods.formState.errors.language.message}</p>}
                        </div>
                    </div>
                </div>
                <BaseButton type="submit" label="STIMULATE" disabled={disableClick} />
            </form>
        </FormProvider>
    );
};

export default EditAgentForm2;
