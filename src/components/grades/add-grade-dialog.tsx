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
import { format } from "date-fns";
import type { Grade } from "@/lib/data";

interface AddGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGrade: (grade: Omit<Grade, 'id'>) => void;
}

export function AddGradeDialog({ open, onOpenChange, onAddGrade }: AddGradeDialogProps) {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [type, setType] = useState<Grade['type'] | undefined>(undefined);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState("");


  const handleAdd = () => {
    if (!subject || !grade || !type || !date) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte fülle alle Pflichtfelder aus.",
      });
      return;
    }

    const newGrade: Omit<Grade, 'id'> = {
        subject,
        grade: parseFloat(grade),
        type,
        date,
        notes,
    }

    onAddGrade(newGrade);

    toast({
      title: "Note hinzugefügt",
      description: `Die Note ${grade} in ${subject} wurde hinzugefügt.`,
    });

    onOpenChange(false);
    setSubject("");
    setGrade("");
    setType(undefined);
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Neue Note</DialogTitle>
          <DialogDescription>
            Füge eine neue Note zu deinem Notenblatt hinzu.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Fach</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="z.B. Mathematik"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade">Note</Label>
              <Input
                id="grade"
                type="number"
                step="0.1"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="z.B. 1.3"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Art der Note</Label>
              <Select onValueChange={(value) => setType(value as Grade['type'])} value={type}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Art auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Klausur">Klausur</SelectItem>
                  <SelectItem value="Mündlich">Mündlich</SelectItem>
                  <SelectItem value="Projekt">Projekt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notizen (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="z.B. Thema der Klausur"
            />
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
