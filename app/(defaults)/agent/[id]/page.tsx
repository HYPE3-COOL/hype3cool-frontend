import { redirect } from 'next/navigation';
import AgentContentPageContainer from '@/components/agent/layout/AgentContentPageContainer';

export default async function AgentContentPage({ params }: { params: { id: string } }) {
    const id = params.id;

    if (!id) {
        redirect('/');
    }

    return (
        <div className="px-4 mb-32 mt-24">
            <div className="container mx-auto !max-w-[900px]">
                <AgentContentPageContainer id={id} />
            </div>
        </div>
    );
}
