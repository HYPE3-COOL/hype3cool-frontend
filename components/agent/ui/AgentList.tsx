'use client';
import React, { Fragment, useEffect, useState } from 'react';

// ui
import styled from 'styled-components';
import { Radio, RadioGroup } from '@headlessui/react';

// types
import { Agent } from 'types/types';
import { AgentSmallCard, SortByDropMenu, SortDirectionMenu } from '.';
import { useAgents } from '@/hooks/useAgent';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

const CardListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px 80px;

    @media (max-width: 768px) {
        gap: 20px 20px;
    }
`;

const typeOptions = [
    { name: '💥 New Agents', value: '' },
    { name: '✅ LP Created', value: 'lp' },
    // { name: '🚀 Presale Live', value: 'presale' },
];

const sortByOptions = [
    { label: 'Agent Creation', value: 'createdAt' },
    // { label: 'LP Creation', value: 'lp' },
    // { label: 'Presale Live', value: 'presale' },
    // { label: 'Market Cap', value: 'mv' },
];

const sortDirectionOptions = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
];

type AgentListProps = {
    limit?: number;
};

const AgentList = ({ limit }: AgentListProps) => {
    // const searchParams = useSearchParams();

    const [type, setType] = useState(''); // TODO:
    const [sortBy, setSortBy] = useState<string>(sortByOptions[0].value);
    const [sortDirection, setSortDirection] = useState<string>(sortDirectionOptions[1].value);

    const { data: agents, error, isLoading, refetch } = useAgents({ limit, sortBy, sortDirection, type });

    useEffect(() => {
        refetch();
    }, [sortBy, sortDirection, type, refetch]);

    if (error) return <div>Error: {error.message}</div>;

    // sort by

    const handleSortBySelect = (value: string) => {
        setSortBy(value);
    };

    // sort direction
    const handleSortDirectionSelect = (value: string) => {
        setSortDirection(value);
    };

    return (
        <Fragment>
            <div className="mb-16 flex flex-col justify-between items-start lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="flex flex-row space-x-[14px] overflow-x-auto">
                    <RadioGroup value={type} onChange={setType} aria-label="Server size" className="flex flex-row space-x-[14px] overflow-x-auto">
                        {typeOptions.map((typeOption) => (
                            <Radio key={typeOption.name} value={typeOption.value} className="group relative flex flex-row cursor-pointer">
                                <div
                                    className={`py-3 px-6 bg-slate-400/10 hover:bg-blue-200 text-white hover:text-black rounded-full text-nowrap inline-flex items-center gap-3 active:bg-blue-200 active:text-black cursor-pointer
                                     group-data-[checked]:bg-blue-200 group-data-[checked]:text-black`}
                                >
                                    <div className="text-center text-xs xs:text-sm sm:text-base font-semibold font-figtree md:text-base">{typeOption.name}</div>
                                </div>
                            </Radio>
                        ))}
                    </RadioGroup>
                </div>
                <div className="flex flex-row space-x-[14px]">
                    <SortByDropMenu label="Sort" options={sortByOptions} selectedOption={sortBy} handleSelect={handleSortBySelect} />
                    <SortDirectionMenu label="Order" options={sortDirectionOptions} selectedOption={sortDirection} handleSelect={handleSortDirectionSelect} />
                </div>
            </div>

            <Fragment>
                {isLoading ? (
                    <div className="flex items-center justify-center relative">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <CardListContainer>
                        {agents &&
                            agents.map((agent: Agent, index: number) => (
                                <div className="flex-shrink-0 w-[280px] md:w-[420px] mb-4" key={index}>
                                    <AgentSmallCard agent={agent} />
                                </div>
                            ))}
                    </CardListContainer>
                )}
            </Fragment>
        </Fragment>
    );
};

export default AgentList;
