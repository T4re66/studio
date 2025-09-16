'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Mic, MicOff, Signal, X, Radio } from 'lucide-react';
import { teamMembers } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/data';

export function FloatingWalkieTalkie() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { toast } = useToast();

    const onlineUsers = teamMembers.filter(u => u.online && u.status !== 'away');

    const handleToggleOpen = () => {
        setIsOpen(prev => !prev);
        if (!isOpen) {
            setSelectedUser(null);
        }
    };
    
    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        toast({
            title: `Kanal gewechselt`,
            description: `Du sprichst jetzt mit ${user.name.split(' ')[0]}.`,
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

    return (
        <>
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
                             {onlineUsers.map(user => (
                                <button 
                                    key={user.id} 
                                    className={cn(
                                        "w-full text-left p-2 rounded-lg flex items-center gap-3 transition-colors",
                                        user.id === selectedUser?.id ? "bg-primary/10" : "hover:bg-muted/50",
                                    )}
                                    onClick={() => handleSelectUser(user)}
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold text-sm flex-1 truncate">{user.name}</p>
                                    {user.dnd && <MicOff className="h-4 w-4 text-muted-foreground" title="Nicht stören"/>}
                                </button>
                            ))}
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
                             </div>
                             <p className="text-xs text-muted-foreground">Zum Sprechen gedrückt halten</p>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </>
    )
}
