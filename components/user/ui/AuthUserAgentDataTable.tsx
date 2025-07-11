'use client';

import React, { Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Agent } from '@/types/types';
import { PAGE_LINKS } from '@/constants/constants';
import PlainIconLinkButton from '@/components/elements/buttons/PlainIconLinkButton';
import { displayTime, showExplorer } from '@/utils/displayUtils';
import { SolanaChip } from '@/components/common/ui';
import { BreedFromCell, TokenMarketValueChip } from '@/components/common/ui/chips';
import { ManageElizaButton, ManageSocialButton } from '@/components/agent/ui';
import { format } from 'date-fns';
import { TwitterSignUp } from '@/components/common/ui/buttons';
import SendTweetButton from '@/components/common/ui/buttons/SendTweetButton';
// import { TwitterSignUp } from '@/components/common/ui/buttons';

type AuthUserAgentDataTableProps = {
    username: string;
    agents: Agent[];
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
    columnHelper.accessor('createdAt', {
        cell: (info) => <span className="flex justify-end">{displayTime(new Date(info.getValue()))}</span>,
        header: () => <div className="whitespace-nowrap flex justify-end">Created</div>,
        // footer: (info) => info.column.id,
    }),
];

const AuthUserAgentDataTable = ({ username, agents }: AuthUserAgentDataTableProps) => {
    const router = useRouter();

    const [data, setData] = React.useState(agents);

    const isTest = process.env.NEXT_PUBLIC_ENV === 'prod' ? false : true;

    useEffect(() => {
        setData([...agents]);
    }, [agents]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: () => true,
    });

    const handleRowClick = (agent: Agent) => {
        router.push(`${PAGE_LINKS.AGENT}/${agent._id}`);
    };

    const handleEditAgentClick = (agent: Agent) => {
        if (agent?._id) {
            if (agent?.isActive) {
                router.push(PAGE_LINKS['AGENT_CREATE'] + '/' + agent?._id + '?step=3');
            } else {
                router.push(PAGE_LINKS['AGENT_CREATE'] + '/' + agent?._id + '?step=2');
            }
        }
    };

    const getLatestSubscription = (agent: Agent): string => {
        if (!agent.subscriptions || agent.subscriptions.length === 0) {
            return '';
        }

        let latestSubscription = agent.subscriptions[0];
        for (const subscription of agent.subscriptions) {
            if (new Date(subscription.endAt) > new Date(latestSubscription.endAt)) {
                latestSubscription = subscription;
            }
        }

        return latestSubscription.endAt ? format(new Date(latestSubscription.endAt), 'dd/MM/yyyy') : '';
    };

    // const sticky = 'sticky left-0 bg-black sm:bg-transparent z-10';
    const sticky = '';

    return (
        <Fragment>
            <div className="flex items-center justify-between mb-12">
                <div className="text-white text-xl sm:text-3xl font-normal font-neopixel tracking-tight uppercase">YOUR AGENTS</div>
                <div>&nbps;</div>
            </div>
            <div className="relative overflow-auto">
                <table className="h-datatable sm:border-separate sm:border-spacing-y-4 text-white table-fixed w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => (
                                    <th key={index} className={`px-2.5 border-none ${index === 0 ? `${sticky} w-1/3` : index === 4 ? 'w-1/6' : 'w-1/12'}`}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map((row, index) => {
                            const agent = row.original;

                            return (
                                <tr key={index} className="w-full min-h-[55px] cursor-pointer hover:bg-blue-200/5" onClick={() => handleRowClick(row.original)}>
                                    <td colSpan={row.getVisibleCells().length} className="relative rounded-[5px] border-[0.5px] border-slate-400/25 p-0">
                                        <table className="text-whites w-full">
                                            <tbody>
                                                <tr>
                                                    {row.getVisibleCells().map((cell, index) => (
                                                        <td
                                                            key={index}
                                                            className={`py-1 px-2.5 ${index === 0 ? `${sticky} w-1/3` : index === 4 ? 'w-1/6' : 'w-1/12'}
                                                            }`}
                                                        >
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </td>
                                                    ))}
                                                </tr>

                                                <tr>
                                                    <td colSpan={6} className="py-1 px-2.5">
                                                        <hr className="border-slate-400/25 mb-1" />
                                                        <div className="flex items-center justify-between my-5">
                                                            <div>
                                                                <div className=" text-white text-[10px] font-medium font-figtree leading-[10px] tracking-tight mb-1">Subscription Status</div>
                                                                <div className={`${row.original?.isActive ? 'text-blue-200' : 'text-slate-400'} text-xs font-semibold font-figtree tracking-tight`}>
                                                                    {row.original?.isActive ? `Active till ${getLatestSubscription(row.original)}` : 'Inactive'}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 action-buttons">
                                                                {/* {agent._id && agent.isActive && <SendTweetButton agentId={agent._id} />} */}
                                                                {agent.isActive && <ManageSocialButton agent={row.original} />}
                                                                {agent._id && agent.isActive && <TwitterSignUp agentId={agent._id} />}
                                                                <button
                                                                    disabled={false}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditAgentClick(agent);
                                                                    }}
                                                                    type="button"
                                                                    className="xs:w-[130px] h-[38px] h-button h-button-border py-1.5 px-3 bg-slate-400/10 rounded-[100px] justify-center items-center gap-1.5 inline-flex disabled:cursor-not-allowed disabled:ocacity-50"
                                                                >
                                                                    <div className="text-center text-white text-sm font-semibold font-figtree">
                                                                        ✏️️ <span className="hidden xs:inline-block text-xs sm:text-sm">Edit agent</span>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
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

export default AuthUserAgentDataTable;
