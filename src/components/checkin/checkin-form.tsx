"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";
import { OfficeMap } from "@/components/office-map";

const moodEmojis = ["😔", "😕", "😐", "🙂", "😄"];

export function CheckinForm() {
  const [mood, setMood] = useState([3]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const { toast } = useToast();

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
    // In a real app, this would send anonymous data to a backend.
    console.log({ mood: mood[0], seat: selectedSeat });
    toast({
      title: "Check-in erfolgreich",
      description: `Danke für dein anonymes Feedback. Dein Platz ${selectedSeat} wurde registriert.`,
    });
    setSelectedSeat(null);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Täglicher Check-in</CardTitle>
        <CardDescription>
          Wie fühlst du dich und wo sitzt du heute? Deine Stimmungs-Angabe ist 100% anonym.
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
            <label className="text-sm font-medium">Deine aktuelle Stimmung (Anonym)</label>
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
              Deine Stimmung wird ohne persönliche Kennungen gespeichert. Dein Sitzplatz wird für die heutige Übersicht im Team geteilt.
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
