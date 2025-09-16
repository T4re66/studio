'use client'

import { PageHeader } from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, CalendarDays, Notebook } from "lucide-react";
import { InboxTab } from "@/components/briefing/inbox-tab";
import { CalendarTab } from "@/components/briefing/calendar-tab";
import { NotesTab } from "@/components/briefing/notes-tab";

export default function BriefingPage() {
    return (
        <div className="flex flex-col gap-8">
             <PageHeader
                title="Tages-Briefing"
                description="Dein persönliches Cockpit für E-Mails, Termine und Notizen."
            />
            <Tabs defaultValue="inbox" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="inbox"><Mail className="mr-2"/>Inbox</TabsTrigger>
                    <TabsTrigger value="calendar"><CalendarDays className="mr-2"/>Kalender</TabsTrigger>
                    <TabsTrigger value="notes"><Notebook className="mr-2"/>Notizen</TabsTrigger>
                </TabsList>
                <TabsContent value="inbox" className="mt-6">
                    <InboxTab />
                </TabsContent>
                <TabsContent value="calendar" className="mt-6">
                    <CalendarTab />
                </TabsContent>
                <TabsContent value="notes" className="mt-6">
                    <NotesTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
