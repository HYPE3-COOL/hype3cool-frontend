import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import PlainIconLinkButton from '@/components/elements/buttons/PlainIconLinkButton';
import { PAGE_LINKS } from '@/constants/constants';

const menuItems = [
    {
        label: 'How It Works',
        link: PAGE_LINKS.HOW_ITS_WORK_URL,
        icon: 'icon-howtowork',
    },
    {
        label: 'Terms',
        link: PAGE_LINKS.TERMS_URL,
        icon: 'icon-terms',
    },
];

export default function SupportNavItem() {
    return (
        <Menu as="div" className="relative">
            {({ open }) => (
                <>
                    <MenuButton className={`hype3-dropdown-btn ${open ? ' text-blue-200' : 'text-white/70'}`}>Support</MenuButton>
                    <Transition
                        enter="duration-200 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="duration-300 ease-out"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        {/* <div className="w-[175px] h-[150px] bg-black rounded-[15px] shadow border border-white/20" /> */}
                        <MenuItems
                            anchor="bottom start"
                            className="relative navbar-dropmenu"
                        >
                            {menuItems.map((item, index) => (
                                <MenuItem key={index}>
                                    <Link href={item.link} target="_self">
                                        <h5 className="navbar-dropmenu-item py-3 flex items-center">
                                            <span className={`${item.icon} text-[22px] pr-2.5 `} />
                                            {item.label}
                                        </h5>
                                    </Link>
                                </MenuItem>
                            ))}

                            <MenuItem>
                                <div className="border-[0.5px] border-slate-400/20" />
                            </MenuItem>

                            <MenuItem>
                                <div className="-ml-2">
                                    <div className="flex flex-row space-x-2 items-center justify-start">
                                        <PlainIconLinkButton url={PAGE_LINKS.SITE_TWITTER_URL} icon="twitter" />
                                        <PlainIconLinkButton url={PAGE_LINKS.SITE_TELEGRAM_URL} icon="telegram" />
                                        {/* <PlainIconLinkButton url={PAGE_LINKS.SITE_DEXSCREENER_URL} icon="dexscreener" /> */}
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
