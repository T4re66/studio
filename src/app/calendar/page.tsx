'use client'

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Kalender"
        description="Behalte den Überblick über Termine und Ereignisse."
      />
      <Card>
        <CardContent className="p-0 sm:p-2 flex justify-center">
           <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                weekStartsOn={1}
            />
        </CardContent>
      </Card>
    </div>
  );
}
