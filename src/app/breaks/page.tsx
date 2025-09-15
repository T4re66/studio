import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { teamMembers, breaks } from "@/lib/data";
import { Plus } from "lucide-react";

export default function BreaksPage() {
  // Simple matching logic: find people with the same break time
  const lunchMatches: any[] = [];
  const coffeeMatches: any[] = [];

  const lunchBreaks = breaks.filter(b => b.type === 'lunch');
  const coffeeBreaks = breaks.filter(b => b.type === 'coffee');

  const findUser = (id: string) => teamMembers.find(u => u.id === id);

  lunchBreaks.forEach(breakA => {
      lunchBreaks.forEach(breakB => {
          if(breakA.userId !== breakB.userId && breakA.startTime === breakB.startTime) {
              const userA = findUser(breakA.userId);
              const userB = findUser(breakB.userId);
              if (userA && userB && !lunchMatches.some(m => m.includes(userA) && m.includes(userB))) {
                lunchMatches.push([userA, userB]);
              }
          }
      })
  })


  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Pausen-Matcher"
        description="Plane deine Pausen und finde Kollegen, die zur gleichen Zeit eine machen."
      />

      <Card>
        <CardHeader>
            <CardTitle>Meine Pausenzeiten</CardTitle>
            <CardDescription>Trage hier ein, wann du Pausen machen möchtest.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Form to add/edit breaks would go here */}
            <p className="text-muted-foreground">Du hast noch keine Pausen für heute eingetragen.</p>
        </CardContent>
        <CardFooter>
            <Button><Plus className="mr-2"/> Pause eintragen</Button>
        </CardFooter>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Mittagspausen-Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {lunchMatches.map((match, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center">
                        {match.map((user: any) => (
                             <Avatar key={user.id} className="-ml-4 first:ml-0 border-2 border-card">
                                <AvatarImage src={user.avatar}/>
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ))}
                        <p className="ml-4 font-semibold">{match.map((u:any) => u.name.split(' ')[0]).join(' & ')}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-sm">12:30 - 13:00</p>
                        <Button variant="ghost" size="sm" className="mt-1">Anschliessen</Button>
                    </div>
                </div>
             ))}
             {lunchMatches.length === 0 && <p className="text-muted-foreground text-center py-8">Keine Matches gefunden.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kaffeepausen-Matches</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground text-center py-8">Keine Matches gefunden.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
