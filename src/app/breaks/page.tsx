'use client'

import { useState, useMemo } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { teamMembers, breaks as initialBreaks } from "@/lib/data";
import { Plus, Coffee, Lunch } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Break } from '@/lib/data';

export default function BreaksPage() {
  const [breaks, setBreaks] = useState<Break[]>(initialBreaks);
  const [myLunch, setMyLunch] = useState("12:30");
  const [myCoffee, setMyCoffee] = useState("15:00");
  const { toast } = useToast();

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
              // Avoid duplicates like [userA, userB] and [userB, userA]
              if (userA && userB && !lunchMatches.some(m => (m.users.includes(userA) && m.users.includes(userB)))) {
                lunchMatches.push({users: [userA, userB], time: breakA.startTime});
              }
          }
      })
  });

  coffeeBreaks.forEach(breakA => {
      coffeeBreaks.forEach(breakB => {
          if(breakA.userId !== breakB.userId && breakA.startTime === breakB.startTime) {
              const userA = findUser(breakA.userId);
              const userB = findUser(breakB.userId);
              // Avoid duplicates
              if (userA && userB && !coffeeMatches.some(m => (m.users.includes(userA) && m.users.includes(userB)))) {
                coffeeMatches.push({users: [userA, userB], time: breakA.startTime});
              }
          }
      })
  });
  
  const handleSaveBreaks = () => {
    // In a real app, you'd save this to a backend.
    // For now, we update the local state.
    const currentUser = "1"; // Assuming Tarec
    
    const updatedBreaks = breaks.filter(b => b.userId !== currentUser);
    
    if (myLunch) {
        updatedBreaks.push({id: `b-lunch-${currentUser}`, userId: currentUser, type: 'lunch', startTime: myLunch, endTime: '13:00'});
    }
    if (myCoffee) {
        updatedBreaks.push({id: `b-coffee-${currentUser}`, userId: currentUser, type: 'coffee', startTime: myCoffee, endTime: '15:15'});
    }
    
    setBreaks(updatedBreaks);

    toast({
        title: "Pausen gespeichert!",
        description: "Deine Pausenzeiten wurden aktualisiert.",
    })
  }

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
                <Input id="lunch-time" type="time" value={myLunch} onChange={e => setMyLunch(e.target.value)} />
            </div>
             <div className='grid gap-2'>
                <Label htmlFor="coffee-time">Kaffeepause</Label>
                <Input id="coffee-time" type="time" value={myCoffee} onChange={e => setMyCoffee(e.target.value)} />
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSaveBreaks}>Pausen speichern</Button>
        </CardFooter>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lunch />Mittagspausen-Matches</CardTitle>
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
