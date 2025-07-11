'use client';

import React from 'react';
import { Holding } from '@/types/types';

type OutstandingBalanceTableProps = {
    holdings: Holding[];
};

const OutstandingBalanceTable = ({ holdings }: OutstandingBalanceTableProps) => {
    return (
        <div className="flex flex-col w-full">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                                <tr>
                                    <th scope="col" className=" text-start h-table-thead">
                                        Token
                                    </th>
                                    <th scope="col" className=" text-end h-table-thead">
                                        Balance
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {holdings?.map((holding, id) => (
                                    <tr key={id}>
                                        <td className="text-start text-white text-xs font-medium font-figtree">{holding.symbol ?? `??`}</td>

                                        <td className="text-end text-white text-xs font-medium font-figtree">{holding.amount ? holding.amount.toLocaleString() : '-'}</td>
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

export default OutstandingBalanceTable;
