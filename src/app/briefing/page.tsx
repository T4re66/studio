
'use client'

import { PageHeader } from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, CalendarDays, Notebook, FolderKanban } from "lucide-react";
import { InboxTab } from "@/components/briefing/inbox-tab";
import { CalendarTab } from "@/components/briefing/calendar-tab";
import { NotesTab } from "@/components/briefing/notes-tab";
import { FilingCabinetTab } from "@/components/briefing/filing-cabinet-tab";

// Placeholder data for UI shell
const briefing = {
    emailSummary: "Dein Posteingang ist aufgeräumt. Wichtige E-Mail von 'Projekt Phoenix' bezüglich der Action Items.",
    calendarSummary: "Dein Tag ist voll! Wichtigstes Ereignis: 'Project Phoenix Sync' um 10:00 Uhr.",
    notesSummary: "Deine Notizen deuten auf offene Punkte beim 'Project Phoenix' hin. Dies scheint heute Priorität zu haben."
};
const emails = [
  { id: 'e1', sender: 'Projekt Phoenix', subject: 'Weekly Sync Recap & Action Items', snippet: 'Thanks everyone for the productive meeting. Here are the key takeaways and action items...', isRead: false, timestamp: '10:45' },
  { id: 'e2', sender: 'HR Department', subject: 'Reminder: Annual Performance Reviews', snippet: 'This is a friendly reminder to complete your self-assessment for the annual performance review...', isRead: true, timestamp: '09:15' },
];
const calendarEvents = [
    { id: 'evt1', title: 'Project Phoenix Sync', date: '2024-07-29', startTime: '10:00', endTime: '11:00', category: 'Meeting', participants: ['1', '2', '3', '4'] },
    { id: 'evt2', title: 'Design Review', date: '2024-07-29', startTime: '14:00', endTime: '15:30', category: 'Meeting', participants: ['1', '3', '4'] },
];
const notes = [
    { id: 'n1', title: 'Meeting-Notizen: Project Phoenix', content: '<p>Wichtige Punkte aus dem Meeting: Das Backend-Team hat Probleme mit der Datenbank-Migration. Wir müssen das bis Freitag klären. <strong>Action Item:</strong> Tarec soll sich mit Bob abstimmen.</p>', date: '2024-07-22', tags: ['meeting', 'project-phoenix'] },
];

export default function BriefingPage() {

    return (
        <div className="flex flex-col gap-8">
             <PageHeader
                title="Tages-Briefing"
                description="Eine Vorschau deiner wichtigsten Informationen für den Tag."
            />
            <Tabs defaultValue="inbox" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="inbox"><Mail className="mr-2"/>Inbox</TabsTrigger>
                    <TabsTrigger value="calendar"><CalendarDays className="mr-2"/>Kalender</TabsTrigger>
                    <TabsTrigger value="notes"><Notebook className="mr-2"/>Notizen</TabsTrigger>
                    <TabsTrigger value="ablage"><FolderKanban className="mr-2"/>Ablage</TabsTrigger>
                </TabsList>
                <TabsContent value="inbox" className="mt-6">
                    <InboxTab summary={briefing?.emailSummary} emails={emails} />
                </TabsContent>
                <TabsContent value="calendar" className="mt-6">
                    <CalendarTab summary={briefing?.calendarSummary} events={calendarEvents} />
                </TabsContent>
                <TabsContent value="notes" className="mt-6">
                    <NotesTab summary={briefing?.notesSummary} notes={notes} />
                </TabsContent>
                <TabsContent value="ablage" className="mt-6">
                    <FilingCabinetTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
