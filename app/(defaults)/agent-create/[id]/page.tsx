import React from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';
import { CreateAgentWrapper } from '@/components/agent/layout';

export const metadata: Metadata = {
    title: 'Create Agent',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default async function CreateAgentPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    // If no session, redirect to home page
    if (!session) {
        redirect('/');
    }

    return (
        <div className="px-4 mt-[140px] mb-32">
            <div className="container mx-auto">
                <CreateAgentWrapper id={params.id} />
            </div>
        </div>
    );
}
