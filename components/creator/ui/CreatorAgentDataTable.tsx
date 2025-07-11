'use client';

import React, { Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';

import { Agent, Creator } from '@/types/types';
import { PAGE_LINKS } from '@/constants/constants';
import PlainIconLinkButton from '@/components/elements/buttons/PlainIconLinkButton';
import { showExplorer } from '@/utils/displayUtils';
import { SolanaChip } from '@/components/common/ui';
import { format } from 'date-fns';
import { TokenMarketValueChip } from '@/components/common/ui/chips';

type CreatorAgentDataTableProps = {
    username: string;
    agents: Agent[];
    creator: Creator;
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
    columnHelper.accessor('avatar', {
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
    columnHelper.display({
        id: 'expand',
        cell: ({ row }) =>
            row.getCanExpand() ? (
                <button
                    type="button"
                    className="w-full text-slate-400 text-xs font-medium font-figtree leading-snug tracking-tight hover:text-blue-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        row.toggleExpanded();
                    }}
                >
                    {row.getIsExpanded() ? 'Collapse' : 'Expand'}
                </button>
            ) : null,
        header: () => <div className="whitespace-nowrap flex justify-end">Earning Details</div>,
        // footer: (info) => info.column.id,
    }),
];

const CreatorAgentDataTable = ({ username, agents, creator }: CreatorAgentDataTableProps) => {
    const router = useRouter();

    const [data, setData] = React.useState(agents);

    useEffect(() => {
        setData([...agents]);
    }, [agents]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
    });

    const handleRowClick = (agent: Agent) => {
        router.push(`${PAGE_LINKS.AGENT}/${agent._id}`);
    };

    // const sticky = 'sticky left-0 bg-black sm:bg-transparent z-10';
    const sticky = '';

    return (
        <Fragment>
            <div className="flex items-center justify-between mb-12">
                <div className="text-white text-xl sm:text-3xl font-normal font-neopixel tracking-tight uppercase">IP AGENTS</div>
                <div>&nbps;</div>
            </div>

            <div className="relative overflow-auto">
                <table className="h-datatable sm:border-separate sm:border-spacing-y-4 text-white">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup, index) => (
                            <tr key={index}>
                                {headerGroup.headers.map((header, index) => (
                                    <th key={index} className={`px-2.5 border-none ${index === 0 ? `${sticky} w-1/3` : 'w-1/6'}`}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map((row, index) => {
                            return (
                                <tr key={index} className="w-full min-h-[55px] cursor-pointer hover:bg-blue-200/5" onClick={() => handleRowClick(row.original)}>
                                    <td colSpan={row.getVisibleCells().length} className="relative rounded-[5px] border-[0.5px] border-slate-400/25 p-0">
                                        <table className="text-whites table-fixed w-full">
                                            <tbody>
                                                <tr>
                                                    {row.getVisibleCells().map((cell, index) => (
                                                        <td key={index} className={`py-1 px-2.5 ${index === 0 ? `${sticky} w-1/3` : 'w-1/6'}`}>
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </td>
                                                    ))}
                                                </tr>

                                                {row.getIsExpanded() && (
                                                    <tr>
                                                        <td colSpan={6} className="py-1 px-2.5">
                                                            <hr className="border-slate-400/25 mb-1" />
                                                            <div className="p-3 space-y-4">
                                                                {row.original?.entries?.map((entry, index) => (
                                                                    <div key={index} data-id={entry.signature} data-name={entry.contractAddress} className="text-xs font-medium font-figtree tracking-tight flex items-center">
                                                                        <div className="w-1.5 h-1.5 bg-white mr-1" />
                                                                        <span className="text-white">@{creator.username} &nbsp;</span>
                                                                        <span className="text-slate-400">received&nbsp;</span>
                                                                        <span className="text-blue-200">
                                                                            {entry?.totalAmount?.toLocaleString()} {entry?.symbol}&nbsp;
                                                                        </span>
                                                                        <span className="text-slate-400">from&nbsp;</span>
                                                                        <span className="text-blue-200">{entry?.user?.username}&nbsp;</span>
                                                                        <span className="text-slate-400">on&nbsp;</span>
                                                                        {entry?.createdAt && <span className="text-white">{format(new Date(entry?.createdAt), 'dd MMM yyyy')}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
};

export default CreatorAgentDataTable;
