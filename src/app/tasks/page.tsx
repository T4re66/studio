
'use client'

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OfficeTask } from '@/lib/data';

const categoryColors = {
    'Soziales': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Büro': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'Spass': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
};

// Placeholder data for UI shell
const tasks: OfficeTask[] = [
  { id: 't1', title: 'Kaffeemaschine entkalken', description: 'Die Kaffeemaschine braucht etwas Liebe. Entkalke sie für das Wohl des ganzen Teams.', points: 100, category: 'Büro' },
  { id: 't2', title: 'Bringe einem Kollegen einen Kaffee', description: 'Frage einen Kollegen, ob er einen Kaffee möchte und bringe ihn ihm an den Platz.', points: 20, category: 'Soziales' },
  { id: 't3', title: 'Organisiere eine 5-Minuten-Dehnpause', description: 'Versammle ein paar Kollegen für eine kurze Dehnpause am Nachmittag.', points: 50, category: 'Soziales' },
  { id: 't7', title: 'Schreibtisch-Challenge', description: 'Wer hat den ordentlichsten (oder kreativsten) Schreibtisch? Starte einen kleinen Wettbewerb.', points: 60, category: 'Spass', isCompleted: true },
];

export default function TasksPage() {

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Aufgaben & Challenges"
        description="Sammle Punkte, indem du lustige und nützliche Aufgaben im Büro erledigst."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <Card key={task.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-xl">{task.title}</CardTitle>
                <Badge className={cn("border-none", categoryColors[task.category])}>{task.category}</Badge>
              </div>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-2xl font-bold text-primary text-center p-4 bg-muted/50 rounded-lg">
                +{task.points} Punkte
              </div>
            </CardContent>
            <CardFooter>
              {task.isCompleted ? (
                <Button disabled className="w-full">
                  <Check className="mr-2" />
                  Erledigt
                </Button>
              ) : (
                <Button className="w-full">
                  <Plus className="mr-2" />
                  Als erledigt markieren
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
