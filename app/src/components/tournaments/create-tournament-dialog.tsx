
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Tournament, TeamMember, Match } from "@/lib/data";
import { createTournament } from "@/lib/team-api";
import { X, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

interface CreateTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTournamentCreated: () => void;
  teamMembers: TeamMember[];
}

const PlayerSelector = ({
  label,
  members,
  selectedPlayers,
  onSelectionChange,
}: {
  label: string;
  members: TeamMember[];
  selectedPlayers: TeamMember[];
  onSelectionChange: (players: TeamMember[]) => void;
}) => {
  const selectedPlayerIds = useMemo(() => new Set(selectedPlayers.map(p => p.id)), [selectedPlayers]);

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 items-center min-h-[40px] p-2 border rounded-md">
        {selectedPlayers.map(player => (
          <div key={player.id} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
            <span>{player.name}</span>
            <button onClick={() => onSelectionChange(selectedPlayers.filter(p => p.id !== player.id))}>
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {members.map(member => (
              <DropdownMenuCheckboxItem
                key={member.id}
                checked={selectedPlayerIds.has(member.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectionChange([...selectedPlayers, member]);
                  } else {
                    onSelectionChange(selectedPlayers.filter(p => p.id !== member.id));
                  }
                }}
              >
                {member.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export function CreateTournamentDialog({
  open,
  onOpenChange,
  onTournamentCreated,
  teamMembers,
}: CreateTournamentDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [game, setGame] = useState<Tournament["game"] | undefined>(undefined);
  const [points, setPoints] = useState("500");
  const [matches, setMatches] = useState<{ teamA: TeamMember[], teamB: TeamMember[] }[]>([
    { teamA: [], teamB: [] },
  ]);

  const handleAddMatch = () => {
    setMatches([...matches, { teamA: [], teamB: [] }]);
  };

  const handleRemoveMatch = (index: number) => {
    setMatches(matches.filter((_, i) => i !== index));
  };

  const handlePlayerSelectionChange = (matchIndex: number, team: 'teamA' | 'teamB', players: TeamMember[]) => {
    const newMatches = [...matches];
    newMatches[matchIndex][team] = players;
    setMatches(newMatches);
  };


  const handleCreate = async () => {
    if (!name || !game || !points || matches.some(m => m.teamA.length === 0 || m.teamB.length === 0)) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte fülle alle Felder aus und wähle Spieler für jedes Match.",
      });
      return;
    }

    const firstRoundMatches: Match[] = matches.map((match, index) => {
        const teamAName = match.teamA.map(p => p.name?.split(' ')[0]).join(' & ');
        const teamBName = match.teamB.map(p => p.name?.split(' ')[0]).join(' & ');
        return {
            name: `Match ${index + 1}`,
            teamA: { name: teamAName, members: match.teamA, score: 0 },
            teamB: { name: teamBName, members: match.teamB, score: 0 },
        }
    });

    const newTournament: Omit<Tournament, 'id'> = {
      name,
      game,
      points: parseInt(points),
      completed: false,
      rounds: [{ name: "Vorrunde", matches: firstRoundMatches }],
    };

    try {
      await createTournament(newTournament);
      toast({
        title: "Turnier erstellt!",
        description: `Das Turnier "${name}" wurde erfolgreich gestartet.`,
      });
      onTournamentCreated();
      onOpenChange(false);
      // Reset form
      setName("");
      setGame(undefined);
      setPoints("500");
      setMatches([{ teamA: [], teamB: [] }]);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Fehler",
            description: "Das Turnier konnte nicht erstellt werden.",
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Neues Turnier erstellen</DialogTitle>
          <DialogDescription>
            Richte ein neues Turnier ein und lege die ersten Matches fest.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid gap-2">
            <Label htmlFor="tour-name">Turniername</Label>
            <Input id="tour-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Q3 Dart-Meisterschaft" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tour-game">Spiel</Label>
              <Select onValueChange={(v) => setGame(v as Tournament["game"])} value={game}>
                <SelectTrigger id="tour-game">
                  <SelectValue placeholder="Spiel auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Darts">Dart</SelectItem>
                  <SelectItem value="Ping Pong">Ping Pong</SelectItem>
                  <SelectItem value="Tischfussball">Tischfussball</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tour-points">Punkte für Sieger</Label>
              <Input id="tour-points" type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Matches der 1. Runde</h4>
            <div className="space-y-4">
                 {matches.map((match, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-3 relative">
                         <h5 className="text-xs font-semibold text-muted-foreground">Match {index + 1}</h5>
                        <PlayerSelector 
                            label="Team/Spieler A"
                            members={teamMembers}
                            selectedPlayers={match.teamA}
                            onSelectionChange={(players) => handlePlayerSelectionChange(index, 'teamA', players)}
                        />
                         <PlayerSelector 
                            label="Team/Spieler B"
                            members={teamMembers}
                            selectedPlayers={match.teamB}
                            onSelectionChange={(players) => handlePlayerSelectionChange(index, 'teamB', players)}
                        />
                        {matches.length > 1 && (
                            <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => handleRemoveMatch(index)}>
                                <X className="h-4 w-4"/>
                            </Button>
                        )}
                    </div>
                ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3" onClick={handleAddMatch}>
                <Plus className="mr-2 h-4 w-4" /> Match hinzufügen
            </Button>
          </div>

        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleCreate}>Turnier erstellen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
