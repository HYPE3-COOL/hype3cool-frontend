import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

interface ArrayTextAreaTextFieldProps {
    name: string;
    label: string;
    isAllowMore?: boolean;
}

const ArrayTextAreaTextField: React.FC<ArrayTextAreaTextFieldProps> = ({ name, label, isAllowMore = true }) => {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <div className="mt-6 mb-10">
            <div className="text-slate-400/80 text-base font-semibold font-figtree mb-4">{label}</div>
            {fields.map((field, index) => (
                <div key={field.id}>
                    <div className="w-full bg-black rounded-[5px] border border-white/10 flex flex-row justify-between px-4 py-3 mb-2 relative">
                        <textarea
                            className="bg-transparent border-none w-full pr-4 !rounded-none outline-none text-white text-sm font-semibold font-figtree placeholder:text-slate-400/40"
                            rows={5}
                            {...register(`${name}.${index}`)}
                        />
                        <div className="absolute right-4">
                            <span className="icon-circle-minus text-red-500 cursor-pointer" onClick={() => remove(index)} />
                        </div>
                    </div>
                    {errors[name] && (errors[name] as any)[index] && <p className="text-red-500">{(errors[name] as any)[index]?.message}</p>}
                </div>
            ))}
            {isAllowMore && (
                <button type="button" className="text-blue-200 text-sm font-semibold font-figtree" onClick={() => append('')}>
                    <span className="icon-circle-plus mr-2" />
                    Add {label}
                </button>
            )}
        </div>
    );
};

export default ArrayTextAreaTextField;
