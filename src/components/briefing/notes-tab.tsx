'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { notes as initialNotes } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Plus, Archive, Sparkles } from "lucide-react";
import { NoteEditor } from "@/components/notes/note-editor";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { de } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/lib/data";

interface NotesTabProps {
    summary: string | undefined;
}

export function NotesTab({ summary }: NotesTabProps) {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const { toast } = useToast();

    const handleSaveNote = (newNote: Omit<Note, 'id' | 'date'>) => {
        if (!newNote.title || !newNote.content) {
            toast({
                variant: 'destructive',
                title: "Notiz unvollständig",
                description: "Bitte gib einen Titel und Inhalt für deine Notiz ein."
            });
            return;
        }

        const noteWithIdAndDate: Note = {
            ...newNote,
            id: `n${notes.length + 1}`,
            date: new Date().toISOString(),
        }
        setNotes(prev => [noteWithIdAndDate, ...prev]);
        setIsEditorOpen(false);
        toast({
            title: "Notiz gespeichert!",
            description: `"${newNote.title}" wurde zu deiner Ablage hinzugefügt.`
        })
    }
    
    const handleArchiveNote = (noteId: string) => {
        const noteToArchive = notes.find(n => n.id === noteId);
        setNotes(prev => prev.filter(n => n.id !== noteId));
        toast({
            title: "Notiz archiviert",
            description: `"${noteToArchive?.title}" wurde archiviert.`
        })
    }


    return (
        <div className="flex flex-col gap-8">
             <div className="flex justify-between items-start flex-wrap gap-4">
                <h2 className="text-xl font-semibold font-headline">Notizen-Ablage</h2>
                 <Button onClick={() => setIsEditorOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Neue Notiz
                </Button>
            </div>

            {isEditorOpen && (
                 <Card className="fade-in">
                    <NoteEditor onSave={handleSaveNote} onCancel={() => setIsEditorOpen(false)}/>
                </Card>
            )}

             <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-lg">
                        <Sparkles className="text-primary h-5 w-5"/>
                        Intelligente Zusammenfassung
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground/80">
                        {summary || "Zusammenfassung konnte nicht geladen werden."}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-4 p-6">
                    {notes.length === 0 && <p className="text-muted-foreground text-center py-12">Keine Notizen vorhanden. Erstelle eine neue!</p>}
                    {notes.sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()).map(note => (
                         <div key={note.id} className="border p-4 rounded-lg group hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{note.title}</h3>
                                    <p className="text-xs text-muted-foreground">{format(parseISO(note.date), 'dd. MMMM yyyy, HH:mm', { locale: de })}</p>
                                </div>
                                 <div className="flex items-center gap-2">
                                    {note.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                </div>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none mt-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: note.content }} />
                             <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="outline" size="sm" onClick={() => handleArchiveNote(note.id)}><Archive className="mr-2 h-4 w-4"/> Archivieren</Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    )
}
