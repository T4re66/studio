
'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Mic, MicOff, Signal, X, Radio, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import type { TeamMember } from '@/lib/data';
import { PartyConfetti } from './party-confetti';
import { useAuth } from '@/hooks/use-auth';

// Placeholder for fetching team members from Firestore
const getOnlineUsers = async (): Promise<TeamMember[]> => {
    return [];
}

export function FloatingWalkieTalkie() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
    const [isPartyMode, setIsPartyMode] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<TeamMember[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (user && isOpen) {
            getOnlineUsers().then(setOnlineUsers);
        }
    }, [user, isOpen]);


    const handleToggleOpen = () => {
        setIsOpen(prev => !prev);
        if (isOpen) { // If it was open, now it's closing
            setSelectedUser(null);
        }
    };
    
    const handleSelectUser = (user: TeamMember) => {
        setSelectedUser(user);
        toast({
            title: `Kanal gewechselt`,
            description: `Du sprichst jetzt mit ${user.name?.split(' ')[0]}.`,
        })
    }

    const handleTalk = () => {
        if (!selectedUser) {
            toast({
                variant: 'destructive',
                title: 'Kein Kanal ausgewählt',
                description: 'Wähle zuerst einen Kollegen zum Anfunken aus.'
            });
            return;
        }
        setIsTalking(true);
    };

    const handleStopTalk = () => {
        setIsTalking(false);
    };

    const handlePartyPanic = () => {
        setIsPartyMode(true);
        toast({
            title: 'PARTY ALARM!',
            description: 'Zeit für eine spontane Feier! Alle sind eingeladen.',
        });
        setTimeout(() => {
            setIsPartyMode(false);
        }, 5000); // Confetti for 5 seconds
    }

    if (!user) {
        return null; // Don't show the walkie-talkie if not logged in
    }

    return (
        <>
            {isPartyMode && <PartyConfetti />}
            <div className="fixed bottom-6 right-6 z-50">
                <Button 
                    size="icon"
                    className="rounded-full w-16 h-16 shadow-lg"
                    onClick={handleToggleOpen}
                    style={{ background: 'var(--gradient)'}}
                >
                    {isOpen ? <X className="h-8 w-8" /> : <Radio className="h-8 w-8" />}
                </Button>
            </div>

            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50">
                    <Card className="w-80 shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Signal />Walkie-Talkie</CardTitle>
                            <CardDescription>Wähle einen Kanal zum Funken.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 max-h-60 overflow-y-auto pr-3">
                             {onlineUsers.map(member => (
                                <button 
                                    key={member.id} 
                                    className={cn(
                                        "w-full text-left p-2 rounded-lg flex items-center gap-3 transition-colors",
                                        member.id === selectedUser?.id ? "bg-primary/10" : "hover:bg-muted/50",
                                    )}
                                    onClick={() => handleSelectUser(member)}
                                >
                                    <Avatar className="h-8 w-8">
                                        {member.avatar && <AvatarImage src={member.avatar} />}
                                        <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold text-sm flex-1 truncate">{member.name}</p>
                                    {member.dnd && <MicOff className="h-4 w-4 text-muted-foreground" title="Nicht stören"/>}
                                </button>
                            ))}
                            {onlineUsers.length === 0 && <p className='text-sm text-center text-muted-foreground py-4'>Niemand online.</p>}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 pt-4 border-t">
                             <div className="flex items-center justify-center gap-4">
                                <Button 
                                    size="icon" 
                                    variant={isMuted ? 'destructive' : 'outline'}
                                    className="rounded-full h-12 w-12"
                                    onClick={() => setIsMuted(prev => !prev)}
                                >
                                    <MicOff className="h-5 w-5" />
                                </Button>
                                <Button
                                    size="icon"
                                    className={cn("rounded-full h-16 w-16 shadow-lg transition-transform", isTalking && "scale-110")}
                                    style={{ background: isTalking ? 'var(--gradient)' : ''}}
                                    onMouseDown={handleTalk}
                                    onMouseUp={handleStopTalk}
                                    onTouchStart={handleTalk}
                                    onTouchEnd={handleStopTalk}
                                    disabled={!selectedUser}
                                >
                                    <Mic className="h-8 w-8" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant='outline'
                                    className="rounded-full h-12 w-12 text-amber-500 border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-600"
                                    onClick={handlePartyPanic}
                                >
                                    <PartyPopper className="h-5 w-5" />
                                </Button>
                             </div>
                             <p className="text-xs text-muted-foreground">Zum Sprechen gedrückt halten</p>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </>
    )
}
