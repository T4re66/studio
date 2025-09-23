
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { OfficeMap } from "@/components/office-map";
<<<<<<< HEAD
import { useAuth } from "@/hooks/use-auth";
import type { TeamMember } from "@/lib/data";
import { getTeamMembers, updateUserCheckin } from "@/lib/team-api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
=======
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)

const moodEmojis = ["😔", "😕", "😐", "🙂", "😄"];

export function CheckinForm() {
<<<<<<< HEAD
  const { user, team } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [mood, setMood] = useState([3]);
  const [status, setStatus] = useState<TeamMember['status']>('office');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (team?.id) {
        getTeamMembers(team.id).then(setMembers);
    }
  }, [team]);

  const handleSubmit = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Fehler', description: 'Du musst angemeldet sein.' });
        return;
    }
     if (!team) {
        toast({ variant: 'destructive', title: 'Kein Team', description: 'Du musst Mitglied eines Teams sein, um einzuchecken. Gehe zu den Einstellungen, um einem Team beizutreten.' });
        return;
    }
    if (status === 'office' && !selectedSeat) {
        toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte wähle einen Sitzplatz aus.' });
        return;
    }

    setLoading(true);
    try {
        await updateUserCheckin(user.uid, team.id, {
            status: status,
            mood: mood[0],
            seat: status === 'office' ? selectedSeat : null,
        });
        toast({
            title: 'Check-in erfolgreich!',
            description: 'Dein Status wurde aktualisiert.',
        });
        router.push('/dashboard');
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Fehler', description: 'Dein Check-in konnte nicht gespeichert werden.' });
    } finally {
        setLoading(false);
    }
  }
=======
  const [mood, setMood] = useState([3]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Täglicher Check-in</CardTitle>
        <CardDescription>
          Wie fühlst du dich und wo arbeitest du heute?
        </CardDescription>
      </CardHeader>
<<<<<<< HEAD
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
=======
      <form>
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
        <CardContent className="space-y-8">
            
            <div className="space-y-4">
                <label className="text-sm font-medium">Wo arbeitest du heute?</label>
                <RadioGroup value={status} onValueChange={(v) => setStatus(v as TeamMember['status'])} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="office" id="office" />
                        <Label htmlFor="office">Im Büro</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="remote" id="remote" />
                        <Label htmlFor="remote">Remote</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="away" id="away" />
                        <Label htmlFor="away">Abwesend</Label>
                    </div>
                </RadioGroup>
            </div>

            {status === 'office' && (
                <div className="animate-in fade-in-0 duration-300">
                    <label className="text-sm font-medium">Dein heutiger Arbeitsplatz</label>
                    <p className="text-sm text-muted-foreground mb-4">Wähle einen freien Tisch auf der Karte aus.</p>
                    <OfficeMap members={members} selectedSeat={selectedSeat} onSeatSelect={setSelectedSeat} interactive={true} />
                </div>
            )}

          <div className="space-y-4">
            <label className="text-sm font-medium">Deine aktuelle Stimmung</label>
            <div className="flex items-center gap-4">
              <span className="text-3xl w-8">{moodEmojis[mood[0] - 1]}</span>
              <Slider
                value={mood}
                onValueChange={setMood}
                max={5}
                min={1}
                step={1}
                className="flex-1"
                disabled={!user || loading}
              />
            </div>
          </div>
        
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 border-t px-6 py-4 bg-muted/50">
<<<<<<< HEAD
          <Button type="submit" disabled={!user || loading}>Check-in abschliessen</Button>
=======
          <Button type="button">Check-in abschliessen</Button>
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
           <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p>
             Dein Status und Sitzplatz werden für die heutige Übersicht im Team geteilt. Deine Stimmung wird Team-Mitgliedern angezeigt, um die soziale Interaktion zu fördern.
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
