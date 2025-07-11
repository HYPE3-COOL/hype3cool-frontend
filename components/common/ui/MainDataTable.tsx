'use client';
import React from 'react';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCreators } from '@/hooks/useCreator';

type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
};

const defaultData: Person[] = [
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 40,
        status: 'Single',
        progress: 80,
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'Complicated',
        progress: 10,
    },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
    columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.lastName, {
        id: 'Top agents',
        cell: (info) => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('age', {
        header: () => 'Total agent MC',
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('visits', {
        header: () => <span>Total earnings</span>,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('status', {
        header: 'Agents',
        footer: (info) => info.column.id,
    }),
    // columnHelper.accessor('progress', {
    //     header: 'Profile Progress',
    //     footer: (info) => info.column.id,
    // }),
];

const MainDataTable = () => {
    const limit = 15;
    const { data: creators, error, isLoading } = useCreators({ limit });

    const [data, _setData] = React.useState(() => [...defaultData]);
    const rerender = React.useReducer(() => ({}), {})[1];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    <div className="text-white text-xs font-medium font-['Figtree'] leading-snug tracking-tight">X Creators</div>;

    return (
        <table className="h-datatable text-white border-separate border-spacing-y-4">
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} className="px-2.5">
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>

            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr
                        key={row.id}
                        className="w-full min-h-[55px] rounded-[5px]"
                        style={{
                            boxShadow: 'inset 0 0 1px #94A3B8',
                        }}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-2.5">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            {/* <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                            <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}</th>
                        ))}
                    </tr>
                ))}
            </tfoot> */}
        </table>
    );
};

export default MainDataTable;
