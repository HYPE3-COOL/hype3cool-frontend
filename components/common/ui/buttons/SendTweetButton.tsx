'use client';
import React from 'react';


import { useMutation } from '@tanstack/react-query';
import { AgentService } from '@/lib/api/agentService';
import { showMessage } from '@/utils/toast';

type SendTweetButtonProps = {
    agentId: string;
};

const SendTweetButton = ({ agentId }: SendTweetButtonProps) => {
    // const router = useRouter();

    const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (agentId)
            sendTweet.mutate(agentId);
    };

    const [isLoading, setIsLoading] = React.useState(false);
    const sendTweet = useMutation({
        mutationFn: async (id: string) => await new AgentService().sendTweet(id),
        onMutate: () => {
            setIsLoading(true);
        },
        onSuccess: () => {
            setIsLoading(false);
            showMessage('The agent receive your request to send tweet!', 'success');
        },
        onError: (error) => {
            console.error('Error in receiving your request to send tweet', error);
        },
    });

    return (
        <button
            type="button"
            className="xs:w-[130px] h-[38px] h-button h-button-border py-1.5 px-3 bg-slate-400/10 rounded-[100px] justify-center items-center gap-1.5 inline-flex disabled:cursor-not-allowed disabled:ocacity-50"
            disabled={isLoading}
            onClick={(e) => onClick(e)}
        >
            <div className="text-center text-white text-sm font-semibold font-figtree">
            ✉️ <span className="hidden xs:inline-block text-xs sm:text-sm">Send Tweet</span>
            </div>
        </button>
    );
};

export default SendTweetButton;
