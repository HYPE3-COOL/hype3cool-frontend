'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

// redux
import { dispatch, IRootState, useSelector } from '@/store';

// hooks
import { useGetUser } from '@/hooks/useUser';
import { useAgentByUsername } from '@/hooks/useAgent';

import { UserProfileCard, UserStatCard, UserAgentDataTable, AuthUserAgentDataTable, WithdrawHoldingsButton, AuthUserProfileCard } from './ui';
// import { BaseButton } from '../agent/ui';

import CreateAgentButton from '../agent/ui/CreateAgentButton';
import LoadingSpinner from '../elements/LoadingSpinner';
import useActiveWallet from '@/hooks/useActiveWallet';
import { ConnectXButton } from '../common/ui';
import { updateAgentReset } from '@/store/slices/user';
import { showMessage } from '@/utils/toast';

type UserProfileContentProps = {
    username: string;
};

const UserProfileContent = ({ username }: UserProfileContentProps) => {
    const { status } = useSession();
    const { authUser } = useSelector((state: IRootState) => state.auth);
    const { updateAgentStatus } = useSelector((state: IRootState) => state.user);
    const isAuthUserProfile = status === 'authenticated' && username === authUser?.username;

    const { data: user, error, isLoading } = useGetUser(username);
    const { data: agents, error: getAgentsError, isLoading: getAgentsIsLoading, refetch } = useAgentByUsername(username);

    const { activeWallet, isPrivyWallet } = useActiveWallet();

    // query params
    const router = useRouter();
    const searchParams = useSearchParams();
    const twitterOAuthError = searchParams.get('twitter-oauth') === 'false';
    const twitterOAuthSuccess = searchParams.get('twitter-oauth') === 'true';

    useEffect(() => {
        if (updateAgentStatus === 'success') {
            refetch();
            dispatch(updateAgentReset());
        }
    }, [updateAgentStatus]);

    useEffect(() => {
        if (twitterOAuthError) {
            showMessage('Failed to connect Twitter account', 'error');
            // Remove the query parameter after showing the error message
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('twitter-oauth');
            router.replace(newUrl.toString());
        }

        if (twitterOAuthSuccess) {
            showMessage('Twitter account connected successfully', 'success');
            // Remove the query parameter after showing the success message
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('twitter-oauth');
            router.replace(newUrl.toString());
        }
    }, [twitterOAuthError, twitterOAuthSuccess, router]);

    if (isLoading)
        return (
            <div className="flex items-center justify-center relative">
                <LoadingSpinner />
            </div>
        );
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {user && user?.username && (
                <>
                    {/* user profile */}
                    {isAuthUserProfile ? <AuthUserProfileCard user={user} /> : <UserProfileCard user={user} />}

                    {/* user statistics  */}
                    <div className="mt-12 mb-[19px]">
                        <UserStatCard user={user} />
                    </div>
                    {/* action buttons */}
                    {isAuthUserProfile && (
                        <>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-[14px]">
                                <ConnectXButton />
                                {/* TODO: check if having balance */}
                                {isPrivyWallet && <WithdrawHoldingsButton />}
                            </div>

                            {isPrivyWallet && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="flex items-center justify-end text-white/50 hover:text-blue-200 text-sm font-medium font-figtree leading-snug tracking-tight"
                                        onClick={() => {}}
                                    >
                                        <span className="icon-history mr-1.5" />
                                        Withdrawal history
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {agents && (
                        <div className="mt-10">{isAuthUserProfile ? <AuthUserAgentDataTable username={username} agents={agents} /> : <UserAgentDataTable username={username} agents={agents} />}</div>
                    )}
                    {isAuthUserProfile && (
                        <div className="mt-4">
                            <CreateAgentButton />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserProfileContent;
