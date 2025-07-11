import Link from 'next/link';
import { User } from '@/types/types';

type DeveloperNameBadgeProps = {
    user: User;
};

const DeveloperNameBadge = ({ user }: DeveloperNameBadgeProps) => {
    const username = user.username;
    const image = user.image;

    return (
        <Link href={`/user/${username}`} passHref target="_self" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-row items-center gap-x-2.5 justify-end">
                <div className=" text-blue-200 text-sm font-semibold font-figtree leading-snug">DEV</div>
                <img className="w-[35px] h-[35px] rounded-full" src={image || '/assets/images/frog-avatar.png'} />
                <div className=" text-blue-200 text-sm font-semibold font-figtree leading-snug">{username}</div>
            </div>
        </Link>
    );
};

export default DeveloperNameBadge;
