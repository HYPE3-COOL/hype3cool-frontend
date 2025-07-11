import React from 'react';

type OutlinedButtonProps = {
    label?: string;
    onClick: () => void;
};

const OutlinedButton = ({ label = '', onClick }: OutlinedButtonProps) => {
    return (
        <button type="button" className="h-button h-button-border h-10 px-5 py-2.5 bg-white/10 text-white hover:text-blue-200 disabled:cursor-not-allowed" onClick={onClick}>
            <div className="text-xs xs:text-sm sm:text-base font-semibold font-figtree md:text-base">{label}</div>
        </button>
    );
};

export default OutlinedButton;
