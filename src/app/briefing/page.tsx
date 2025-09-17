
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
import { emails as staticEmails, calendarEvents as staticCalendarEvents, notes as staticNotes, liveEmails, liveCalendarEvents, liveNotes } from "@/lib/data";
import { isSameDay } from "date-fns";
import { useMicrosoft365 } from "@/components/microsoft365-provider";

export default function BriefingPage() {
    const { isConnected } = useMicrosoft365();
    const [briefing, setBriefing] = useState<{ emailSummary: string; calendarSummary: string; notesSummary: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const currentEmails = isConnected ? liveEmails : staticEmails;
    const currentCalendarEvents = isConnected ? liveCalendarEvents : staticCalendarEvents;
    const currentNotes = isConnected ? liveNotes : staticNotes;

    useEffect(() => {
        async function fetchBriefing() {
            setIsLoading(true);
            const todayEvents = currentCalendarEvents.filter(e => isSameDay(new Date(e.date), new Date()));
            const unreadEmails = currentEmails.filter(e => !e.isRead);

            try {
                const result = await summarizeBriefing({
                    emails: unreadEmails,
                    events: todayEvents,
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
            } finally {
                setIsLoading(false);
            }
        }
        fetchBriefing();
    }, [isConnected, currentEmails, currentCalendarEvents, currentNotes]);

    return (
        <div className="flex flex-col gap-8">
             <PageHeader
                title="Tages-Briefing"
                description={isConnected ? "Live-Daten aus deinem Microsoft 365 Konto." : "Dein persönliches Cockpit für E-Mails, Termine und Notizen."}
            />
            <Tabs defaultValue="inbox" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="inbox"><Mail className="mr-2"/>Inbox</TabsTrigger>
                    <TabsTrigger value="calendar"><CalendarDays className="mr-2"/>Kalender</TabsTrigger>
                    <TabsTrigger value="notes"><Notebook className="mr-2"/>Notizen</TabsTrigger>
                    <TabsTrigger value="ablage"><FolderKanban className="mr-2"/>Ablage</TabsTrigger>
                </TabsList>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="inbox" className="mt-6">
                            <InboxTab summary={briefing?.emailSummary} emails={currentEmails} />
                        </TabsContent>
                        <TabsContent value="calendar" className="mt-6">
                            <CalendarTab summary={briefing?.calendarSummary} events={currentCalendarEvents} />
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
