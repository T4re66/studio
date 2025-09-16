'use client'

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { notes } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Plus, Archive } from "lucide-react";
import { NoteEditor } from "@/components/notes/note-editor";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { de } from 'date-fns/locale';

export default function NotesPage() {
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    return (
        <div className="flex flex-col gap-8">
             <div className="flex justify-between items-start flex-wrap gap-4">
                <PageHeader
                    title="Notizen"
                    description="Erfasse und organisiere deine Gedanken und Ideen."
                />
                 <Button onClick={() => setIsEditorOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Neue Notiz
                </Button>
            </div>

            {isEditorOpen && (
                 <Card className="fade-in">
                    <CardHeader>
                        <CardTitle>Neue Notiz erstellen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <NoteEditor />
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button>Speichern</Button>
                        <Button variant="ghost" onClick={() => setIsEditorOpen(false)}>Abbrechen</Button>
                    </CardFooter>
                </Card>
            )}

            <Card>
                 <CardHeader>
                    <CardTitle>Ablage</CardTitle>
                    <CardDescription>Deine gespeicherten Notizen.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {notes.map(note => (
                         <div key={note.id} className="border p-4 rounded-lg group hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{note.title}</h3>
                                    <p className="text-xs text-muted-foreground">{format(parseISO(note.date), 'dd. MMMM yyyy', { locale: de })}</p>
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
                    ))}
                </CardContent>
            </Card>

        </div>
    )
}
