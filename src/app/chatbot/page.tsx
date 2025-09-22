'use client'

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { emails, calendarEvents as initialCalendarEvents, notes, teamMembers } from '@/lib/data';
import type { CalendarEvent } from '@/lib/data';

type Message = {
    role: 'user' | 'bot';
    content: string;
};

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const currentUser = teamMembers.find(m => m.id === '1')!;

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Placeholder for chatbot response
            await new Promise(resolve => setTimeout(resolve, 1500));
            const botMessage: Message = { role: 'bot', content: "Die Chatbot-Funktionalität ist zurzeit deaktiviert." };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Fehler',
                description: 'Der Chatbot konnte nicht antworten. Bitte versuche es erneut.'
            });
            // remove user message if bot fails
            setMessages(prev => prev.slice(0, prev.length -1));
        } finally {
            setIsLoading(false);
        }
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
                                <p>Stelle mir eine Frage zu deinen E-Mails, Terminen oder Notizen. <br/>z.B. "Was sind meine wichtigsten Aufgaben heute?" oder "Erstelle ein Meeting für morgen um 10 Uhr mit dem Titel 'Projekt-Update'."</p>
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
                                        <AvatarImage src={currentUser.avatar} />
                                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                             <Avatar className="h-8 w-8 border">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            <div className="max-w-md rounded-lg p-3 bg-muted flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin"/>
                            </div>
                        </div>
                    )}
                </CardContent>
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Frage stellen..."
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                            <Send />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
