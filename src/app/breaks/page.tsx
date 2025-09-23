
'use client'

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Coffee, Utensils } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/lib/data';

// Placeholder data for UI shell
const teamMembers: User[] = [
  { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15', seat: 'A4', online: true, mood: 5 },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', online: true, mood: 4 },
];
const lunchMatches = [{users: [teamMembers[0], teamMembers[1]], time: '12:30'}];
const coffeeMatches: any[] = [];
// --

export default function BreaksPage() {

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
        <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className='grid gap-2'>
                <Label htmlFor="lunch-time">Mittagspause</Label>
                <Input id="lunch-time" type="time" defaultValue="12:30" />
            </div>
             <div className='grid gap-2'>
                <Label htmlFor="coffee-time">Kaffeepause</Label>
                <Input id="coffee-time" type="time" defaultValue="15:00" />
            </div>
        </CardContent>
        <CardFooter>
            <Button>Pausen speichern</Button>
        </CardFooter>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Utensils />Mittagspausen-Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {lunchMatches.map((match, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center">
                        {match.users.map((user: any) => (
                             <Avatar key={user.id} className="-ml-4 first:ml-0 border-2 border-card">
                                <AvatarImage src={user.avatar}/>
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ))}
                        <p className="ml-4 font-semibold">{match.users.map((u:any) => u.name.split(' ')[0]).join(' & ')}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-sm">{match.time}</p>
                        <Button variant="ghost" size="sm" className="mt-1 h-8">Anschliessen</Button>
                    </div>
                </div>
             ))}
             {lunchMatches.length === 0 && <p className="text-muted-foreground text-center py-8">Keine Matches gefunden.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Coffee />Kaffeepausen-Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {coffeeMatches.map((match, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center">
                        {match.users.map((user: any) => (
                             <Avatar key={user.id} className="-ml-4 first:ml-0 border-2 border-card">
                                <AvatarImage src={user.avatar}/>
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ))}
                        <p className="ml-4 font-semibold">{match.users.map((u:any) => u.name.split(' ')[0]).join(' & ')}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-sm">{match.time}</p>
                        <Button variant="ghost" size="sm" className="mt-1 h-8">Anschliessen</Button>
                    </div>
                </div>
             ))}
             {coffeeMatches.length === 0 && <p className="text-muted-foreground text-center py-8">Keine Matches gefunden.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
