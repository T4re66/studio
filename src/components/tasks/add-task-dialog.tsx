
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { OfficeTask } from "@/lib/data";
import { addTask } from "@/lib/team-api";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskAdded: () => void;
}

export function AddTaskDialog({ open, onOpenChange, onTaskAdded }: AddTaskDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("50");
  const [category, setCategory] = useState<OfficeTask['category'] | undefined>(undefined);

  const handleAdd = async () => {
    if (!title || !description || !points || !category) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte fülle alle Felder aus.",
      });
      return;
    }

    try {
        const newTask: Omit<OfficeTask, 'id' | 'isCompleted'> = {
            title,
            description,
            points: parseInt(points),
            category,
        };
        await addTask(newTask);
        toast({
            title: "Aufgabe hinzugefügt",
            description: `Die Aufgabe "${title}" wurde erstellt.`,
        });
        onTaskAdded(); // Callback to refetch tasks
        onOpenChange(false);
        // Reset form
        setTitle("");
        setDescription("");
        setPoints("50");
        setCategory(undefined);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Fehler",
            description: "Aufgabe konnte nicht erstellt werden.",
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Neue Aufgabe erstellen</DialogTitle>
          <DialogDescription>
            Füge eine neue Aufgabe oder Challenge hinzu, für die man Punkte sammeln kann.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Titel</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Kaffeemaschine entkalken"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-description">Beschreibung</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Eine kurze Beschreibung der Aufgabe."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="task-points">Punkte</Label>
              <Input
                id="task-points"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="z.B. 100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-category">Kategorie</Label>
              <Select onValueChange={(v) => setCategory(v as OfficeTask['category'])} value={category}>
                <SelectTrigger id="task-category">
                  <SelectValue placeholder="Kategorie wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soziales">Soziales</SelectItem>
                  <SelectItem value="Büro">Büro</SelectItem>
                  <SelectItem value="Spass">Spass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleAdd}>Hinzufügen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
