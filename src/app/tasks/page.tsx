
'use client'

<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OfficeTask } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { getTasks, completeTask } from '@/lib/team-api';
import { useToast } from '@/hooks/use-toast';
import { AddTaskDialog } from '@/components/tasks/add-task-dialog';

const categoryColors = {
    'Soziales': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Büro': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'Spass': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
};

<<<<<<< HEAD

export default function TasksPage() {
    const { user, team, isPreview, loading, refetchTeam } = useAuth();
    const { toast } = useToast();
    const [tasks, setTasks] = useState<OfficeTask[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchTasks = async () => {
        if (!team) {
            setIsDataLoading(false);
            return;
        }
        setIsDataLoading(true);
        try {
            const fetchedTasks = await getTasks(team.id);
            setTasks(fetchedTasks);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Fehler',
                description: 'Aufgaben konnten nicht geladen werden.'
            });
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        if (!loading) {
            fetchTasks();
        }
    }, [user, team, isPreview, loading]);

    const handleCompleteTask = async (taskId: string, points: number) => {
        if (!user || !team) return;
        
        // Optimistic UI update
        const originalTasks = tasks;
        const updatedTasks = tasks.map(t => t.id === taskId ? {...t, isCompleted: true} : t);
        setTasks(updatedTasks);
        
        try {
            await completeTask(team.id, taskId, user.uid);
            toast({
                title: 'Aufgabe erledigt!',
                description: `Du hast ${points} Punkte erhalten!`
            });
            await refetchTeam(); // Refetch user points
        } catch (error) {
            // Revert UI on error
            setTasks(originalTasks);
            toast({
                variant: 'destructive',
                title: 'Fehler',
                description: 'Aufgabe konnte nicht als erledigt markiert werden.'
            });
        }
    }
    
    if (loading || isDataLoading) {
        return (
            <div className="flex flex-col gap-8">
                <PageHeader
                    title="Aufgaben & Challenges"
                    description="Sammle Punkte, indem du lustige und nützliche Aufgaben im Büro erledigst."
                />
                <div className="flex justify-center items-center py-12 gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Lade Aufgaben...</span>
                </div>
            </div>
        );
    }

    const openTasks = tasks.filter(task => !task.isCompleted);
=======
// Placeholder data for UI shell
const tasks: OfficeTask[] = [
  { id: 't1', title: 'Kaffeemaschine entkalken', description: 'Die Kaffeemaschine braucht etwas Liebe. Entkalke sie für das Wohl des ganzen Teams.', points: 100, category: 'Büro' },
  { id: 't2', title: 'Bringe einem Kollegen einen Kaffee', description: 'Frage einen Kollegen, ob er einen Kaffee möchte und bringe ihn ihm an den Platz.', points: 20, category: 'Soziales' },
  { id: 't3', title: 'Organisiere eine 5-Minuten-Dehnpause', description: 'Versammle ein paar Kollegen für eine kurze Dehnpause am Nachmittag.', points: 50, category: 'Soziales' },
  { id: 't7', title: 'Schreibtisch-Challenge', description: 'Wer hat den ordentlichsten (oder kreativsten) Schreibtisch? Starte einen kleinen Wettbewerb.', points: 60, category: 'Spass', isCompleted: true },
];

export default function TasksPage() {
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)

  return (
    <div className="flex flex-col gap-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
            <PageHeader
                title="Aufgaben & Challenges"
                description="Sammle Punkte, indem du lustige und nützliche Aufgaben im Büro erledigst."
            />
            <Button onClick={() => setIsDialogOpen(true)} disabled={!user}>
                <Plus />
                Aufgabe hinzufügen
            </Button>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openTasks.map(task => (
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
<<<<<<< HEAD
                <Button className="w-full" onClick={() => handleCompleteTask(task.id, task.points)} disabled={!user || isPreview}>
=======
                <Button className="w-full">
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
                  <Plus className="mr-2" />
                  Als erledigt markieren
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
        {openTasks.length === 0 && !loading && (
            <p className="text-muted-foreground col-span-full text-center py-12">
                Aktuell sind keine Aufgaben verfügbar. Erstelle eine neue!
            </p>
        )}
      </div>
      <AddTaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onTaskAdded={fetchTasks} />
    </div>
  );
}
