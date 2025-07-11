import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

interface ArrayInputTextFieldProps {
    name: string;
    label: string;
}

const ArrayInputTextField: React.FC<ArrayInputTextFieldProps> = ({ name, label }) => {
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
                    <div className="w-full h-10 bg-black rounded-[5px] border border-white/10 flex items-center justify-between px-4 py-3 mb-2">
                        <input
                            type="text"
                            className="border-none w-full !rounded-none outline-none !text-white text-sm font-semibold font-figtree placeholder:text-slate-400/40"
                            {...register(`${name}.${index}`)}
                        />
                        <span className="icon-circle-minus text-red-500 cursor-pointer ml-2" onClick={() => remove(index)} />
                    </div>
                    {errors[name] && (errors[name] as any)[index] && <p className="text-red-500">{(errors[name] as any)[index]?.message}</p>}
                </div>
            ))}
            <button type="button" className="text-blue-200 text-sm font-semibold font-figtree" onClick={() => append('')}>
                <span className="icon-circle-plus mr-2" />
                Add {label}
            </button>
        </div>
    );
};

export default ArrayInputTextField;
