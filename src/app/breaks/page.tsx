
'use client'

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Coffee, Utensils, Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TeamMember } from '@/lib/data';
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { updateMyBreakTimes, getTeamMembers } from "@/lib/team-api";
import { useToast } from "@/hooks/use-toast";

type Match = {
    time: string;
    users: TeamMember[];
}

export default function BreaksPage() {
  const { user, team, teamMembers, teamMember, loading, refetchTeam } = useAuth();
  const { toast } = useToast();

  const [myLunchTime, setMyLunchTime] = useState("12:30");
  const [myCoffeeTime, setMyCoffeeTime] = useState("15:00");
  
  useEffect(() => {
    if (teamMember) {
      if (teamMember.lunchTime) setMyLunchTime(teamMember.lunchTime);
      if (teamMember.coffeeTime) setMyCoffeeTime(teamMember.coffeeTime);
    }
  }, [teamMember]);

  const { lunchMatches, coffeeMatches } = useMemo(() => {
    const groupBreaks = (breakType: 'lunchTime' | 'coffeeTime') => {
        const groups: { [time: string]: TeamMember[] } = {};
        teamMembers.forEach(member => {
            const time = member[breakType];
            if (time) {
                if (!groups[time]) groups[time] = [];
                groups[time].push(member);
            }
        });
        return Object.entries(groups)
            .filter(([, users]) => users.length > 1)
            .map(([time, users]) => ({ time, users }));
    };

    return {
        lunchMatches: groupBreaks('lunchTime'),
        coffeeMatches: groupBreaks('coffeeTime')
    };
  }, [teamMembers]);

  const handleSaveBreaks = async () => {
    if (!user) return;
    try {
        await updateMyBreakTimes(user.uid, myLunchTime, myCoffeeTime);
        toast({
            title: "Pausenzeiten gespeichert!",
            description: "Deine Pausenzeiten wurden erfolgreich aktualisiert.",
        });
        await refetchTeam(); // Refetch all data to update UI
    } catch (e) {
        toast({
            variant: 'destructive',
            title: "Fehler",
            description: "Deine Pausenzeiten konnten nicht gespeichert werden.",
        });
    }
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
            <CardDescription>Trage hier ein, wann du Pausen machen möchtest. Andere können dann sehen, ob sie mit dir eine Pause machen können.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className='grid gap-2'>
                <Label htmlFor="lunch-time">Mittagspause</Label>
                <Input id="lunch-time" type="time" value={myLunchTime} onChange={e => setMyLunchTime(e.target.value)} disabled={!user}/>
            </div>
             <div className='grid gap-2'>
                <Label htmlFor="coffee-time">Kaffeepause</Label>
                <Input id="coffee-time" type="time" value={myCoffeeTime} onChange={e => setMyCoffeeTime(e.target.value)} disabled={!user}/>
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSaveBreaks} disabled={!user || loading}>Pausen speichern</Button>
        </CardFooter>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Utensils />Mittagspausen-Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
                <div className="flex justify-center items-center py-12 gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            ) : lunchMatches.length > 0 ? (
                lunchMatches.map((match, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center">
                            {match.users.map((u: TeamMember) => (
                                 <Avatar key={u.id} className="-ml-4 first:ml-0 border-2 border-card">
                                    {u.avatar && <AvatarImage src={u.avatar}/>}
                                    <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            ))}
                            <p className="ml-4 font-semibold">{match.users.map((u:TeamMember) => u.name?.split(' ')[0]).join(' & ')}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-sm">{match.time}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground text-center py-8">Keine Matches gefunden.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Coffee />Kaffeepausen-Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {loading ? (
                <div className="flex justify-center items-center py-12 gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            ) : coffeeMatches.length > 0 ? (
                coffeeMatches.map((match, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center">
                            {match.users.map((u: TeamMember) => (
                                 <Avatar key={u.id} className="-ml-4 first:ml-0 border-2 border-card">
                                    {u.avatar && <AvatarImage src={u.avatar}/>}
                                    <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            ))}
                            <p className="ml-4 font-semibold">{match.users.map((u:TeamMember) => u.name?.split(' ')[0]).join(' & ')}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-sm">{match.time}</p>
                        </div>
                    </div>
                 ))
            ) : (
                <p className="text-muted-foreground text-center py-8">Keine Matches gefunden.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
