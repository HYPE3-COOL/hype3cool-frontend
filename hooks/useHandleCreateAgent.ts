import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { dispatch } from '@/store';

import { PAGE_LINKS } from '@/constants/constants';
import { useAuth } from '@/components/auth/AuthProvider';

import { resetCreateAgent, setCreateAgentStep } from '@/store/slices/agent';
import { usePrivy } from '@privy-io/react-auth';

const useHandleCreateAgent = () => {
    const router = useRouter();
    const { login } = useAuth();
    const { status } = useSession();

    const { user: privyUser } = usePrivy();

    const hasTwitter = privyUser?.twitter && privyUser?.twitter?.subject;

    const createAgent = () => {
        if (status === 'unauthenticated') {
            login();
        } else {
            // if hasTwitter, set createAgentStep to 1, else set to 2
            // reset all agent data, and redirect to create agent page
            dispatch(resetCreateAgent());
            // dispatch(setCreateAgentStep(hasTwitter ? 1 : 2));
            // router.push(PAGE_LINKS.AGENT_CREATE);
            window.location.href = PAGE_LINKS.AGENT_CREATE;
        }
    };

    return createAgent;
};

export default useHandleCreateAgent;
