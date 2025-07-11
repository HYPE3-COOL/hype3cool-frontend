'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Agent } from '@/types/types';
import { AGENT_LIST_FILTERS, AgentListFilter, PAGE_LINKS } from '@/constants/constants';

import PlainIconLinkButton from '@/components/elements/buttons/PlainIconLinkButton';
import { displayTime, showExplorer } from '@/utils/displayUtils';
import { SolanaChip } from '@/components/common/ui';
import { BreedFromCell, TokenMarketValueChip } from '@/components/common/ui/chips';

import { useAgents } from '@/hooks/useAgent';
import AgentListToggleSwitch from './AgentListToggleSwitch';

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

type AgentDataTableProps = {
    limit?: number;
    showExploreMore?: boolean;
};

const columnHelper = createColumnHelper<Agent>();

const columns = [
    columnHelper.accessor('_id', {
        cell: (info) => {
            const agent = info.row.original;
            const agentTwitterName = agent?.twitter?.url?.split('/')[3] || '';
            return (
                <div className="flex items-center">
                    <div className="w-10 h-10 min-w-10 min-h-10 rounded-[3px] bg-cover bg-center" style={{ backgroundImage: `url(${agent.avatar})` }} />
                    <div className="ml-2.5">
                        <div className="flex items-center text-white text-sm sm:text-lg font-normal font-neopixel tracking-tight">{agent?.name}</div>
                        {agentTwitterName && (
                            <span
                                className="text-slate-400 text-xs font-medium font-figtree tracking-tight mt-0.5 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`https://x.com/${agentTwitterName}`, '_blank');
                                }}
                            >
                                @{agentTwitterName}
                            </span>
                        )}
                    </div>
                </div>
            );
        },
        header: () => <div className="whitespace-nowrap">Agent name</div>,
        size: 400,
        // footer: (info) => info.column.id,
    }),
    columnHelper.accessor('suggestions', {
        cell: (info) => <BreedFromCell twitters={info.getValue()} />,
        header: () => <div className="whitespace-nowrap">Breed from</div>,
        // footer: (info) => info.column.id,
    }),
    columnHelper.accessor('token', {
        cell: (info) => <div>{info.row.original?.token?.name ?? '-'}</div>,
        header: () => (
            <div className="whitespace-nowrap gap-x-1 flex items-center">
                Ticker
                <SolanaChip />
            </div>
        ),
    }),
    columnHelper.accessor('token', {
        cell: (info) => <div>{info.row.original?.token?.address ? <TokenMarketValueChip tokenAddress={info.row.original?.token?.address} /> : '-'}</div>,
        header: () => <div className="whitespace-nowrap">Market Cap</div>,
    }),
    columnHelper.accessor('character', {
        cell: (info) => {
            const agent = info.row.original;
            return (
                <div className="icon-groups items-center space-x-0.5 inline-flex">
                    {agent?.twitter?.url && <PlainIconLinkButton icon="twitter" url={agent?.twitter?.url} />}
                    {agent?.telegram?.url && <PlainIconLinkButton icon="telegram" url={agent?.telegram?.url} />}
                    {agent?.website?.url && <PlainIconLinkButton icon="globe" url={agent?.website?.url} />}
                    {agent?.discord?.url && <PlainIconLinkButton icon="discord" url={agent?.discord?.url} />}
                    {agent?.contractAddress && <PlainIconLinkButton icon="expand" url={showExplorer(agent?.contractAddress)} />}
                </div>
            );
        },
        header: () => <div className="whitespace-nowrap">Socials</div>,
        // footer: (info) => info.column.id,
    }),
    columnHelper.accessor('createdAt', {
        cell: (info) => <span className="flex justify-end">{displayTime(new Date(info.getValue()))}</span>,
        header: () => <div className="whitespace-nowrap flex justify-end">Created</div>,
        // footer: (info) => info.column.id,
    }),
];

const AgentDataTable = ({ limit, showExploreMore }: AgentDataTableProps) => {
    const router = useRouter();

    // const [type, setType] = useState(AGENT_LIST_FILTERS.ALL);
    const [type, setType] = useState<AgentListFilter>(AGENT_LIST_FILTERS.ALL);

    const [sortBy, setSortBy] = useState<string>(sortByOptions[0].value);
    const [sortDirection, setSortDirection] = useState<string>(sortDirectionOptions[1].value);

    const { data: agents, error, isLoading, refetch } = useAgents({ limit, sortBy, sortDirection, type });

    useEffect(() => {
        refetch();
    }, [sortBy, sortDirection, type, refetch]);

    if (error) return <div>Error: {error.message}</div>;

    const [data, setData] = React.useState<Agent[]>([]);

    useEffect(() => {
        if (agents) {
            setData(agents);
        }
    }, [agents]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleRowClick = (agent: Agent) => {
        router.push(`${PAGE_LINKS.AGENT}/${agent._id}`);
    };

    // const [activeButton, setActiveButton] = useState<'all' | 'token'>('all');

    return (
        <Fragment>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between mb-12 gap-4 sm:gap-0">
                <div className="text-white text-xl sm:text-3xl font-normal font-neopixel tracking-tight">IP AGENTS</div>

                <AgentListToggleSwitch activeButton={type} setActiveButton={setType} />
            </div>
            <div className="relative overflow-auto">
                <table className="h-datatable sm:border-separate sm:border-spacing-y-4 text-white">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup, index) => (
                            <tr key={index}>
                                {headerGroup.headers.map((header, index) => (
                                    <th key={header.id} className={`px-2.5 border-none ${index === 0 ? 'w-1/3' : ''}`}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            // <tr
                            //     key={row.id}
                            //     className="w-full min-h-[55px] rounded-[5px] cursor-pointer border-b-[0.5px] border-[#94A3B8] sm:border-none sm:shadow-[inset_0_0_1px_#94A3B8]"
                            //     onClick={() => handleRowClick(row.original)}
                            // >
                            // {row.getVisibleCells().map((cell, index) => (
                            //     <td key={cell.id} className={`py-1 px-2.5 ${index === 0 ? 'sticky left-0 bg-black sm:bg-transparent z-10' : ''}`}>
                            //         {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            //     </td>
                            // ))}
                            // </tr>

                            <tr key={row.id} className="w-full min-h-[55px] cursor-pointer hover:bg-blue-200/5" onClick={() => handleRowClick(row.original)}>
                                {row.getVisibleCells().map((cell, index) => (
                                    <td
                                        key={index}
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
            {showExploreMore && (
                <div className="flex justify-center mt-[38px]">
                    <button type="button" className=" text-slate-400 hover:text-blue-200" onClick={() => router.push(PAGE_LINKS.AGENT)}>
                        <div className="hidden sm:block text-sm font-medium font-figtree leading-snug tracking-tight">Load more</div>
                        <span className="ml-1 icon-arrow-right transform rotate-90" />
                    </button>
                </div>
            )}
        </Fragment>
    );
};

export default AgentDataTable;
