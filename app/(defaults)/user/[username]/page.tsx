import { redirect } from 'next/navigation';
import UserProfileContent from '@/components/user/UserProfileContent';

export default function UserContentPage({ params }: { params: { username: string } }) {
    const username = params.username;

    if (!username) {
        redirect('/');
    }

    return (
        // <div className="px-0 mt-[48px] sm:mt-[68px] md:my-32 mb-32 md:px-4">
        <div className="px-4 mb-32 mt-24">
            <div className="container mx-auto !max-w-[900px]">
                <UserProfileContent username={username} />
            </div>
        </div>
    );
}
