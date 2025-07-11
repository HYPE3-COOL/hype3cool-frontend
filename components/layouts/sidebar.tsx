'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import { toggleSidebar } from '@/store/slices/themeConfigSlice';

import { IRootState } from '@/store';
import { useState, useEffect, useCallback } from 'react';

import { SolanaCurrentPriceBadge, SolanaCurrentTpsBadge } from '@/components/elements/solana';
import MobileConnectButton from './header/MobileConnectButton';
import DisconnectButton from '../elements/buttons/DisconnectButton';

import { usePathname, useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { Z_INDEX } from '@/theme/zIndex';
// import confirmDialog from '../v1/elements/confirm-dialog';
import { useSession } from 'next-auth/react';

import { useAuth } from '../auth/AuthProvider';
import confirmDialog from '../elements/confirm-dialog';
import { HealthService } from '@/services/health.service';
import { Version } from '@/types/types';
import useSolana from '@/hooks/useSolana';
import MobileSignInButton from '../auth/elements/MobileSignInButton';
import BaseAvatar from '../user/BaseAvatar';
import { PAGE_LINKS } from '@/constants/constants';
import PlaygroundButton from '../auth/elements/PlaygroundButton';
import { showMessage } from '@/utils/toast';
import useHandleCreateAgent from '@/hooks/useHandleCreateAgent';

const menuItems = [
    {
        label: 'Agents',
        link: PAGE_LINKS.AGENT,
        icon: 'icon-agents',
    },
    {
        label: 'Creators',
        link: PAGE_LINKS.CREATOR,
        icon: 'icon-creators',
    },
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

const Sidebar = () => {
    const { logout, login } = useAuth();
    const router = useRouter();
    const { data: session, status } = useSession();
    const { authUser } = useSelector((state: any) => state.auth);

    const dispatch = useDispatch();
    // const { t } = getTranslation();
    // const pathname = usePathname();
    // const [currentMenu, setCurrentMenu] = useState<string>('');
    // const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    // const toggleMenu = (value: string) => {
    //     setCurrentMenu((oldValue) => {
    //         return oldValue === value ? '' : value;
    //     });
    // };

    // useEffect(() => {
    //     const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    //     if (selector) {
    //         selector.classList.add('active');
    //         const ul: any = selector.closest('ul.sub-menu');
    //         if (ul) {
    //             let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
    //             if (ele.length) {
    //                 ele = ele[0];
    //                 setTimeout(() => {
    //                     ele.click();
    //                 });
    //             }
    //         }
    //     }
    // }, []);

    // useEffect(() => {
    //     setActiveRoute();
    //     if (window.innerWidth < 1024 && themeConfig.sidebar) {
    //         dispatch(toggleSidebar());
    //     }
    // }, [pathname]);

    // const setActiveRoute = () => {
    //     let allLinks = document.querySelectorAll('.sidebar ul a.active');
    //     for (let i = 0; i < allLinks.length; i++) {
    //         const element = allLinks[i];
    //         element?.classList.remove('active');
    //     }
    //     const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    //     selector?.classList.add('active');
    // };

    const handleViewProfileClick = () => {
        router.push(`/user/${authUser?.username}`);
        dispatch(toggleSidebar());
    };

    const [confirmationModal, setConfirmationModal] = useState<any>(false);

    const handleDisconnect = async () => {
        logout();
        setConfirmationModal(false);
        dispatch(toggleSidebar());
    };

    const handleOpenConfirmation = (e: any) => {
        e.preventDefault();
        setConfirmationModal(true);
    };

    const isTest = process.env.NEXT_PUBLIC_ENV === 'prod' ? false : true;

    // confirmation before disconnecting wallet
    // const handleOpenConfirmation = () => {
    //     // dispatch(toggleSidebar());
    //     setConfirmationModal(true);
    // };

    // const handleDisconnect = useCallback(async () => {
    //     logout();
    //     // signOut();
    //     // await wallet.disconnect();
    //     // dispatch(toggleSidebar());
    //     setConfirmationModal(false);
    // }, []);

    // useEffect(() => {
    //     if (status === 'authenticated' && themeConfig.sidebar) {
    //         dispatch(toggleSidebar());
    //     }
    // }, [status]);

    // const handleLinkClick = (href: string) => {
    //     router.push(href);
    //     // dispatch(toggleSidebar());
    // };

    // // get version
    // const [version, setVersion] = useState<Version>();
    // useEffect(() => {
    //     const getVersion = async () => {
    //         try {
    //             const response = await new HealthService().getVersion();
    //             setVersion(response.data);
    //         } catch (error) {
    //             setVersion({ api: { version: 'N/A' }, frontend: { version: 'N/A' } });
    //         }
    //     };
    //     getVersion();
    // }, []);

    // const { priceInUsd, tps } = useSolana();

    const devTwitter = authUser?.twitter;

    // const handlePlaygroundClick = (e: any) => {
    //     e.preventDefault();
    //     dispatch(toggleSidebar());
    //     // check if user has verified twitter account by devTwitter
    //     if (status == 'unauthenticated') {
    //         login();
    //     } else {
    //         if (!devTwitter) {
    //             showMessage('Please connect your Twitter account to create an agent', 'error');
    //             return;
    //         }
    //     }

    //     router.push(PAGE_LINKS['AGENT_CREATE']);
    // };

    const handleCreateAgentClick = useHandleCreateAgent();

    return (
        <div style={{ zIndex: Z_INDEX.sidebar }}>
            <nav className={`sidebar fixed bottom-0 top-0 z-50 h-full w-full shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
                <div className="h-full bg-white dark:bg-green-950">
                    <div className="bg-black h-full relative flex flex-col">
                        <div className="sidebar-header">
                            <div className="flex items-center justify-end px-4 py-3">
                                <button type="button" className="text-blue-200" onClick={() => dispatch(toggleSidebar())}>
                                    <span className="icon-close text-xl" />
                                </button>
                            </div>
                        </div>
                        <div className="sidebar-body flex-grow flex flex-col">
                            {status === 'authenticated' && authUser && (
                                <div>
                                    <div className="flex flex-row items-center justify-center">
                                        <BaseAvatar image={authUser?.image} />
                                        <div className="ml-2 text-white text-base font-semibold font-figtree leading-snug tracking-tight">{authUser.username}</div>
                                    </div>

                                    <div className="flex flex-row items-center justify-center mt-9 space-x-3">
                                        <button
                                            type="button"
                                            className="px-5 py-3.5 rounded-[5px] h-[30px] min-h-[30px] text-blue-200 text-xs font-bold font-figtree leading-tight tracking-tight whitespace-nowrap gap-2.5 hype3-bg-light-to-teal !bg-blue-200/10 border border-transparent hover:bg-blue-400/20 hover:border hover:border-blue-400 transition-all delay-100 active:bg-blue-400/20 active:border active:border-blue-400/70 uppercase"
                                            onClick={handleViewProfileClick}
                                        >
                                            View Profile
                                        </button>

                                        <button
                                            type="button"
                                            className="px-5 py-3.5 rounded-[5px] h-[30px] min-h-[30px] text-blue-200 text-xs font-bold font-figtree leading-tight tracking-tight whitespace-nowrap gap-2.5 hype3-bg-light-to-teal !bg-blue-200/10 border border-transparent hover:bg-blue-400/20 hover:border hover:border-blue-400 transition-all delay-100 active:bg-blue-400/20 active:border active:border-blue-400/70 uppercase"
                                            onClick={(e) => handleOpenConfirmation(e)}
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            )}

                            {status === 'unauthenticated' && (
                                <div className="flex flex-col items-center justify-center">
                                    <img src="/assets/images/hype3-cover.png" alt="logo" className="w-60 h-60" />
                                </div>
                            )}

                            <div className="flex flex-col items-center justify-center my-9 overflow-y-auto overflow-x-hidden">
                                <ul className="relative space-y-5 py-0">
                                    <li className="menu nav-item">
                                        <Link className="nav-link" type="button" href="#" passHref onClick={handleCreateAgentClick}>
                                            <div className="flex-center">Create</div>
                                        </Link>
                                    </li>

                                    {/* <li className="menu nav-item">
                                        <Link className="nav-link" href={PAGE_LINKS.HOW_ITS_WORK_URL}>
                                            <div className="flex-center">How It Works</div>
                                        </Link>
                                    </li> */}

                                    {menuItems.map((item, index) => (
                                        <li className="menu nav-item" key={index}>
                                            <Link className="nav-link" href={item.link} target="_self" onClick={() => dispatch(toggleSidebar())}>
                                                <div className="flex-center"> {item.label}</div>
                                            </Link>
                                        </li>
                                    ))}

                                    
                                </ul>
                            </div>
                        </div>

                        <div className="sidebar-footer px-9 pb-9">
                            {isTest && <div className="flex items-center justify-center mb-10">uat</div>}
                            <div className="flex justify-center space-x-4 mb-10">
                                <Link href={PAGE_LINKS.SITE_TWITTER_URL} target="_blank" className="text-blue-400 hover:text-blue-400 text-2xl">
                                    <span className="icon-x-twitter"></span>
                                </Link>

                                <Link href={PAGE_LINKS.SITE_TELEGRAM_URL} target="_blank" className="text-blue-400 hover:text-blue-400 text-2xl">
                                    <span className="icon-telegram-no-bg"></span>
                                </Link>

                                {/* <Link href={PAGE_LINKS.SITE_DEXSCREENER_URL} target="_blank" className="text-blue-400 hover:text-blue-400 text-2xl">
                                    <span className="icon-dexscreener"></span>
                                </Link> */}
                            </div>

                            {status === 'unauthenticated' && <MobileSignInButton />}
                            {/* {status === 'authenticated' && <PlaygroundButton />} */}
                        </div>
                    </div>
                </div>
            </nav>
            {confirmDialog('Disconnect wallet?', confirmationModal, setConfirmationModal, handleDisconnect)}
        </div>
    );
};

export default Sidebar;
