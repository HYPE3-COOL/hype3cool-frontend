import Link from 'next/link';
import React from 'react';

const items = [
    {
        id: 1,
        image: '/assets/images/chillguy-agent.png',
        name: 'chillguy agent',
        symbol: '$CHILLGUYAI',
        price: 0.00054,
        earnings: 100,
    },
    {
        id: 2,
        image: '/assets/images/chill-sol-ai.png',
        name: 'chill sol ai',
        symbol: '$CHILLSOL',
        price: 0.00054,
        earnings: 25,
    },
    {
        id: 3,
        image: '/assets/images/chillguy-ai.png',
        name: 'chillguy ai',
        symbol: '$CHILL',
        price: 0.00054,
        earnings: 3.5,
    },
];

const ProfileTableSpecial = () => {
    return (
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                                <tr>
                                    <th scope="col" className=" text-start h-table-thead w-full">
                                        Agents
                                    </th>
                                    <th scope="col" className=" text-start h-table-thead px-3">
                                        Ticker
                                    </th>
                                    <th scope="col" className=" text-start h-table-thead px-3">
                                        Price
                                    </th>
                                    <th scope="col" className=" text-start h-table-thead px-3">
                                        Earnings
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-red-200 dark:divide-slate-400/10">
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="whitespace-nowrap pr-3">
                                            <div className="flex items-center">
                                                <img src={item.image} alt="avatar" className="w-8 h-8 rounded-lg" />
                                                <div className="text-white text-sm font-semibold font-figtree tracking-tight ml-4">{item.name}</div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 text-white text-sm font-semibold font-figtree tracking-tight">
                                            {item.symbol != '' ? `${item.symbol}` : '-'}</td>
                                        <td className="whitespace-nowrap px-3 text-white text-sm font-semibold font-figtree tracking-tight">
                                            {item.price && <span className="text-slate-400 text-sm font-medium font-figtree tracking-tight">$</span>}
                                            {item.price ? `${item.price}` : '-'}</td>
                                        <td className="whitespace-nowrap px-3 text-white text-sm font-semibold font-figtree tracking-tight">{item.earnings ? `${item.earnings}` : '-'} <span className="text-slate-400 text-sm font-medium font-figtree tracking-tight">SOL</span></td>
                                        

                                        {/* <td className="whitespace-nowrap px-3">
                                            <div className="flex item-center space-x-4">
                                                <Link href="#">
                                                    <button type="button">
                                                        <span className="icon-x-twitter text-blue-200 text-base mr-2" />
                                                    </button>
                                                </Link>
                                                <Link href="#">
                                                    <button type="button">
                                                        <span className="icon-telegram-no-bg text-blue-200 text-base mr-2" />
                                                    </button>
                                                </Link>
                                                <Link href="#">
                                                    <button type="button">
                                                        <span className="icon-discord text-blue-200 text-base mr-2" />
                                                    </button>
                                                </Link>
                                                <Link href="#">
                                                    <button type="button">
                                                        <span className="icon-globe text-blue-200 text-base mr-2" />
                                                    </button>
                                                </Link>
                                                <Link href="#">
                                                    <button type="button">
                                                        <span className="icon-expand text-blue-200 text-base mr-2" />
                                                    </button>
                                                </Link>
                                            </div>
                                        </td> */}
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

export default ProfileTableSpecial;
