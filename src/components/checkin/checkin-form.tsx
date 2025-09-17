"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";
import { OfficeMap } from "@/components/office-map";
import { teamMembers } from "@/lib/data";

const moodEmojis = ["😔", "😕", "😐", "🙂", "😄"];

export function CheckinForm() {
  const [mood, setMood] = useState([3]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const { toast } = useToast();
  
  // In a real app, this would come from an auth context
  const currentUserId = '1'; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat) {
        toast({
            variant: "destructive",
            title: "Sitzplatz auswählen",
            description: "Bitte wähle deinen heutigen Arbeitsplatz auf der Karte aus.",
        });
        return;
    }
    
    // This is where you would typically make an API call to update the backend.
    // For this demo, we'll mutate the local data directly.
    const userIndex = teamMembers.findIndex(u => u.id === currentUserId);
    if(userIndex !== -1) {
        teamMembers[userIndex].status = 'office';
        teamMembers[userIndex].seat = selectedSeat;
        teamMembers[userIndex].mood = mood[0];
    }
    
    toast({
      title: "Check-in erfolgreich",
      description: `Danke für dein Feedback! Dein Platz ${selectedSeat} wurde für heute registriert.`,
    });
    
    // Reset selection after submit
    setSelectedSeat(null);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Täglicher Check-in</CardTitle>
        <CardDescription>
          Wie fühlst du dich und wo sitzt du heute?
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
            <div>
                <label className="text-sm font-medium">Dein heutiger Arbeitsplatz</label>
                <p className="text-sm text-muted-foreground mb-4">Wähle deinen Tisch auf der Karte aus.</p>
                <OfficeMap selectedSeat={selectedSeat} onSeatSelect={setSelectedSeat} interactive={true} />
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
              />
            </div>
          </div>
        
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 border-t px-6 py-4 bg-muted/50">
          <Button type="submit">Check-in abschliessen</Button>
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
