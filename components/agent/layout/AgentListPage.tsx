import React from 'react';
import AgentList from '../ui/AgentList';

const AgentListPage = () => {
    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <div className="text-center text-white text-[40px] font-medium font-jetbrains">{'{agents}'}</div>
            </div>

            <div className="list-filter relative mt-[100px] mb-[30px]">
                <AgentList />
            </div>
        </div>
    );
};

export default AgentListPage;
