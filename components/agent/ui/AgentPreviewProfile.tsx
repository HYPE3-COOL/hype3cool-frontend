import TwitterCreators from './TwitterCreators';

type AgentPreviewProfileProps = {
    name: string;
    description: string;
    profilePic?: string;
    twittersBreeded: any[];
};

const AgentPreviewProfile = ({ name, description, profilePic, twittersBreeded }: AgentPreviewProfileProps) => {
    return (
        <div className="w-full">
            <div className="text-white h-subheading-neo">
                YOUR AGENT: <span className="text-blue-200">{name}</span>
            </div>

            <div className="mt-[42px] flex flex-row items-start gap-x-5">
                <img className="w-[100px] h-[100px] md:w-[180px] md:h-[180px] rounded-lg" src={profilePic || '/assets/images/frog-family.png'} />
                <div className="text-white text-sm font-medium font-figtree leading-snug">{description}</div>
            </div>

            <div className="mt-[52px] text-white text-xl font-normal font-neopixel tracking-tight">BREEDED FROM 🐣</div>

            <div className="my-7">
                <TwitterCreators twittersBreeded={twittersBreeded} />
            </div>
        </div>
    );
};

export default AgentPreviewProfile;
