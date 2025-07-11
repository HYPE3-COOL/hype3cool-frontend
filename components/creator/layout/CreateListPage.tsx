'use client';
import React from 'react';

import { useGetCreators } from '@/hooks/useGetCreators';
import CreatorList from '@/components/creator/CreatorList';

const CreateListPage = () => {
    const { data: creators, error, isLoading } = useGetCreators();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const NumOfCreators = creators?.length || 0;
    const NumOfCreatorsClaimed = 0;

    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <div className="hidden md:block">
                    <div className="wrapper text-center text-white text-xs xxs:text-sm xs:text-lg sm:text-xl md:text-2xl lg:text-[40px] font-medium font-jetbrains leading-tight">
                        <div className="typing-demo">Meet your next IP agent personalities.</div>
                    </div>
                </div>
                <div className="md:hidden text-center text-white text-2xl font-medium font-jetbrains">Meet your next IP agent personalities.</div>
                <div className="text-center mt-[26px] text-slate-400 text-base font-medium font-figtree tracking-tight">
                    {Intl.NumberFormat().format(NumOfCreators)} creators activated. {NumOfCreatorsClaimed} claimed.
                </div>
            </div>

            <div className="list-filter relative mt-[100px] mb-[30px]"><CreatorList /></div>
        </div>
    );
};

export default CreateListPage;
