import LoadingSpinner from '@/components/elements/LoadingSpinner';
import { BreededTwitters, BaseButton } from '@/components/agent/ui';

import { dispatch, useSelector } from '@/store';
import { setCreateAgentStep } from '@/store/slices/agent';

const CreateAgentStep2 = () => {
    const { suggestedTwitters, character, profilePic, isAnalyzeLoading } = useSelector((state: any) => state.agent);

    if (isAnalyzeLoading === 'loading') {
        return (
            <div className="w-full h-full flex items-center justify-center relative">
                <LoadingSpinner />
            </div>
        );
    }

    if (isAnalyzeLoading === 'failure') {
        return (
            <div className="w-full text-center">
                <div className="text-white/30 text-xs xxs:text-sm xs:text-lg sm:text-xl md:text-2xl font-medium font-jetbrains leading-tight">System Error</div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="subheader">
                <div className="text-white h-subheading-neo">
                    MEET <span className="text-blue-200">{character?.name}</span>
                </div>
            </div>
            <div className="mt-[42px] flex flex-row items-start gap-x-10">
                <img className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] rounded-lg" src={profilePic || '/assets/images/frog-family.png'} />
                <div className="w-[480px] text-white text-base font-medium font-figtree leading-snug">{character?.description}</div>
            </div>

            <div className="mt-[52px] mb-7 text-white text-xl font-normal font-neopixel tracking-tight">BREEDED FROM 🐣</div>

            {suggestedTwitters && <BreededTwitters twittersBreeded={suggestedTwitters} />}

            <div className="mt-[52px] w-60">
                <BaseButton type="button" label="EDIT TO CREATE" onClick={() => dispatch(setCreateAgentStep(2))} />
            </div>
        </div>
    );
};

export default CreateAgentStep2;
