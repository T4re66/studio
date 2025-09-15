import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { emails, teamMembers } from "@/lib/data";
import { Archive, Mail, Reply, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InboxPage() {
  const findSender = (senderName: string) => {
    return teamMembers.find(m => m.name.includes(senderName.split(" ")[0])) || null;
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="KI-Posteingang"
        description="Eine priorisierte Ansicht deiner wichtigsten E-Mails."
      />
      
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {emails.map(email => {
              const sender = findSender(email.sender);
              return (
                <div key={email.id} className="p-4 flex gap-4 items-start group hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10 mt-1">
                    {sender && <AvatarImage src={sender.avatar} />}
                    <AvatarFallback>
                      {email.sender.includes(" ") ? `${email.sender.split(" ")[0][0]}${email.sender.split(" ")[1][0]}` : email.sender.substring(0, 2)}
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
                    <p className="text-sm text-muted-foreground mt-1">{email.snippet}</p>
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
        </CardContent>
      </Card>
    </div>
  );
}
