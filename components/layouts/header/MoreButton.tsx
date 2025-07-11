import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { PAGE_LINKS } from '@/constants/constants';

const menuItems = [
    {
        label: 'How It Works',
        link: 'https://hype3.gitbook.io/hype3/',
    },
    {
        label: 'Support',
        link: PAGE_LINKS.SITE_TELEGRAM_URL,
    },
];

export default function MoreButton() {
    return (
        <Menu as="div" className="relative">
            {({ open }) => (
                <>
                    <MenuButton className={`hype3-dropdown-btn ${open ? ' text-blue-200' : 'text-white/70'}`}>
                        <span className={`icon-arrow-down ${open && 'text-blue-200 rotate-180 transition-all'}`} />
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
                                        <h5 className="navbar-dropmenu-item px-7 py-2.5">{item.label}</h5>
                                    </Link>
                                </MenuItem>
                            ))}

                            <MenuItem>
                                <div className="text-white active:text-blue-200 font-semibold h5 px-4">
                                    <div className="flex flex-row space-x-2 items-center">
                                        <Link type="button" href={PAGE_LINKS.SITE_TWITTER_URL} target="_blank" className="hype3-btn-primary-ghost">
                                            <span className="icon-x-twitter"></span>
                                        </Link>

                                        <Link type="button" href={PAGE_LINKS.SITE_TELEGRAM_URL} target="_blank" className="hype3-btn-primary-ghost">
                                            <span className="icon-telegram-no-bg"></span>
                                        </Link>
                                    </div>
                                </div>
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </>
            )}
        </Menu>
    );
}
