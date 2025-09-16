'use client'

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { officeTasks as initialTasks } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import type { OfficeTask } from '@/lib/data';

const categoryColors = {
    'Soziales': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Büro': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'Spass': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<OfficeTask[]>(initialTasks);
  const { toast } = useToast();

  const handleCompleteTask = (taskId: string, taskPoints: number) => {
    setTasks(currentTasks => 
        currentTasks.map(task => 
            task.id === taskId ? { ...task, isCompleted: true } : task
        )
    );
    toast({
        title: "Aufgabe erledigt!",
        description: `Super! Du hast ${taskPoints} Punkte verdient.`
    });
    // In a real app, you would also update the user's total points.
  }

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
                <Button className="w-full" onClick={() => handleCompleteTask(task.id, task.points)}>
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
