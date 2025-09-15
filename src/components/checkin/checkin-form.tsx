"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";

const moodEmojis = ["😔", "😕", "😐", "🙂", "😄"];

export function CheckinForm() {
  const [mood, setMood] = useState([3]);
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send anonymous data to a backend.
    console.log({ mood: mood[0], feedback });
    toast({
      title: "Check-in erfolgreich",
      description: "Danke für dein anonymes Feedback. Es hilft uns, das Arbeitsumfeld zu verbessern.",
    });
    setMood([3]);
    setFeedback("");
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Anonymer Check-in</CardTitle>
        <CardDescription>
          Wie fühlst du dich heute bei der Arbeit? Dein Feedback ist zu 100% anonym.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
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
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Gestresst</span>
              <span>Ausgeglichen</span>
              <span>Energiegeladen</span>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium">
              Möchtest du mehr Kontext geben? (Optional)
            </label>
            <Textarea
              id="feedback"
              placeholder="Was beschäftigt dich? Dein Feedback bleibt anonym."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 border-t px-6 py-4 bg-muted/50">
          <Button type="submit">Feedback absenden</Button>
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p>
              Deine Eingabe wird ohne persönliche Kennungen gespeichert. Es werden keine IP-Adressen oder User-IDs erfasst.
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
