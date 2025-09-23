
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
<<<<<<< HEAD
import { Archive, Reply, Trash, Sparkles, Loader2 } from "lucide-react";
=======
import { Archive, Reply, Trash, Sparkles } from "lucide-react";
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
import { Button } from "@/components/ui/button";
import type { Email } from "@/lib/data";

interface InboxTabProps {
  summary: string | undefined;
  emails: Email[];
}

export function InboxTab({ summary, emails }: InboxTabProps) {
  
  const renderContent = () => {
<<<<<<< HEAD
    if (!emails || emails.length === 0) {
      return <p className="text-center text-muted-foreground py-12">Posteingang leer oder wird geladen...</p>;
=======
    if (emails.length === 0) {
      return <p className="text-center text-muted-foreground py-12">Posteingang leer!</p>;
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
    }
    return (
      <div className="divide-y">
        {emails.map(email => {
          return (
            <div key={email.id} className="p-4 flex gap-4 items-start group hover:bg-muted/50 transition-colors">
              <Avatar className="h-10 w-10 mt-1">
                <AvatarFallback>
                  {email.sender.split(' ').map(n => n[0]).join('') || email.sender.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{email.sender}</p>
                    <p className="font-medium">{email.subject}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{email.timestamp}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{email.snippet}</p>
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm"><Reply className="mr-2 h-4 w-4"/> Antworten</Button>
                    <Button variant="outline" size="sm"><Archive className="mr-2 h-4 w-4"/> Archivieren</Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive"><Trash className="mr-2 h-4 w-4"/> Löschen</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="text-primary"/>
            Zusammenfassung der ungelesenen Mails
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summary && summary.startsWith("Zusammenfassung wird") ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{summary}</span>
            </div>
          ) : (
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">
              {summary || "Keine ungelesenen E-Mails zum Zusammenfassen."}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
