import React from 'react';

import { Agent } from '@/types/types';
import { useRouter } from 'next/navigation';
import { PAGE_LINKS } from '@/constants/constants';
import IconLinkButton from '../elements/buttons/IconLinkButton';
import { showExplorer } from '@/utils/displayUtils';
import { showMessage } from '@/utils/toast';

type TokenWideCardProps = {
    agent: Agent;
};

const TokenWideCard = ({ agent }: TokenWideCardProps) => {
    const router = useRouter();

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (agent?._id) {
            if (agent?.isActive) {
                router.push(PAGE_LINKS['AGENT_CREATE'] + '/' + agent?._id + '?step=3');
            } else {
                router.push(PAGE_LINKS['AGENT_CREATE'] + '/' + agent?._id + '?step=2');
            }
        }
    };

    const handleCardClick = () => {
        router.push(`/agent/${agent._id}`);
    };

    return (
        <div className="cursor-pointer" onClick={handleCardClick}>
            <div className="relative bg-slate-400/5 rounded-lg shadow-inner border border-slate-400/20">
                <div className="flex flex-col px-[28px] py-[30px] space-y-5">
                    <div className="flex flex-item space-x-[30px] justify-between">
                        <div className="thumbnail-wrapper w-[180px] h-[180px] min-w-[180px] min-h-[180px] relative">
                            <div className="thumbnail-content">
                                <img className="w-full h-full overflow-hidden" src={agent?.avatar} />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="text-white text-2xl font-medium font-figtree tracking-wide mb-1">{agent.name}</div>
                                {/* <div className="text-slate-400 text-sm font-semibold font-figtree tracking-tight">$DEGOD</div> */}
                                <div className=" text-white/70 text-sm font-medium font-figtree leading-tight my-3">{agent.character.bio?.[0]}</div>
                            </div>

                            <div className="icon-groups items-center space-x-2 inline-flex">
                                {agent?.twitter?.url && <IconLinkButton icon="twitter" url={agent?.twitter?.url} />}
                                {agent?.telegram?.url && <IconLinkButton icon="telegram" url={agent?.telegram?.url} />}
                                {agent?.website?.url && <IconLinkButton icon="globe" url={agent?.website?.url} />}
                                {agent?.discord?.url && <IconLinkButton icon="discord" url={agent?.discord?.url} />}
                                {agent?.contractAddress && <IconLinkButton icon="expand" url={showExplorer(agent?.contractAddress)} />}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between flex-grow">
                            <div className="flex flex-col">
                                {/* <div className=" text-blue-200 text-[10px] font-bold uppercase font-figtree leading-snug tracking-tight">Subscription Status</div>
                            <div className=" text-white text-base font-bold font-figtree leading-snug">{agent?.isActive ? 'Active' : 'Inactive'}</div> */}
                                {/* <div className=" text-blue-200 text-[10px] font-bold uppercase font-figtree leading-snug tracking-tight">Market CAP</div>
                            <div className=" text-white text-base font-bold font-figtree leading-snug">$69.5k</div> */}
                            </div>
                            <div className="flex flex-row space-x-[14px]">
                                <div className="flex flex-col text-right">
                                    <div className=" text-blue-200 text-[10px] font-bold uppercase font-figtree leading-snug tracking-tight">Subscription Status</div>
                                    <div className=" text-white text-base font-bold font-figtree leading-snug">{agent?.isActive ? 'Active' : 'Inactive'}</div>
                                </div>

                                {/* <div className="flex flex-col text-right">
                                <div className=" text-blue-200 text-[10px] font-bold uppercase font-figtree leading-snug tracking-tight">PRICE</div>
                                <div className=" text-white text-base font-bold font-figtree leading-snug">$0.000051</div>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="w-fit px-3 h-[38px] min-h-[38px] py-2 rounded-[20px] border bg-blue-200/10 text-blue-200 border-blue-200/70 hover:bg-blue-200 hover:text-black hover: disabled:cursor-not-allowed"
                                >
                                    <div className="flex justify-center items-center py-3 space-x-2">
                                        <span className="icon-arrows text-base" />
                                    </div>
                                </button>
                            </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-5 right-5">
                    <button onClick={(e) => handleButtonClick(e)} className="text-white/70 text-base font-semibold font-figtree leading-tight tracking-tight hover:text-blue-200 mb-[11px]">
                        Edit Agent
                        <span className="icon-pen text-xs pl-1.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenWideCard;
