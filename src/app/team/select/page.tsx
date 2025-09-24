
'use client';

import { PageHeader } from '@/components/page-header';
import { CreateTeamCard } from '@/components/team/create-team-card';
import { JoinTeamCard } from '@/components/team/join-team-card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function SelectTeamPage() {
    const { user, refetchTeam } = useAuth();
    const router = useRouter();

    const handleTeamAction = async () => {
        await refetchTeam();
        window.location.href = '/dashboard';
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4">
            <div className='w-full max-w-4xl mx-auto'>
                <PageHeader
                    title={`Willkommen, ${user?.displayName?.split(' ')[0] || 'User'}!`}
                    description="Um OfficeZen zu nutzen, erstelle ein neues Team oder tritt einem bestehenden bei."
                />
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <CreateTeamCard onSuccess={handleTeamAction} />
                    <JoinTeamCard onSuccess={handleTeamAction} />
                </div>
            </div>
        </div>
    )
}
