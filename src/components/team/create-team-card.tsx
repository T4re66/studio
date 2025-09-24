
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { createTeam } from '@/lib/team-api';
import { useToast } from '@/hooks/use-toast';

interface CreateTeamCardProps {
    onSuccess: () => void;
}

export function CreateTeamCard({ onSuccess }: CreateTeamCardProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [teamName, setTeamName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateTeam = async () => {
        if (!user) return;
        if (!teamName.trim()) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte gib einen Teamnamen ein.' });
            return;
        }

        setIsLoading(true);
        try {
            await createTeam(teamName, user);
            toast({ title: 'Team erstellt!', description: `Das Team "${teamName}" wurde erfolgreich erstellt.` });
            onSuccess();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Fehler beim Erstellen', description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='font-headline flex items-center gap-2'><Users />Neues Team erstellen</CardTitle>
                <CardDescription>
                    Gründe ein neues Team und lade deine Kollegen ein.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className='space-y-2'>
                    <Label htmlFor='team-name'>Teamname</Label>
                    <Input 
                        id='team-name'
                        placeholder='z.B. Projekt Phoenix Team'
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button className='w-full' onClick={handleCreateTeam} disabled={isLoading || !teamName.trim()}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Team erstellen
                </Button>
            </CardFooter>
        </Card>
    );
}
