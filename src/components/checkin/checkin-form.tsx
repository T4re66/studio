
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { OfficeMap } from "@/components/office-map";
import { useAuth } from "@/hooks/use-auth";
import type { TeamMember } from "@/lib/data";

const moodEmojis = ["😔", "😕", "😐", "🙂", "😄"];

// Placeholder for fetching team members to display on the map
const getOfficeMembers = async (): Promise<TeamMember[]> => {
    return [];
}

export function CheckinForm() {
  const { user } = useAuth();
  const [mood, setMood] = useState([3]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (user) {
        getOfficeMembers().then(setMembers);
    }
  }, [user]);

  const handleSubmit = () => {
    // In a real app, you would submit this data to Firestore
    console.log({
        userId: user?.uid,
        mood: mood[0],
        seat: selectedSeat
    });
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Täglicher Check-in</CardTitle>
        <CardDescription>
          Wie fühlst du dich und wo sitzt du heute?
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent className="space-y-8">
            <div>
                <label className="text-sm font-medium">Dein heutiger Arbeitsplatz</label>
                <p className="text-sm text-muted-foreground mb-4">Wähle einen freien Tisch auf der Karte aus.</p>
                <OfficeMap members={members} selectedSeat={selectedSeat} onSeatSelect={setSelectedSeat} interactive={true} />
            </div>

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
                disabled={!user}
              />
            </div>
          </div>
        
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 border-t px-6 py-4 bg-muted/50">
          <Button type="button" onClick={handleSubmit} disabled={!user}>Check-in abschliessen</Button>
           <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p>
             Dein Sitzplatz wird für die heutige Übersicht im Team geteilt. Deine Stimmung wird Team-Mitgliedern angezeigt, um die soziale Interaktion zu fördern.
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
