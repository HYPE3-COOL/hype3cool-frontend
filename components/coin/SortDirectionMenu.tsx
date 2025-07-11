import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

const options = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
];

const SortDirectionMenu = () => {
    const router = useRouter();
    const field = 'orderBy';
    const label = 'Order';

    const [selectedOption, setSelectedOption] = useState<string>(options[0].value);
    // Effect to sync initial state with query parameter
    useEffect(() => {
        const queryOption = new URLSearchParams(window.location.search).get(field);
        if (queryOption) {
            setSelectedOption(queryOption);
        }
    }, []);

    const handleSelect = (value: string) => {
        setSelectedOption(value);
        const params = new URLSearchParams(window.location.search);
        params.set(field, value);
        router.push(`?${params.toString()}`);
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            {({ open }) => (
                <>
                    <div>
                        <MenuButton className={`h-[45px] px-[15px] py-3 bg-black-200 justify-start items-center gap-3 inline-flex ${open ? 'rounded-tl-[5px] rounded-tr-[5px]' : 'rounded-[5px]'}`}>
                            <span className="text-slate-400/70 text-xs xs:text-sm sm:text-base font-semibold font-figtree">{label}: </span>
                            <span className="text-white text-xs xs:text-sm sm:text-base font-semibold font-figtree">{options.find((option) => option.value === selectedOption)?.label}</span>
                            <span className="ml-2 icon-arrow-down text-white" />
                        </MenuButton>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <MenuItems className="absolute w-full right-0 z-10 shadow-lg ring-1 ring-black ring-opacity-5 rounded-bl-[5px] rounded-br-[5px]">
                            {options.map((option) => (
                                <MenuItem key={option.value}>
                                    {() => (
                                        <button
                                            className={`h-[45px] block text-left w-full px-4 py-2 text-xs xs:text-sm sm:text-base font-semibold font-figtree ${option.value == selectedOption ? 'bg-black-200 text-white' : 'bg-black text-slate-400/60 '}`}
                                            onClick={() => handleSelect(option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    )}
                                </MenuItem>
                            ))}
                        </MenuItems>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default SortDirectionMenu;
