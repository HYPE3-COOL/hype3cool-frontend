'use client';
import React, { Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Creator } from '@/types/types';
import { PAGE_LINKS } from '@/constants/constants';
import { TwitterSmallCard } from '@/components/common/ui';
import { useCreators } from '@/hooks/useCreator';
import LoadingSpinner from '@/components/elements/LoadingSpinner';
import { AgentsCell, AgentTokensMarketValueChip } from '@/components/common/ui/chips';

type CreatorDataTableProps = {
    limit?: number;
    showExploreMore?: boolean;
};

const columnHelper = createColumnHelper<Creator>();

const columns = [
    columnHelper.accessor('user', {
        cell: (info) => {
            const creator = info.row.original;
            return <TwitterSmallCard username={creator.twitter?.username || ''} name={creator.twitter?.name || ''} image={creator.image || ''} verified={creator.twitter?.verified || false} />;
        },
        header: () => <div className="whitespace-nowrap">X Creators</div>,
        // footer: (info) => info.column.id,
    }),
    columnHelper.accessor('agents', {
        cell: (info) => <AgentsCell agents={info.getValue()} />,
        header: () => <div className="whitespace-nowrap">Top agents</div>,
        // footer: (info) => info.column.id,
    }),
    columnHelper.accessor('agents', {
        cell: (info) => <AgentTokensMarketValueChip agents={info.getValue()} />,
        header: () => <div className="whitespace-nowrap">Total agent MC</div>,
    }),
    columnHelper.accessor('_id', {
        cell: (info) => '-',
        header: () => <div className="whitespace-nowrap">Total earnings</div>,
        // footer: (info) => info.column.id,
    }),
    columnHelper.accessor('agentCount', {
        cell: (info) => <span className="flex justify-end">{info.getValue()}</span>,
        header: () => <div className="flex justify-end whitespace-nowrap">Agents</div>,
        // footer: (info) => info.column.id,
    }),
];

const CreatorDataTable = ({ limit, showExploreMore }: CreatorDataTableProps) => {
    const router = useRouter();

    const { data: creators, error, isLoading } = useCreators({ limit });

    const [data, setData] = React.useState<Creator[]>([]);    
    useEffect(() => {
        if (creators) {
            // Add agentsCount property to each creator
            const creatorsWithAgentsCount = creators.map((creator) => ({
                ...creator,
                agentCount: creator.agents ? creator.agents.length : 0,
            }));
            setData(creatorsWithAgentsCount);
        }
    }, [creators]);


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleRowClick = (creator: Creator) => {
        router.push(`${PAGE_LINKS.CREATOR}/${creator.twitter?.username}`);
    };

    if (isLoading)
        return (
            <div className="flex items-center justify-center relative">
                <LoadingSpinner />
            </div>
        );
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Fragment>
            <div className="flex items-center justify-between mb-12">
                <div className="text-white text-xl sm:text-3xl font-normal font-neopixel tracking-tight">{showExploreMore ? 'TOP X CREATORS' : 'X CREATORS'}</div>
                {showExploreMore && (
                    <button type="button" className=" text-slate-400 hover:text-blue-200" onClick={() => router.push(PAGE_LINKS.CREATOR)}>
                        <div className="hidden sm:block text-sm font-medium font-figtree leading-snug tracking-tight">Explore more</div>
                        <span className="ml-1 icon-arrow-right" />
                    </button>
                )}
            </div>
            <div className="relative overflow-auto">
                <table className="h-datatable sm:border-separate sm:border-spacing-y-4 text-white">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => (
                                    <th key={header.id} className={`px-2.5 border-none ${index === 0 ? 'w-1/3' : ''}`}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    {/* 03E1FF */}
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="w-full min-h-[55px] cursor-pointer hover:bg-blue-200/5" onClick={() => handleRowClick(row.original)}>
                                {row.getVisibleCells().map((cell, index) => (
                                    <td
                                        key={cell.id}
                                        className={`py-1 px-2.5 border-t-[0.5px] border-b-[0.5px] border-slate-400/25 ${
                                            index === 0
                                                ? 'rounded-tl-[5px] rounded-bl-[5px] border-l-[0.5px] w-1/3'
                                                : index === row.getVisibleCells().length - 1
                                                  ? 'rounded-tr-[5px] rounded-br-[5px] border-r-[0.5px]'
                                                  : ''
                                        }`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
};

export default CreatorDataTable;
