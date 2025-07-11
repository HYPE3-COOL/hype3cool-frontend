import React from 'react';
import { useRouter } from 'next/navigation';

import { Agent } from '@/types/types';
import { PAGE_LINKS } from '@/constants/constants';

import { showExplorer } from '@/utils/displayUtils';
import IconLinkButton from '@/components/elements/buttons/IconLinkButton';
import Link from 'next/link';

type AgentSmallCardProps = {
    agent: Agent;
};

const AgentSmallCard = ({ agent }: AgentSmallCardProps) => {
    const router = useRouter();

    // const handleClick = (id: string) => {
    //     router.push(PAGE_LINKS['AGENT_CREATE'] + '/' + id);
    // };

    const handleCardClick = () => {
        router.push(PAGE_LINKS['AGENT'] + '/' + agent._id);
    };

    return (
        <div className="creator-card min-h-[330px] md:min-h-[330px] cursor-pointer" onClick={handleCardClick}>
            <div className="relative bg-slate-400/5 rounded-lg shadow-inner border border-slate-400/20">
                <div className="flex flex-col p-6 space-y-5">
                    <div className="flex flex-item space-x-[20px]">
                        <div className="thumbnail-wrapper w-[100px] h-[100px] min-w-[100px] min-h-[100px] relative">
                            <div className="thumbnail-content">
                                <img className="w-full h-full overflow-hidden" src={agent?.avatar} />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="text-white text-2xl font-medium font-figtree tracking-wide mb-1">{agent.name}</div>
                                {/* <div className="text-slate-400 text-sm font-semibold font-figtree tracking-tight">$DEGOD</div> */}
                                {/* <div className=" text-white/70 text-sm font-medium font-figtree leading-tight my-3">{agent.character.bio?.[0]}</div> */}
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

                    <div className="text-white/70 text-sm font-medium font-figtree leading-tight my-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: agent.character.bio?.[0] || '' }}></div>

                    <Link href={`/user/${agent?.user?.username}`} passHref target="_self" onClick={(e) => e.stopPropagation()}>
                        <div className=" text-blue-200 text-[10px] font-bold font-figtree uppercase leading-snug tracking-tight mb-1.5">DEV</div>
                        <div className="flex flex-row items-center gap-x-2.5">
                            <img className="w-[35px] h-[35px] rounded-full" src={agent?.user?.image || '/assets/images/frog-avatar.png'} />
                            <div className=" text-blue-200 text-sm font-semibold font-figtree leading-snug">{agent?.user?.username}</div>
                        </div>
                    </Link>

                    <div>
                        <div className="flex justify-between flex-grow">
                            <div className="flex flex-col">
                                <div className=" text-blue-200 text-[10px] font-bold uppercase font-figtree leading-snug tracking-tight">Market CAP</div>
                                <div className=" text-white text-base font-bold font-figtree leading-snug">-</div>
                            </div>
                            <div className="flex flex-row space-x-[14px]">
                                <div className="flex flex-col text-right">
                                    <div className=" text-blue-200 text-[10px] font-bold uppercase font-figtree leading-snug tracking-tight">PRICE</div>
                                    <div className=" text-white text-base font-bold font-figtree leading-snug">-</div>
                                </div>
                                {/* <div>
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
                {/* <div className="flex justify-between gap-x-3.5">
                    <div className="flex justify-between flex-grow">
                        <div className="flex flex-row">
                            <div className="flex flex-col">
                                <div className=" text-blue-200 text-[10px] font-bold font-figtree uppercase leading-snug tracking-tight">Market CAP</div>
                                <div className="flex items-center">
                                    <div>
                                        <span className="text-white/90 text-base font-bold font-figtree leading-snug">$69.5k</span>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col text-right">
                            <div className=" text-blue-200 text-[10px] font-bold uppercase font-figtree leading-snug tracking-tight">PRICE</div>
                            <div className=" text-white/90 text-base font-bold font-figtree leading-snug">$0.000051</div>
                        </div>
                    </div>
                </div> */}
                {/* <div className="absolute top-5 right-5">
                <button onClick={() => handleClick(agent?._id || '')}>
                    <div className="text-white/70 text-base font-semibold font-figtree leading-tight tracking-tight mb-[11px]">
                        Edit Agent
                        <span className="icon-pen text-white/70 text-xs pl-1.5" />
                    </div>
                </button>
            </div> */}
            </div>
        </div>
    );
};

export default AgentSmallCard;
