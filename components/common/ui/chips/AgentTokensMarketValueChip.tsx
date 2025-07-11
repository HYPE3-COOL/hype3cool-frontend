import React from 'react';

import { useTokenPrices } from '@/components/providers/TokenMarketDataProvider';
import { formatMarketValue } from '@/utils/displayUtils';
import { Agent } from '@/types/types';

type AgentTokensMarketValueChipProps = {
    agents: Agent[];
};

const AgentTokensMarketValueChip = ({ agents }: AgentTokensMarketValueChipProps) => {
    
    const { tokenPrices } = useTokenPrices();

    // iterate through all agents and sum up the market value of all tokens
    let marketCap = 0;
    agents.forEach((agent) => {
        // q: get the agent.contractAddress

        if (agent?.contractAddress) {
            const token = tokenPrices[agent?.contractAddress];
            if (token && token?.tokenInfo?.price_info?.price_per_token && token?.tokenInfo?.supply && token?.tokenInfo?.decimals) {
                marketCap += (token?.tokenInfo?.price_info?.price_per_token * token?.tokenInfo?.supply) / 10 ** token?.tokenInfo?.decimals;
            }
        }



        // agent.forEach((holding) => {
        //     const token = tokenPrices[holding.tokenAddress];
        //     if (token && token?.tokenInfo?.price_info?.price_per_token && token?.tokenInfo?.supply && token?.tokenInfo?.decimals) {
        //         marketCap += (token?.tokenInfo?.price_info?.price_per_token * token?.tokenInfo?.supply) / 10 ** token?.tokenInfo?.decimals;
        //     }
        // });
    }
    );
    
    // const { tokenPrices } = useTokenPrices();
    // const token = tokenPrices[tokenAddress];

    // let marketCap = 0;
    // if (token && token?.tokenInfo?.price_info?.price_per_token && token?.tokenInfo?.supply && token?.tokenInfo?.decimals) {
    //     marketCap = (token?.tokenInfo?.price_info?.price_per_token * token?.tokenInfo?.supply) / 10 ** token?.tokenInfo?.decimals;
    // }

    return <div>{marketCap > 0 ? formatMarketValue(marketCap) : '-'}</div>;
};

export default AgentTokensMarketValueChip;
