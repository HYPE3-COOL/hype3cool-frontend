'use client';
import Link from 'next/link';

import styled from 'styled-components';
import { Z_INDEX } from 'theme/zIndex';

import ConnectButton from '@/components/auth/elements/ConnectButton';
import { ExploreNavItem, SupportNavItem } from './navitem';

import { toggleSidebar } from '@/store/slices/themeConfigSlice';
import { useDispatch } from '@/store';
import useHandleCreateAgent from '@/hooks/useHandleCreateAgent';

const Nav = styled.nav`
    z-index: ${Z_INDEX.sticky};
`;

export const PageTabs = () => {
    const handleCreateAgentClick = useHandleCreateAgent();

    return (
        <div className="hidden sm:flex space-x-3">
            <button type="button" className="hype3-top-menu-btn h5" onClick={handleCreateAgentClick}>
                Create
            </button>
            <ExploreNavItem />
            <SupportNavItem />
        </div>
    );
};

const Navbar = () => {
    const dispatch = useDispatch();
    return (
        <>
            <Nav className="w-full fixed bg-dark h-[48px] sm:h-[60px] px-main shadow-sm border-b-[0.2px] border-slate-400/20">
                <div className="flex h-full flex-nowrap">
                    <div className="flex w-full flex-1 items-center justify-start" style={{ flexShrink: 2 }} id="nav-left-side-container">
                        <div className="flex mr-7 items-center cursor-pointer">
                            <Link href="/" className="main-logo flex shrink-0 items-center">
                                <div className="text-center text-white text-[22px] font-normal font-neopixel tracking-tight">HYPE3.COOL</div>
                                <span className="ml-2 icon-hype3 text-xl text-white" />
                            </Link>
                        </div>
                        <div className="hidden sm:flex">
                            <PageTabs />
                        </div>
                    </div>

                    <div id="nav-right-side-container" className="flex w-full flex-1 items-center justify-end" style={{ flexShrink: 2 }}>
                        <div className="flex flex-row" data-gap="12">
                            <ConnectButton />

                            {/* mobile */}
                            <div className="flex sm:hidden">
                                <button type="button" className="text-blue-200 text-2xl" onClick={() => dispatch(toggleSidebar())}>
                                    <span className="icon-menu" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Nav>
        </>
    );
};

export default Navbar;
