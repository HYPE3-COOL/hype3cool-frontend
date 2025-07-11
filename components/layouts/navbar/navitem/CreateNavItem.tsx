import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';

const menuItems = [
    {
        label: 'Agents',
        link: '/agent-create',
    },
    // {
    //     label: 'Creators',
    //     link: '#',
    // },
];

export default function ExploreNavItem() {
    return (
        <Menu as="div" className="relative">
            {({ open }) => (
                <>
                    <MenuButton className={`hype3-dropdown-btn ${open ? ' text-blue-200' : 'text-white/70'}`}>
                        Create
                    </MenuButton>
                    <Transition
                        enter="duration-200 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="duration-300 ease-out"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <MenuItems
                            anchor="bottom start"
                            className="relative navbar-dropmenu"
                        >
                            {menuItems.map((item, index) => (
                                <MenuItem key={index}>
                                    <Link href={item.link} target="_blank">
                                        <h5 className="navbar-dropmenu-item py-3">{item.label}</h5>
                                    </Link>
                                </MenuItem>
                            ))}
                        </MenuItems>
                    </Transition>
                </>
            )}
        </Menu>
    );
}
