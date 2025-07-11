import React from 'react';

import { useTokenPrices } from '@/components/providers/TokenMarketDataProvider';
import { formatMarketValue } from '@/utils/displayUtils';

type TokenMarketValueChipProps = {
    tokenAddress: string;
};

const TokenMarketValueChip = ({ tokenAddress }: TokenMarketValueChipProps) => {
    const { tokenPrices } = useTokenPrices();
    const token = tokenPrices[tokenAddress];

    let marketCap = 0;
    if (token && token?.tokenInfo?.price_info?.price_per_token && token?.tokenInfo?.supply && token?.tokenInfo?.decimals) {
        marketCap = (token?.tokenInfo?.price_info?.price_per_token * token?.tokenInfo?.supply) / 10 ** token?.tokenInfo?.decimals;
    }

    return <div>{marketCap > 0 ? formatMarketValue(marketCap) : '-'}</div>;
};

export default TokenMarketValueChip;
