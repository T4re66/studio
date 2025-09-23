
'use client'

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import type { User, Email, CalendarEvent, Note } from '@/lib/data';
import { useState, useEffect, useRef } from 'react';
import { chat } from '@/ai/flows/chatbot-flow';
import { fetchGmail, fetchCalendar } from '@/lib/google-api';
import { useToast } from '@/hooks/use-toast';

type Message = {
    role: 'user' | 'bot';
    content: string;
};

// Placeholder function for fetching notes from Firestore
const getNotes = async (userId: string): Promise<Note[]> => {
    // In a real app, this would fetch from Firestore.
    // For now, returning an empty array to avoid errors.
    return [];
}


export default function ChatbotPage() {
    const { user, accessToken } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState<{ emails: Email[], events: CalendarEvent[], notes: Note[] }>({ emails: [], events: [], notes: [] });
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const loadContextData = async () => {
            if (user && accessToken) {
                try {
                    const [emails, events, notes] = await Promise.all([
                        fetchGmail(accessToken),
                        fetchCalendar(accessToken),
                        getNotes(user.uid),
                    ]);
                    setContext({ emails, events, notes });
                } catch (error) {
                    toast({
                        variant: 'destructive',
                        title: 'Fehler beim Laden der Daten',
                        description: 'Der Chatbot hat möglicherweise keinen Zugriff auf Ihre aktuellen Informationen.'
                    })
                }
            }
        };
        loadContextData();
    }, [user, accessToken, toast]);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat({
                message: input,
                history: messages,
                context: context,
            });
            const botMessage: Message = { role: 'bot', content: response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: Message = { role: 'bot', content: 'Entschuldigung, ein Fehler ist aufgetreten.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
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
                                <p>Stelle mir eine Frage zu deinen E-Mails, Terminen oder Notizen. <br/>z.B. "Fasse meine ungelesenen Mails zusammen."</p>
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
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 border">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            <div className="max-w-md rounded-lg p-3 bg-muted flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm text-muted-foreground">Denkt nach...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>
                <div className="p-4 border-t">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Frage stellen..."
                            disabled={isLoading || !user}
                        />
                        <Button type="submit" disabled={isLoading || !input.trim() || !user}>
                            <Send />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
