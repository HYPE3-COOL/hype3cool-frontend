import React from 'react';

import CreatorDataTable from '@/components/creator/ui/CreatorDataTable';
import HomeStatCard from './HomeStatCard';
import CreateAgentButton from '@/components/agent/ui/CreateAgentButton';
import AgentDataTable from '@/components/agent/ui/AgentDataTable';
import { CreateCreatorButton } from '@/components/creator/ui';

const HomePageContainer = () => {
    return (
        <div>
            <HomeStatCard />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-4">
                <CreateCreatorButton />
                <CreateAgentButton />
            </div>

            <div className="relative mt-[100px] mb-[100px]">
                <CreatorDataTable limit={5} showExploreMore={true} />
            </div>

            <div className="relative mt-[100px] mb-[30px]">
                <AgentDataTable limit={10} showExploreMore={true} />
            </div>
        </div>
    );
};

export default HomePageContainer;
