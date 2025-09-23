
'use client'

import { PageHeader } from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, CalendarDays, Notebook, FolderKanban, Loader2 } from "lucide-react";
import { InboxTab } from "@/components/briefing/inbox-tab";
import { CalendarTab } from "@/components/briefing/calendar-tab";
import { NotesTab } from "@/components/briefing/notes-tab";
import { FilingCabinetTab } from "@/components/briefing/filing-cabinet-tab";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { fetchGmail, fetchCalendar } from "@/lib/google-api";
import type { Email, CalendarEvent, Note } from "@/lib/data";

// Placeholder data for UI shell
const placeholderEmails = [
  { id: 'e1', sender: 'Projekt Phoenix', subject: 'Weekly Sync Recap & Action Items', snippet: 'Thanks everyone for the productive meeting. Here are the key takeaways and action items...', isRead: false, timestamp: '10:45' },
  { id: 'e2', sender: 'HR Department', subject: 'Reminder: Annual Performance Reviews', snippet: 'This is a friendly reminder to complete your self-assessment for the annual performance review...', isRead: true, timestamp: '09:15' },
];
const placeholderEvents = [
    { id: 'evt1', title: 'Project Phoenix Sync', date: '2024-07-29', startTime: '10:00', endTime: '11:00', category: 'Meeting', participants: ['1', '2', '3', '4'] },
    { id: 'evt2', title: 'Design Review', date: '2024-07-29', startTime: '14:00', endTime: '15:30', category: 'Meeting', participants: ['1', '3', '4'] },
];
const placeholderNotes = [
    { id: 'n1', title: 'Meeting-Notizen: Project Phoenix', content: '<p>Wichtige Punkte aus dem Meeting: Das Backend-Team hat Probleme mit der Datenbank-Migration. Wir müssen das bis Freitag klären. <strong>Action Item:</strong> Tarec soll sich mit Bob abstimmen.</p>', date: '2024-07-22', tags: ['meeting', 'project-phoenix'] },
];

export default function BriefingPage() {
    const { accessToken, user } = useAuth();
    const [emails, setEmails] = useState<Email[]>(placeholderEmails);
    const [events, setEvents] = useState<CalendarEvent[]>(placeholderEvents);
    const [notes, setNotes] = useState<Note[]>(placeholderNotes);
    const [dataLoading, setDataLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGoogleData = async () => {
            if (accessToken) {
                setDataLoading(true);
                setError(null);
                try {
                    const [gmailData, calendarData] = await Promise.all([
                        fetchGmail(accessToken),
                        fetchCalendar(accessToken)
                    ]);
                    setEmails(gmailData);
                    setEvents(calendarData);
                } catch (err) {
                    setError("Fehler beim Laden der Google-Daten. Bitte versuche, die Verbindung in den Einstellungen zu erneuern.");
                    console.error(err);
                } finally {
                    setDataLoading(false);
                }
            } else {
                // Not logged in, use placeholder data
                setEmails(placeholderEmails);
                setEvents(placeholderEvents);
            }
        };

        loadGoogleData();
    }, [accessToken]);


    return (
        <div className="flex flex-col gap-8">
             <PageHeader
                title="Tages-Briefing"
                description="Eine Vorschau deiner wichtigsten Informationen für den Tag."
            />
            {dataLoading && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Lade deine Google-Daten...</span>
                </div>
            )}
             {error && (
                <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
                    {error}
                </div>
            )}
            <Tabs defaultValue="inbox" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="inbox"><Mail className="mr-2"/>Inbox</TabsTrigger>
                    <TabsTrigger value="calendar"><CalendarDays className="mr-2"/>Kalender</TabsTrigger>
                    <TabsTrigger value="notes"><Notebook className="mr-2"/>Notizen</TabsTrigger>
                    <TabsTrigger value="ablage"><FolderKanban className="mr-2"/>Ablage</TabsTrigger>
                </TabsList>
                <TabsContent value="inbox" className="mt-6">
                    <InboxTab summary={"Zusammenfassung wird generiert..."} emails={emails} />
                </TabsContent>
                <TabsContent value="calendar" className="mt-6">
                    <CalendarTab summary={"Zusammenfassung wird generiert..."} events={events} />
                </TabsContent>
                <TabsContent value="notes" className="mt-6">
                    <NotesTab summary={"Zusammenfassung wird generiert..."} notes={notes} />
                </TabsContent>
                <TabsContent value="ablage" className="mt-6">
                    <FilingCabinetTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
