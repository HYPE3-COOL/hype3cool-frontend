'use client';
import React from 'react';

// form
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { dispatch } from '@/store';
import { showMessage } from '@/utils/toast';
import { closeMainDialog } from '@/store/slices/menu';
import { BaseButton } from '@/components/agent/ui';
import { useMutation } from '@tanstack/react-query';
import { AgentService } from '@/lib/api/agentService';
import { Agent } from '@/types/types';

import { updateAgentFailure, updateAgentStart, updateAgentSuccess } from '@/store/slices/user';

const schema = yup.object().shape({
    twitter: yup.string(),
    telegram: yup.string(),
    discord: yup.string(),
    website: yup.string(),
});

type AgentSocialsDialogProps = {
    data: Agent;
};

const AgentSocialsDialog = ({ data }: AgentSocialsDialogProps) => {
    const {
        control,
        handleSubmit,
        setError,
        register,
        formState: { errors, isValid, isDirty },
        setValue,
        watch,
        reset,
        setFocus,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            twitter: data?.twitter?.url || '',
            telegram: data?.telegram?.url || '',
            discord: data?.discord?.url || '',
            website: data?.website?.url || '',
        },
    });

    const [isUpdateAgentSocialLinksLoading, setIsUpdateAgentSocialLinksLoading] = React.useState(false);
    const updateAgentSocialLinks = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => new AgentService().updateSocialLinks(id as string, data),
        onMutate: () => {
            dispatch(updateAgentStart());
            setIsUpdateAgentSocialLinksLoading(true);
        },
        onSuccess: () => {
            setIsUpdateAgentSocialLinksLoading(false);
            dispatch(updateAgentSuccess());
            showMessage('Social links of the agent has been updated', 'success');
            dispatch(closeMainDialog());
        },
        onError: (error) => {
            dispatch(updateAgentFailure());
            console.error('Error in creating agent:', error);
        },
    });

    const onSubmit = async (formData: any) => {
        if (data && data._id) {
            updateAgentSocialLinks.mutate({ id: data._id, data: formData });
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>, name: 'twitter' | 'telegram' | 'discord' | 'website') => {
        const value = event.target.value;
        if (value && !value.startsWith('https://')) {
            setValue(name, `https://${value}`);
        }
    };

    return (
        <div className="w-full pl-7 pr-6 pt-9 pb-6 bg-[#0c131b] rounded-lg shadow border border-blue-200/10">
            <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="relative mb-6">
                    <div>
                        <div className="text-white text-base font-semibold font-figtree mb-10">Update social links for your agent:</div>
                        <div className="flex flex-col mb-6">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center">
                                <label className="text-slate-400/80 text-base font-semibold font-figtree whitespace-nowrap mb-2 lg:mb-0 lg:mr-2.5 flex items-center lg:w-1/4">Twitter</label>
                                <div className="w-full lg:w-3/4 h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3 hover:border-blue-200 hover:border">
                                    <input
                                        {...register('twitter')}
                                        className="w-full h-full bg-transparent text-white text-sm font-semibold font-figtree outline-none"
                                        placeholder=""
                                        autoComplete="off"
                                        onBlur={(e) => handleBlur(e, 'twitter')}
                                    />
                                </div>
                            </div>
                            {errors.twitter && typeof errors.twitter?.message === 'string' && <p className="text-red-500 text-sm mt-1">{errors.twitter.message}</p>}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center">
                                <label className="text-slate-400/80 text-base font-semibold font-figtree whitespace-nowrap mb-2 lg:mb-0 lg:mr-2.5 flex items-center lg:w-1/4">Telegram</label>
                                <div className="w-full lg:w-3/4 h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3 hover:border-blue-200 hover:border">
                                    <input
                                        {...register('telegram')}
                                        className="w-full h-full bg-transparent text-white text-sm font-semibold font-figtree outline-none"
                                        placeholder=""
                                        autoComplete="off"
                                        onBlur={(e) => handleBlur(e, 'telegram')}
                                    />
                                </div>
                            </div>
                            {errors.telegram && typeof errors.telegram?.message === 'string' && <p className="text-red-500 text-sm mt-1">{errors.telegram.message}</p>}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center">
                                <label className="text-slate-400/80 text-base font-semibold font-figtree whitespace-nowrap mb-2 lg:mb-0 lg:mr-2.5 flex items-center lg:w-1/4">Discord</label>
                                <div className="w-full lg:w-3/4 h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3 hover:border-blue-200 hover:border">
                                    <input
                                        {...register('discord')}
                                        className="w-full h-full bg-transparent text-white text-sm font-semibold font-figtree outline-none"
                                        placeholder=""
                                        autoComplete="off"
                                        onBlur={(e) => handleBlur(e, 'discord')}
                                    />
                                </div>
                            </div>
                            {errors.discord && typeof errors.discord?.message === 'string' && <p className="text-red-500 text-sm mt-1">{errors.discord.message}</p>}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center">
                                <label className="text-slate-400/80 text-base font-semibold font-figtree whitespace-nowrap mb-2 lg:mb-0 lg:mr-2.5 flex items-center lg:w-1/4">Website</label>
                                <div className="w-full lg:w-3/4 h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3 hover:border-blue-200 hover:border">
                                    <input
                                        {...register('website')}
                                        className="w-full h-full bg-transparent text-white text-sm font-semibold font-figtree outline-none"
                                        placeholder=""
                                        autoComplete="off"
                                        onBlur={(e) => handleBlur(e, 'website')}
                                    />
                                </div>
                            </div>
                            {errors.website && typeof errors.website?.message === 'string' && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-5 py-4">
                    <BaseButton type="submit" label="UPDATE" isLoading={isUpdateAgentSocialLinksLoading} disabled={!isDirty || !isValid || isUpdateAgentSocialLinksLoading} onClick={() => {}} />
                </div>
            </form>
        </div>
    );
};

export default AgentSocialsDialog;
