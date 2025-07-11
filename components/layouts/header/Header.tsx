'use client';

import { useEffect, useLayoutEffect, useState, memo } from 'react';

import { Z_INDEX } from '@/theme/zIndex';

import styled from 'styled-components';
import Navbar from '@/components/layouts/navbar/Navbar';

import { IRootState, useSelector } from '@/store';


const HeaderWrapper = styled.header`
    width: 100%;
    justify-content: space-between;
    position: fixed;
    z-index: ${Z_INDEX.sticky};
`;

const Header = memo(function Header() {
    // const [isScrolledDown, setIsScrolledDown] = useState(false);
    // const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    // useEffect(() => {
    //     const scrollListener = () => {
    //         setIsScrolledDown(window.scrollY > 0);
    //     };
    //     window.addEventListener('scroll', scrollListener);
    //     return () => window.removeEventListener('scroll', scrollListener);
    // }, []);

    // const [isSmallScreen, setIsSmallScreen] = useState(false);

    // useLayoutEffect(() => {
    //     const handleResize = () => {
    //         setIsSmallScreen(window.innerWidth < 768);
    //     };

    //     window.addEventListener('resize', handleResize);
    //     handleResize(); // Initial check on mount

    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    return (
        <HeaderWrapper>
            <Navbar />
        </HeaderWrapper>
    );
});

export default Header;
