'use client';
import React from 'react';

type TokenPriceChartProps = {
    tokenAddress: string;
};

const chartHost = 'https://www.gmgn.cc/kline'
const dexscreenHost = 'https://dexscreener.com/solana/${tokenAddress}?embed=1&theme=dark&trades=0&info=0&chart=1'

const TokenPriceChart = ({ tokenAddress }: TokenPriceChartProps) => {

    const url = `${chartHost}/sol/${tokenAddress}`

    return (
        <iframe
        className='iframe-disabled w-full !h-[450px]'
            src={url}
            style={{ width: '100%', height: '100%', border: 'none' }}
            // title={`${data.name} Chart`}
        />
    );
};

export default TokenPriceChart;
