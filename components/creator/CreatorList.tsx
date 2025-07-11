'use client';
import React, { Fragment } from 'react';

// hooks

// ui
import styled from 'styled-components';

// redux

// types
import { Creator } from 'types/types';
import { useRouter } from 'next/navigation';
import CreatorCard from './CreatorCard';
import { useCreators } from '@/hooks/useCreator';
import LoadingSpinner from '../elements/LoadingSpinner';
import MainDataTable from '../common/ui/MainDataTable';

const CardListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px 80px;

    @media (max-width: 768px) {
        gap: 20px 20px;
    }
`;

type CreatorListProps = {
    limit?: number;
};

const CreatorList = ({ limit }: CreatorListProps) => {
    const router = useRouter();

    const { data: creators, error, isLoading } = useCreators({ limit });

    if (isLoading)
        return (
            <div className="flex items-center justify-center relative">
                <LoadingSpinner />
            </div>
        );
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Fragment>
            <CardListContainer>
                {creators &&
                    creators.map((creator: Creator, index: number) => (
                        <div className="flex-shrink-0 w-[280px] md:w-[420px] mb-4" key={index}>
                            <CreatorCard creator={creator} />
                        </div>
                    ))}
            </CardListContainer>

            <MainDataTable />
        </Fragment>
    );
};

export default CreatorList;
