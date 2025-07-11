import React from 'react';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface ContractAddressInputTextFieldProps {
    initialValues?: string;
    onSubmit: (data: any) => void;
    disabled: boolean;
}

const ContractAddressInputTextField: React.FC<ContractAddressInputTextFieldProps> = ({ initialValues, onSubmit, disabled }) => {
    const schema = yup.object().shape({
        contractAddress: yup.string(),
    });

    const { register, handleSubmit, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            contractAddress: initialValues ?? '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full w-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-center">
                <div className="text-slate-400/80 text-base font-semibold font-figtree whitespace-nowrap mb-2 lg:mb-0 lg:mr-2.5 flex items-center lg:w-1/4">Agent CA:</div>

                <div className="w-full lg:w-3/4 h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3 hover:border-blue-200 hover:border">
                    <input
                        {...register('contractAddress')}
                        className="w-full h-full bg-transparent text-white text-sm font-semibold font-figtree outline-none"
                        placeholder="Enter your CA address"
                        disabled={disabled}
                        autoComplete="off"
                    />

                    <button type="submit" className="ml-4 text-right text-blue-200 text-sm font-semibold font-figtree disabled:opacity-50 disabled:pointer-events-none" disabled={disabled}>
                        Update
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ContractAddressInputTextField;
