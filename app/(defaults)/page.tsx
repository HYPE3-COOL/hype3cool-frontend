import React, { Suspense } from 'react';
import { Metadata } from 'next';

import HomePageContainer from '@/components/layouts/home/HomePageContainer';

export const metadata: Metadata = {
    title: 'Hype3',
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="px-4 mb-32 mt-24">
                <div className="container mx-auto !max-w-[900px]">
                    <HomePageContainer />
                </div>
            </div>
        </Suspense>
    );
}
