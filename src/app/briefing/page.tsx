
'use client'

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, CalendarDays, Notebook, FolderKanban, Loader2 } from "lucide-react";
import { InboxTab } from "@/components/briefing/inbox-tab";
import { CalendarTab } from "@/components/briefing/calendar-tab";
import { NotesTab } from "@/components/briefing/notes-tab";
import { FilingCabinetTab } from "@/components/briefing/filing-cabinet-tab";
import { summarizeBriefing } from "@/ai/flows/summarize-briefing-flow";
import { notes as staticNotes, liveNotes } from "@/lib/data";
import type { Email, CalendarEvent } from "@/lib/data";
import { useSession } from "next-auth/react";
import { getGoogleEmails, getGoogleCalendarEvents } from "@/lib/google-api";
import { useToast } from "@/hooks/use-toast";

export default function BriefingPage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const isConnected = status === 'authenticated';
    
    const [briefing, setBriefing] = useState<{ emailSummary: string; calendarSummary: string; notesSummary: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [emails, setEmails] = useState<Email[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

    const currentNotes = isConnected ? liveNotes : staticNotes;

    useEffect(() => {
        async function fetchData() {
            if (status !== 'authenticated') {
                setEmails([]);
                setCalendarEvents([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const [emailData, eventData] = await Promise.all([
                    getGoogleEmails(),
                    getGoogleCalendarEvents()
                ]);

                if(emailData.error || eventData.error){
                    toast({
                        variant: 'destructive',
                        title: 'Fehler beim Laden der Google-Daten',
                        description: emailData.error || eventData.error || 'Bitte überprüfe deine Verbindung und versuche es erneut.'
                    });
                    setEmails([]);
                    setCalendarEvents([]);
                } else {
                    setEmails(emailData.emails || []);
                    setCalendarEvents(eventData.events || []);
                }

            } catch (e) {
                console.error('Failed to fetch google data', e);
                 toast({
                    variant: 'destructive',
                    title: 'Fehler',
                    description: 'Ein unerwarteter Fehler ist beim Laden der Google-Daten aufgetreten.'
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [status, toast]);


    useEffect(() => {
        async function fetchBriefing() {
            if (isLoading) return; // Wait for data to be fetched
            
            // For summarization, only use unread emails and today's events.
            const unreadEmails = emails.filter(e => !e.isRead);

            try {
                const result = await summarizeBriefing({
                    emails: unreadEmails.map(e => ({ sender: e.sender, subject: e.subject, snippet: e.snippet })),
                    events: calendarEvents.map(e => ({ title: e.title, startTime: e.startTime, endTime: e.endTime, category: e.category })),
                    notes: currentNotes,
                });
                setBriefing(result);
            } catch (e) {
                console.error(e);
                setBriefing({
                    emailSummary: "Zusammenfassung der E-Mails konnte nicht geladen werden.",
                    calendarSummary: "Zusammenfassung des Kalenders konnte nicht geladen werden.",
                    notesSummary: "Zusammenfassung der Notizen konnte nicht geladen werden."
                });
            }
        }
        fetchBriefing();
    }, [isConnected, emails, calendarEvents, currentNotes, isLoading]);

    return (
        <div className="flex flex-col gap-8">
             <PageHeader
                title="Tages-Briefing"
                description={isConnected ? "Live-Daten aus deinem Google-Konto." : "Verbinde dein Konto in den Einstellungen, um Live-Daten zu sehen."}
            />
            <Tabs defaultValue="inbox" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="inbox"><Mail className="mr-2"/>Inbox</TabsTrigger>
                    <TabsTrigger value="calendar"><CalendarDays className="mr-2"/>Kalender</TabsTrigger>
                    <TabsTrigger value="notes"><Notebook className="mr-2"/>Notizen</TabsTrigger>
                    <TabsTrigger value="ablage"><FolderKanban className="mr-2"/>Ablage</TabsTrigger>
                </TabsList>

                {isLoading && status === 'authenticated' ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="inbox" className="mt-6">
                            <InboxTab summary={briefing?.emailSummary} emails={emails} isLoading={isLoading} isConnected={isConnected} />
                        </TabsContent>
                        <TabsContent value="calendar" className="mt-6">
                            <CalendarTab summary={briefing?.calendarSummary} events={calendarEvents} isLoading={isLoading} isConnected={isConnected} />
                        </TabsContent>
                        <TabsContent value="notes" className="mt-6">
                            <NotesTab summary={briefing?.notesSummary} notes={currentNotes} />
                        </TabsContent>
                        <TabsContent value="ablage" className="mt-6">
                            <FilingCabinetTab />
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    )
}
