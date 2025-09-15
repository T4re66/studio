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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

export function AddEventDialog({ open, onOpenChange, selectedDate }: AddEventDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    if (selectedDate) {
      setDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, open]);

  const handleAdd = () => {
    if (!title || !date || !startTime) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte fülle alle Felder aus.",
      });
      return;
    }
    toast({
      title: "Termin hinzugefügt",
      description: `${title} wurde zum Kalender hinzugefügt.`,
    });
    onOpenChange(false);
    setTitle("");
    setDate("");
    setStartTime("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Neuer Termin</DialogTitle>
          <DialogDescription>
            Füge einen neuen Termin zu deinem Kalender hinzu.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="event-title">Titel</Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Team-Meeting"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="event-date">Datum</Label>
                <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="event-time">Startzeit</Label>
                <Input
                id="event-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                />
            </div>
          </div>
           <div className="grid gap-2">
             <Label htmlFor="event-category">Kategorie</Label>
             <Select>
                <SelectTrigger id="event-category">
                    <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="personal">Persönlich</SelectItem>
                    <SelectItem value="team-event">Team Event</SelectItem>
                </SelectContent>
            </Select>
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
