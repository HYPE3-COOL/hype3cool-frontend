import React from 'react';

import { DIALOG_NAMES } from '@/constants/constants';
import { Agent } from '@/types/types';

import { dispatch } from '@/store';
import { setMainDialog } from '@/store/slices/menu';

type ManageElizaButtonProps = {
    agent: Agent;
};

const ManageElizaButton = ({ agent }: ManageElizaButtonProps) => {
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {

        console.log({agent})
        event.stopPropagation();
        dispatch(
            setMainDialog({
                type: DIALOG_NAMES.AGENT_X_CREDENTIALS,
                data: agent,
            }),
        );
    };

    return (
        <button
            // disabled={true}
            onClick={(e) => onClick(e)}
            type="button"
            className="xs:w-[130px] h-[38px] h-button h-button-border py-1.5 px-3 bg-slate-400/10 rounded-[100px] justify-center items-center gap-1.5 inline-flex disabled:cursor-not-allowed disabled:ocacity-50"
        >
            <div className="text-center text-white text-sm font-semibold font-figtree">
                ⚙️️ <span className="hidden xs:inline-block text-xs sm:text-sm">Manage agent</span>
            </div>
        </button>
    );
};

export default ManageElizaButton;
