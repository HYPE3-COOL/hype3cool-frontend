import React from 'react';

type EarningChipProps = {
    className?: string;
    amountInUSD: number;
    amountInSOL: number;
};

const EarningChip = ({ className = 'text-left', amountInUSD, amountInSOL }: EarningChipProps) => {
    const usd = amountInUSD > 0 ? amountInUSD.toFixed(2) : '-';
    const sol = amountInSOL > 0 ? amountInSOL.toFixed(2) : '-';

    return (
        <div className={className}>
            <span className="text-white text-base font-bold font-figtree">${usd} </span>
            <span className="text-slate-400/60 text-base font-bold font-figtree">({sol} SOL)</span>
        </div>
    );
};

export default EarningChip;
