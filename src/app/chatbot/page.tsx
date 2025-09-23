
'use client'

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
<<<<<<< HEAD
import { useAuth } from '@/hooks/use-auth';
import type { User, Email, CalendarEvent, Note } from '@/lib/data';
import { useState, useEffect, useRef } from 'react';
import { chat } from '@/ai/flows/chatbot-flow';
import { fetchGmail, fetchCalendar } from '@/lib/google-api';
=======
>>>>>>> ef6eeef (geht immernoch nicht auf das github passe alles so an das es zu 100pro f)
import { useToast } from '@/hooks/use-toast';
=======
import type { User as UserType } from '@/lib/data';
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)

type Message = {
    role: 'user' | 'bot';
    content: string;
};

<<<<<<< HEAD
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
<<<<<<< HEAD
    const [context, setContext] = useState<{ emails: Email[], events: CalendarEvent[], notes: Note[] }>({ emails: [], events: [], notes: [] });
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
=======
    const { toast } = useToast();
>>>>>>> ef6eeef (geht immernoch nicht auf das github passe alles so an das es zu 100pro f)

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
<<<<<<< HEAD
            const response = await chat({
                message: input,
                history: messages,
                context: context,
            });
            const botMessage: Message = { role: 'bot', content: response };
=======
            // Placeholder for chatbot response
            await new Promise(resolve => setTimeout(resolve, 1500));
            const botMessage: Message = { role: 'bot', content: "Die Chatbot-Funktionalität ist zurzeit deaktiviert." };
>>>>>>> ef6eeef (geht immernoch nicht auf das github passe alles so an das es zu 100pro f)
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

=======
// Placeholder data for UI shell
const currentUser: UserType = { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15' };
const messages: Message[] = [];

export default function ChatbotPage() {
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
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
<<<<<<< HEAD
                                <p>Stelle mir eine Frage zu deinen E-Mails, Terminen oder Notizen. <br/>z.B. "Fasse meine ungelesenen Mails zusammen."</p>
=======
                                <p>Stelle mir eine Frage zu deinen E-Mails, Terminen oder Notizen. <br/>z.B. "Was sind meine wichtigsten Aufgaben heute?"</p>
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
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
<<<<<<< HEAD
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
=======
                </CardContent>
                <div className="p-4 border-t">
                    <form className="flex gap-2">
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
                        <Input
                            placeholder="Frage stellen..."
<<<<<<< HEAD
                            disabled={isLoading || !user}
                        />
                        <Button type="submit" disabled={isLoading || !input.trim() || !user}>
=======
                        />
                        <Button type="submit">
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
                            <Send />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
