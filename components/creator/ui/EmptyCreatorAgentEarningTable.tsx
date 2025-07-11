import Link from 'next/link';
import React from 'react';

const items = [
    {
        id: 1,
        name: 'John Doe',
        title: 'Regional Paradigm Technician',
        email: '',
    },

];

const EmptyCreatorAgentEarningTable = () => {
    return (
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                                <tr>
                                    <th scope="col" className=" text-start h-table-thead w-1/2">
                                        IP Agents
                                    </th>
                                    <th scope="col" className=" text-start h-table-thead px-3">
                                        Ticker
                                    </th>
                                    <th scope="col" className=" text-start h-table-thead px-3">
                                        Creator(s)
                                    </th>
                                    <th scope="col" className=" text-start h-table-thead px-3">
                                        Earnings
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y  dark:divide-slate-400/10">
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="whitespace-nowrap pr-3">
                                            <div className="flex items-center">
                                                {/* <img src="/assets/images/sqaure-avatar.png" alt="avatar" className="w-8 h-8 rounded-lg" /> */}
                                                <div className="w-[50px] h-[50px] bg-slate-400/10 rounded-lg" />
                                                <div className="text-white text-base font-semibold font-figtree tracking-tight ml-4">??</div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 text-slate-400 text-sm font-medium font-figtree tracking-tight">??</td>
                                        <td className="whitespace-nowrap px-3 text-slate-400 text-sm font-medium font-figtree tracking-tight">??</td>

                                        <td className="whitespace-nowrap px-3">
                                            <div className="flex item-center space-x-4">
                                                <span className="text-white text-sm font-medium font-figtree tracking-tight">- </span>
                                                <span className="text-slate-400 text-sm font-medium font-figtree tracking-tight">SOL</span>
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

export default EmptyCreatorAgentEarningTable;
