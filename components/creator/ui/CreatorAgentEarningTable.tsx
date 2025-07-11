'use client';

import React from 'react';
import { Agent } from '@/types/types';
import Link from 'next/link';

import { showExplorer } from '@/utils/displayUtils';
import PlainIconLinkButton from '@/components/elements/buttons/PlainIconLinkButton';

type CreatorProfileContentProps = {
    agents: Agent[];
};

const CreatorAgentEarningTable = ({ agents }: CreatorProfileContentProps) => {
    return (
        <div className="flex flex-col w-full">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                                <tr>
                                    <th scope="col" className=" text-start h-table-thead w-1/2 whitespace-nowrap">
                                        IP Agents
                                    </th>
                                    <th scope="col" className=" text-start h-table-thead px-3">
                                        Ticker
                                    </th>
                                    <th scope="col" className=" text-start h-table-thead px-3">
                                        Earnings
                                    </th>
                                    <th scope="col" className=" text-start h-table-thead px-3">
                                        &nbsp;
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y  dark:divide-slate-400/10">
                                {agents.map((agent, id) => (
                                    <tr key={id}>
                                        <td className="whitespace-nowrap pr-3">
                                            <Link href={`/agent/${agent._id}`}>
                                                <div className="flex items-center">
                                                    <img src={agent.avatar} alt="avatar" className="w-[50px] h-[50px] rounded-lg" />
                                                    <div className="text-white text-base font-semibold font-figtree tracking-tight ml-4">{agent.name}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3 text-slate-400 text-sm font-medium font-figtree tracking-tight">
                                            {agent?.entries?.map((entry, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <span className="text-white text-sm font-medium font-figtree tracking-tight">{entry.symbol ? `$${entry.symbol}` : `??`}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="whitespace-nowrap px-3">
                                            {agent?.entries?.map((entry, index) => (
                                                <div className="flex item-center space-x-4">
                                                    <span className="text-white text-sm font-medium font-figtree tracking-tight">{entry.totalAmount ? entry.totalAmount.toLocaleString() : '-'}</span>
                                                    <span className="text-slate-400 text-sm font-medium font-figtree tracking-tight">{entry.symbol ?? `??`}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="whitespace-nowrap px-3 text-slate-400 text-sm font-medium font-figtree tracking-tight">
                                            <div className="flex flex-row items-center space-x-2 h-[50px]">
                                                {agent?.twitter?.url && <PlainIconLinkButton icon="twitter" url={agent?.twitter?.url} />}
                                                {agent?.telegram?.url && <PlainIconLinkButton icon="telegram" url={agent?.telegram?.url} />}
                                                {agent?.website?.url && <PlainIconLinkButton icon="globe" url={agent?.website?.url} />}
                                                {agent?.discord?.url && <PlainIconLinkButton icon="discord" url={agent?.discord?.url} />}
                                                {agent?.contractAddress && <PlainIconLinkButton icon="expand" url={showExplorer(agent?.contractAddress)} />}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorAgentEarningTable;
