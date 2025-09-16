'use client'

import { useState, useEffect } from 'react';
import type { Deadline } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { differenceInDays, differenceInHours, differenceInMinutes, parseISO } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Timer } from 'lucide-react';

interface DeadlineManagerProps {
    deadlines: Deadline[];
}

function Countdown({ dueDate }: { dueDate: string }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const targetDate = parseISO(dueDate);
    const days = differenceInDays(targetDate, now);
    const hours = differenceInHours(targetDate, now) % 24;
    const minutes = differenceInMinutes(targetDate, now) % 60;

    if (days < 0) {
        return <span className="font-semibold text-destructive">Abgelaufen</span>;
    }
    
    return (
        <span className="font-mono font-semibold">
            {days > 0 && `${days}d `}
            {hours > 0 && `${hours}h `}
            {`${minutes}m`}
        </span>
    );
}


export function DeadlineManager({ deadlines }: DeadlineManagerProps) {
    const sortedDeadlines = [...deadlines].sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-3"><Timer />Deadline Manager</CardTitle>
                <CardDescription>Die nächsten wichtigen Abgabetermine im Überblick.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {sortedDeadlines.map(deadline => {
                    const totalDays = differenceInDays(parseISO(deadline.dueDate), new Date(new Date(deadline.dueDate).setDate(parseISO(deadline.dueDate).getDate() - 30))); // Assume a 30-day cycle for progress
                    const remainingDays = differenceInDays(parseISO(deadline.dueDate), new Date());
                    const progress = Math.max(0, 100 - (remainingDays / totalDays) * 100);

                    return (
                        <div key={deadline.id} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-semibold">{deadline.title}</p>
                                    <p className="text-xs text-muted-foreground">{deadline.projectName}</p>
                                </div>
                                <div className="text-right">
                                    <Countdown dueDate={deadline.dueDate} />
                                    <p className="text-xs text-muted-foreground">{format(parseISO(deadline.dueDate), 'dd.MM.yyyy')}</p>
                                </div>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )
                })}
                 {sortedDeadlines.length === 0 && <p className="text-muted-foreground text-center py-8">Keine Deadlines festgelegt.</p>}
            </CardContent>
        </Card>
    );
}

// Minimal date-fns format function to avoid pulling in the whole library
function format(date: Date, formatStr: string): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return formatStr
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', String(year));
}

    