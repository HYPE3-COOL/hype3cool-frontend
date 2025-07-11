'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

import TokenWideCard from '../token/TokenWideCard';
import TwitterButton from '../elements/buttons/TwitterButton';

import { dispatch, IRootState, useSelector } from '@/store';

import { showMessage } from '@/utils/toast';

import { AuthService } from '@/lib/api/authService';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getMe } from '@/store/slices/auth';
import CreateNewAgent from '../agent/ui/CreateNewAgent';
import { useAgentByUsername } from '@/hooks/useAgent';
import { useGetCreator } from '@/hooks/useGetCreator';
import { CreatorAgentEarningTable, EmptyCreatorAgentEarningTable } from '../creator/ui';

type UserProfileTabViewProps = {
    username: string;
};

const UserProfileTabView = ({ username }: UserProfileTabViewProps) => {
    const { data: agents, error, isLoading } = useAgentByUsername(username);
    
    const { data: session, status } = useSession();
    const { authUser } = useSelector((state: IRootState) => state.auth);

    const { data: creator, error: getCreatorError, isLoading: getCreatorIsLoading } = useGetCreator(authUser?.twitter?.username as string);     // TODO: later use twitter from privyUser

    const isAuthUserProfile = status === 'authenticated' && username === authUser?.username;

    const authService = new AuthService();
    const { mutate: linkAsCreator } = useMutation({
        mutationFn: () => authService.linkAsCreator(),
        onError: (error: any) => {
            if (error instanceof AxiosError) {
                showMessage(error?.response?.data?.message, 'error');
            } else {
                showMessage(error.message, 'error');
            }
        },
        onSuccess: () => {
            showMessage('Link as creator successfully', 'success');
            dispatch(getMe());
        },
    });

    const { mutate: unlinkAsCreator } = useMutation({
        mutationFn: () => authService.unlinkAsCreator(),
        onError: (error: any) => {
            if (error instanceof AxiosError) {
                showMessage(error?.response?.data?.message, 'error');
            } else {
                showMessage(error.message, 'error');
            }
        },
        onSuccess: () => {
            showMessage('Unlink creator successfully', 'success');
            dispatch(getMe());
            // methods.reset();
            // router.push('/agent-create');
        },
    });

    const handleToggleCreator = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (authUser?.isCreator) {
            unlinkAsCreator();
        } else {
            if (authUser?.twitter?.id) {
                linkAsCreator();

                // setIsCreator(e.target.checked);
            } else {
                showMessage('You must link your Twitter account to become a creator.', 'warning');
            }
        }
    };

    return (
        <TabGroup defaultIndex={0}>
            <div className="flex items-center justify-between w-full h-[45px] relative">
                <TabList className="flex items-center justify-center w-fit h-[32px] xs:h-[45px] relative bg-slate-400/10 rounded-[5px] p-1">
                    <Tab
                        type="button"
                        className={`px-2.5 xs:px-6 py-2.5 h-[26px] xs:h-[38px] text-xs xs:text-base font-semibold font-figtree flex-nowrap transition-colors duration-300 bg-transparent text-slate-400 data-[selected]:bg-white data-[selected]:text-black rounded-[5px] outline-0`}
                    >
                        🎨 Creator
                    </Tab>
                    <Tab
                        type="button"
                        className={`px-2.5 xs:px-6 py-2.5 h-[26px] xs:h-[38px] text-xs xs:text-base font-semibold font-figtree flex-nowrap transition-colors duration-300 bg-transparent text-slate-400 data-[selected]:bg-white data-[selected]:text-black rounded-[5px] outline-0`}
                    >
                        🤖 Dev
                    </Tab>
                </TabList>
                {isAuthUserProfile && <TwitterButton />}
            </div>
            <TabPanels className="mt-[43px]">
                <TabPanel>
                    {isAuthUserProfile && (
                        <div className="flex flex-row items-center justify-start gap-x-1.5 mb-[48px]">
                            <div className="flex flex-row items-center justify-start gap-x-1.5">
                                <div className="text-blue-200 text-base font-semibold font-figtree leading-snug tracking-tight">Do you want to be listed as a creator?</div>
                                <input
                                    id="isCreator"
                                    type="checkbox"
                                    checked={authUser?.isCreator || false}
                                    onChange={(e) => handleToggleCreator(e)}
                                    className="appearance-none peer relative w-[3.25rem] h-7 p-px bg-gray-100 border border-gray-200 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none  checked:border-blue-200 focus:checked:border-blue-200 dark:bg-dark dark:border-neutral-700 dark:checked:bg-blue-200/5 dark:checked:border-blue-200 dark:focus:ring-offset-gray-600 before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-blue-600 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-blue-200/5 dark:checked:before:bg-blue-200"
                                />
                            </div>
                        </div>
                    )}
                    {creator && creator?.agents && creator?.agents.length > 0 ? (
                        <CreatorAgentEarningTable agents={creator.agents} />
                    ) : (
                        <EmptyCreatorAgentEarningTable />
                    )}
                    
                </TabPanel>
                <TabPanel>
                    {isAuthUserProfile ? (
                        <div className="flex flex-col gap-y-8">
                            <CreateNewAgent />
                            {agents ? agents.map((agent, index) => <TokenWideCard key={index} agent={agent} />) : null}
                        </div>
                    ) : null}
                </TabPanel>
            </TabPanels>
        </TabGroup>
    );
};

export default UserProfileTabView;
