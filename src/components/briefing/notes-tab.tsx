
'use client'

<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Archive, Sparkles, Loader2 } from "lucide-react";
import { NoteEditor } from "@/components/notes/note-editor";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { de } from 'date-fns/locale';
import type { Note } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";

// Placeholder for fetching notes from Firestore
const getNotes = async (userId: string): Promise<Note[]> => {
    return [];
}

interface NotesTabProps {
    summary: string | undefined;
}

<<<<<<< HEAD
export function NotesTab({ summary }: NotesTabProps) {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    useEffect(() => {
        if (user?.uid) {
            setLoading(true);
            getNotes(user.uid).then(notes => {
                setNotes(notes);
                setLoading(false);
            });
        } else {
            setNotes([]);
            setLoading(false);
        }
    }, [user]);

    const handleSaveNote = () => {
        setIsEditorOpen(false);
        // In a real app, you would add the new note to Firestore and then refetch.
        if (user?.uid) {
            getNotes(user.uid).then(setNotes);
        }
=======
export function NotesTab({ summary, notes }: NotesTabProps) {
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const handleSaveNote = () => {
        // Logic removed for UI shell
        setIsEditorOpen(false);
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
    }

    return (
        <div className="flex flex-col gap-8">
             <div className="flex justify-between items-start flex-wrap gap-4">
                <h2 className="text-xl font-semibold font-headline">Notizen-Ablage</h2>
                 <Button onClick={() => setIsEditorOpen(true)} disabled={!user}>
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
                     {summary === undefined ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Zusammenfassung wird generiert...</span>
                        </div>
                    ) : (
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                            {summary || "Keine Notizen zum Zusammenfassen."}
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-4 p-6">
                    {loading ? (
                         <div className="flex justify-center items-center py-12 gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                         </div>
                    ) : notes.length === 0 ? (
                        <p className="text-muted-foreground text-center py-12">Keine Notizen vorhanden. Erstelle eine neue!</p>
                    ) : (
                        notes.sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()).map(note => (
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
                                    <Button variant="outline" size="sm"><Archive className="mr-2 h-4 w-4"/> Archivieren</Button>
                                </div>
                            </div>
<<<<<<< HEAD
                        ))
                    )}
=======
                            <div className="prose prose-sm dark:prose-invert max-w-none mt-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: note.content }} />
                             <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="outline" size="sm"><Archive className="mr-2 h-4 w-4"/> Archivieren</Button>
                            </div>
                        </div>
                    ))}
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
                </CardContent>
            </Card>

        </div>
    )
}
