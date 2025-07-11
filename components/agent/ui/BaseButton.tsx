import LoadingSpinner from '@/components/elements/LoadingSpinner';
import React from 'react';

type BaseButtonProps = {
    type: 'button' | 'submit';
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    icon?: string;
};

const BaseButton = ({ type = 'button', label, onClick, disabled = false, isLoading = false, icon }: BaseButtonProps) => {
    return (
        <button
            // type="submit"
            type={type}
            className="w-full min-h-[46px] h-[46px] bg-white/5 rounded-lg border-[0.5px] border-white/20 hover:bg-blue-200 hover:border hover:border-blue-200 text-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed outline-none"
            onClick={onClick ?? undefined}
            disabled={disabled}
        >
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="flex items-center gap-x-1 text-center text-base font-normal font-neopixel leading-tight tracking-tight">
                    {icon && <span className={icon} />}
                    {label}
                </div>
            )}
        </button>
    );
};

export default BaseButton;
