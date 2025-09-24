
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { joinTeamWithCode } from '@/lib/team-api';
import { useToast } from '@/hooks/use-toast';

interface JoinTeamCardProps {
    onSuccess: () => void;
}

export function JoinTeamCard({ onSuccess }: JoinTeamCardProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [joinCode, setJoinCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleJoinTeam = async () => {
        if (!user) return;
        if (!joinCode.trim() || joinCode.length !== 6 || !/^\d+$/.test(joinCode)) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte gib einen gültigen 6-stelligen Code ein.' });
            return;
        }

        setIsLoading(true);
        try {
            await joinTeamWithCode(joinCode, user);
            toast({ title: 'Erfolgreich beigetreten!', description: 'Du bist jetzt Mitglied des Teams.' });
            onSuccess();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Beitritt fehlgeschlagen', description: error.message });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className='font-headline flex items-center gap-2'><LogIn />Team beitreten</CardTitle>
                <CardDescription>
                   Tritt einem bestehenden Team mit einem Code oder Einladungslink bei.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className='space-y-2'>
                    <Label htmlFor='join-code'>6-stelliger Beitritts-Code</Label>
                    <Input 
                        id='join-code'
                        placeholder='123456'
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        maxLength={6}
                        disabled={isLoading}
                    />
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                        ODER
                        </span>
                    </div>
                </div>
                 <Button variant="outline" className='w-full' disabled={isLoading}>
                    Mit Einladungslink beitreten
                </Button>
            </CardContent>
            <CardFooter>
                <Button className='w-full' onClick={handleJoinTeam} disabled={isLoading || !joinCode.trim()}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Team beitreten
                </Button>
            </CardFooter>
        </Card>
    );
}
