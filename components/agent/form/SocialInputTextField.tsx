import React from 'react';
// import { useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import { FormProvider, useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import styles from './SocialInputTextField.module.css'; 

export const iconMap = {
    website: 'icon-globe',
    twitter: 'icon-x-twitter',
    telegram: 'icon-telegram-no-bg',
    discord: 'icon-discord',
};

export const iconLabelMap = {
    website: 'Website',
    twitter: 'Twitter / X',
    telegram: 'Telegram',
    discord: 'Discord',
};

interface SocialInputTextFieldProps {
    name: 'website' | 'twitter' | 'telegram' | 'discord';
    initialValues?: string;
    onSubmit: (data: any) => void;
    disabled: boolean;
}

const SocialInputTextField: React.FC<SocialInputTextFieldProps> = ({ name, initialValues, onSubmit, disabled }) => {
    const schema = yup.object().shape({
        [name]: yup.string(),
    });

    const { register, handleSubmit, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            [name]: initialValues ?? '',
        },
    });

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value && !value.startsWith('https://')) {
            setValue(name, `https://${value}`);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-center">
                <div className="text-slate-400/80 text-base font-semibold font-figtree whitespace-nowrap mb-2 lg:mb-0 lg:mr-2.5 flex items-center lg:w-1/4">
                    <span className={`${iconMap[name]} text-base text-blue-200 mr-3`} />
                    {iconLabelMap[name]}
                </div>

                <div className="w-full lg:w-3/4 h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3 hover:border-blue-200 hover:border">
                    <input {...register(name)} className={`w-full h-full bg-transparent text-white text-sm font-semibold font-figtree outline-none ${styles['autofill-input']}`} placeholder="" onBlur={handleBlur} autoComplete="off" />

                    <button type="submit" className="ml-4 text-right text-blue-200 text-sm font-semibold font-figtree" disabled={disabled}>
                        Update
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SocialInputTextField;
