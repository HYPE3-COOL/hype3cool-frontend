import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth-options';

import { CreateAgentContent } from '@/components/agent/layout';

export const metadata: Metadata = {
    title: 'Create Agent',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default async function CreateAgentPage() {
    const session = await getServerSession(authOptions);

    // If no session, redirect to home page
    if (!session) {
        redirect('/');
    }

    return (
        <div className="px-4 mt-[100px] mb-32">
            <CreateAgentContent />
        </div>
    );
}
