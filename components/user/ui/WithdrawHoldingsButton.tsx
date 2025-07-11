import React from 'react';

import { BaseButton } from '@/components/agent/ui';
import { DIALOG_NAMES } from '@/constants/constants';

import { dispatch } from '@/store';
import { setMainDialog } from '@/store/slices/menu';

type WithdrawHoldingsButtonProps = {
    disabled?: boolean;
};

const WithdrawHoldingsButton = ({ disabled }: WithdrawHoldingsButtonProps) => {
    const onClick = () => {
        dispatch(setMainDialog({ type: DIALOG_NAMES.WITHDRAW, data: {} }));
    };

    return <BaseButton type="button" label="WITHDRAW" icon="icon-withdraw" disabled={disabled} onClick={onClick} />;
};

export default WithdrawHoldingsButton;
