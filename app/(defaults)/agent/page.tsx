import React, { Suspense } from 'react';
import { Metadata } from 'next';
import AgentDataTable from '@/components/agent/ui/AgentDataTable';

export const metadata: Metadata = {
    title: 'Hype3 | Agents',
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="px-4 mt-24 mb-32">
                <div className="container mx-auto !max-w-[900px]">
                    <AgentDataTable />
                </div>
            </div>
        </Suspense>
    );
}
