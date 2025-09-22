
'use client'

import { PageHeader } from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, CalendarDays, Notebook, FolderKanban, Loader2 } from "lucide-react";
import { InboxTab } from "@/components/briefing/inbox-tab";
import { CalendarTab } from "@/components/briefing/calendar-tab";
import { NotesTab } from "@/components/briefing/notes-tab";
import { FilingCabinetTab } from "@/components/briefing/filing-cabinet-tab";
<<<<<<< HEAD
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { fetchGmail, fetchCalendar } from "@/lib/google-api";
import type { Email, CalendarEvent, Note } from "@/lib/data";
import { summarizeEmails } from "@/ai/flows/summarize-emails-flow";
import { summarizeCalendar } from "@/ai/flows/summarize-calendar-flow";

// Placeholder function for fetching notes from Firestore
const getNotes = async (userId: string): Promise<Note[]> => {
    return [];
}

=======
import { notes as staticNotes, liveNotes } from "@/lib/data";
import type { Email, CalendarEvent } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
>>>>>>> ef6eeef (geht immernoch nicht auf das github passe alles so an das es zu 100pro f)

export default function BriefingPage() {
    const { user, accessToken } = useAuth();
    const [emails, setEmails] = useState<Email[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [emailSummary, setEmailSummary] = useState<string | undefined>(undefined);
    const [calendarSummary, setCalendarSummary] = useState<string | undefined>(undefined);
    // Note: Note summary is not implemented in this version
    const [noteSummary, setNoteSummary] = useState<string | undefined>("Zusammenfassung für Notizen ist noch nicht implementiert.");

    useEffect(() => {
        const loadData = async () => {
            if (user && accessToken) {
                setDataLoading(true);
                setError(null);
                try {
                    const [gmailData, calendarData, notesData] = await Promise.all([
                        fetchGmail(accessToken),
                        fetchCalendar(accessToken),
                        getNotes(user.uid)
                    ]);
                    
                    setEmails(gmailData);
                    setEvents(calendarData);
                    setNotes(notesData);

                    // Generate summaries
                    summarizeEmails(gmailData.filter(e => !e.isRead)).then(setEmailSummary);
                    summarizeCalendar(calendarData).then(setCalendarSummary);

                } catch (err) {
                    setError("Fehler beim Laden der Google-Daten. Bitte versuche, die Verbindung in den Einstellungen zu erneuern.");
                    console.error(err);
                } finally {
                    setDataLoading(false);
                }
            } else {
                setEmails([]);
                setEvents([]);
                setNotes([]);
                setEmailSummary("Verbinde dein Google-Konto, um eine Zusammenfassung zu erhalten.");
                setCalendarSummary("Verbinde dein Google-Konto, um eine Zusammenfassung zu erhalten.");
                setDataLoading(false);
            }
        };

        loadData();
    }, [user, accessToken]);

<<<<<<< HEAD
=======
                setEmails(liveEmails || []);
                setCalendarEvents(liveCalendarEvents || []);
                 
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

        if (!authLoading) {
            fetchData();
        }
    }, [isConnected, authLoading, toast]);


    useEffect(() => {
        async function fetchBriefing() {
            if (isLoading || authLoading) return; // Wait for data to be fetched
            
            // This is a placeholder now. In a real app you would fetch this.
            setBriefing({
                emailSummary: "Dein Posteingang ist aufgeräumt. Wichtige E-Mail von 'Projekt Phoenix' bezüglich der Action Items.",
                calendarSummary: "Dein Tag ist voll! Wichtigstes Ereignis: 'Project Phoenix Sync' um 10:00 Uhr.",
                notesSummary: "Deine Notizen deuten auf offene Punkte beim 'Project Phoenix' hin. Dies scheint heute Priorität zu haben."
            });
        }
        fetchBriefing();
    }, [isConnected, emails, calendarEvents, currentNotes, isLoading, authLoading]);
>>>>>>> ef6eeef (geht immernoch nicht auf das github passe alles so an das es zu 100pro f)

    return (
        <div className="flex flex-col gap-8">
             <PageHeader
                title="Tages-Briefing"
                description="Eine Vorschau deiner wichtigsten Informationen für den Tag."
            />
            {dataLoading && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Lade deine Daten...</span>
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
                    <InboxTab summary={emailSummary} emails={emails} />
                </TabsContent>
                <TabsContent value="calendar" className="mt-6">
                    <CalendarTab summary={calendarSummary} events={events} />
                </TabsContent>
                <TabsContent value="notes" className="mt-6">
                    <NotesTab summary={noteSummary} />
                </TabsContent>
                <TabsContent value="ablage" className="mt-6">
                    <FilingCabinetTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
