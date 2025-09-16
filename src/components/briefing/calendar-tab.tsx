'use client'

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { calendarEvents as initialEvents, teamMembers } from "@/lib/data";
import { format, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AddEventDialog } from "@/components/calendar/add-event-dialog";
import { summarizeCalendar } from "@/ai/flows/summarize-calendar-flow";
import type { CalendarEvent } from "@/lib/data";

const categoryColors: { [key: string]: string } = {
    'Meeting': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Personal': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'Team Event': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
};

export function CalendarTab() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>(initialEvents);
  
  const selectedDayEvents = useMemo(() => {
    if (!date) return [];
    return allEvents.filter(event => isSameDay(new Date(event.date), date));
  }, [date, allEvents]);

  const [summary, setSummary] = useState("Zusammenfassung wird geladen...");
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoadingSummary(true);
      const eventsForSummary = selectedDayEvents.map(e => ({
        title: e.title,
        startTime: e.startTime,
        endTime: e.endTime,
        category: e.category,
      }));
      if (eventsForSummary.length > 0) {
        const result = await summarizeCalendar(eventsForSummary);
        setSummary(result.summary);
      } else {
        setSummary("Für den gewählten Tag stehen keine Termine im Kalender.");
      }
      setIsLoadingSummary(false);
    };

    fetchSummary();
  }, [selectedDayEvents]);


  const findUser = (id: string) => teamMembers.find(u => u.id === id);
  
  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id' | 'participants'>) => {
    const eventWithId: CalendarEvent = { 
        ...newEvent, 
        id: `evt${allEvents.length + 1}`,
        participants: ['1'] // Add current user
    };
    setAllEvents(prevEvents => [...prevEvents, eventWithId]);
  }

  return (
    <div className="flex flex-col gap-8">
       <div className="flex justify-between items-start flex-wrap gap-4">
            <h2 className="text-xl font-semibold font-headline">Kalenderübersicht</h2>
             <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Termin hinzufügen
            </Button>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2">
            <CardContent className="p-0 sm:p-2 flex justify-center">
            <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                    weekStartsOn={1}
                    locale={de}
                />
            </CardContent>
        </Card>
        
        <div className="lg:col-span-1 flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {date ? format(date, 'eeee, dd. MMMM', {locale: de}) : 'Wähle einen Tag'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedDayEvents.length > 0 ? (
                        selectedDayEvents.sort((a,b) => a.startTime.localeCompare(b.startTime)).map(event => (
                            <div key={event.id} className="flex gap-4">
                                <div className="font-mono text-sm text-muted-foreground flex flex-col items-center">
                                    <span>{event.startTime}</span>
                                    <div className="w-px h-full bg-border my-1"></div>
                                    <span>{event.endTime}</span>
                                </div>
                                <div className="flex-1 bg-muted/50 p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold">{event.title}</h4>
                                        <Badge variant="outline" className={categoryColors[event.category]}>{event.category}</Badge>
                                    </div>
                                    <div className="flex -space-x-2 mt-2">
                                        {event.participants.map(id => {
                                            const user = findUser(id);
                                            return user ? (
                                                <Avatar key={id} className="h-6 w-6 border-2 border-card">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-4">Keine Termine für diesen Tag.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-lg">
                        <Sparkles className="text-primary h-5 w-5"/>
                        Tages-Zusammenfassung
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground/80">
                        {isLoadingSummary ? "Zusammenfassung wird geladen..." : summary}
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
      <AddEventDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} selectedDate={date} onAddEvent={handleAddEvent}/>
    </div>
  );
}
