import React, { Suspense } from 'react';
import { Metadata } from 'next';

import CreateListPage from '@/components/creator/layout/CreateListPage';
import CreatorDataTable from '@/components/creator/ui/CreatorDataTable';

export const metadata: Metadata = {
    title: 'Hype3 | Creators',
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="px-4 mb-32 mt-24">
                <div className="container mx-auto !max-w-[900px]">
                    {/* <CreateListPage /> */}
                    <CreatorDataTable />
                </div>
            </div>
        </Suspense>
    );
}
