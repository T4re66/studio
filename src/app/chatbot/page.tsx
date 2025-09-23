
'use client'

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/lib/data';
import { useState } from 'react';

type Message = {
    role: 'user' | 'bot';
    content: string;
};


export default function ChatbotPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    
    // In a real app, this would be a more complex state management
    const currentUser: Partial<User> = {
        id: user?.uid,
        name: user?.displayName,
        avatar: user?.photoURL
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Dein persönlicher Assistent"
                description="Frage die KI nach allem, was in deinen Daten zu finden ist, oder lasse sie Aufgaben für dich erledigen."
            />
            <Card className="flex flex-col h-[70vh]">
                <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.length === 0 ? (
                         <div className="flex h-full items-center justify-center text-muted-foreground text-center">
                            <div>
                                <Bot className="h-12 w-12 mx-auto mb-2" />
                                <p>Stelle mir eine Frage zu deinen E-Mails, Terminen oder Notizen. <br/>z.B. "Was sind meine wichtigsten Aufgaben heute?"</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                                {msg.role === 'bot' && (
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-md rounded-lg p-3", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                 {msg.role === 'user' && (
                                    <Avatar className="h-8 w-8 border">
                                        {currentUser.avatar && <AvatarImage src={currentUser.avatar} />}
                                        <AvatarFallback>{currentUser.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
                <div className="p-4 border-t">
                    <form className="flex gap-2">
                        <Input
                            placeholder="Frage stellen..."
                        />
                        <Button type="submit">
                            <Send />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
