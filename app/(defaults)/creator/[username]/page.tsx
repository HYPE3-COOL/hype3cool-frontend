import { redirect } from 'next/navigation';

import CreatorProfileContent from '@/components/creator/CreatorProfileContent';

export default function CreatorProfilePage({ params }: { params: { username: string } }) {
    const username = params.username;

    if (!username) {
        redirect('/');
    }

    return (
        <div className="px-4 mb-32 mt-24">
            {/* <div className="container mx-auto !max-w-[1400px]"> */}
            <div className="container mx-auto !max-w-[900px]">
                <CreatorProfileContent username={username} />
            </div>
        </div>
    );
}
