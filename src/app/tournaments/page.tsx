'use client'

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Sword, Tablets, Trophy } from 'lucide-react';
import { tournaments as initialTournaments, teamMembers as initialTeamMembers } from '@/lib/data';
import type { Tournament, Match, Team, User } from '@/lib/data';
import { TournamentCard } from '@/components/tournaments/tournament-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function TournamentsPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
    const [teamMembers, setTeamMembers] = useState<User[]>(initialTeamMembers);
    const { toast } = useToast();

    const handleScoreChange = (tournamentId: string, roundIndex: number, matchIndex: number, team: 'teamA' | 'teamB', score: number) => {
        const newTournaments = tournaments.map(t => {
            if (t.id === tournamentId) {
                const newRounds = [...t.rounds];
                newRounds[roundIndex].matches[matchIndex][team].score = score;
                return { ...t, rounds: newRounds };
            }
            return t;
        });
        setTournaments(newTournaments);
    };

    const handleDeclareWinner = (tournamentId: string, roundIndex: number, matchIndex: number) => {
        const tournament = tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        const match = tournament.rounds[roundIndex].matches[matchIndex];
        if (match.teamA.score === match.teamB.score) {
            toast({ variant: 'destructive', title: 'Unentschieden!', description: 'Das Ergebnis darf nicht unentschieden sein.' });
            return;
        }

        const winnerTeam = match.teamA.score > match.teamB.score ? match.teamA : match.teamB;
        const newTournaments = tournaments.map(t => {
            if (t.id === tournamentId) {
                const newRounds = [...t.rounds];
                newRounds[roundIndex].matches[matchIndex].winner = winnerTeam;
                return { ...t, rounds: newRounds };
            }
            return t;
        });
        setTournaments(newTournaments);

        toast({ title: 'Gewinner erklärt!', description: `${winnerTeam.name} hat das Match gewonnen.` });
    };

    const handleFinishTournament = (tournamentId: string) => {
        const tournament = tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        const finalMatch = tournament.rounds[tournament.rounds.length - 1].matches[0];
        if (!finalMatch.winner) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Das Finale wurde noch nicht entschieden.' });
            return;
        }

        const winnerTeam = finalMatch.winner;
        const points = tournament.points;

        const newTeamMembers = teamMembers.map(member => {
            if (winnerTeam.members.some(m => m.id === member.id)) {
                return { ...member, points: member.points + points };
            }
            return member;
        });
        setTeamMembers(newTeamMembers);

        const newTournaments = tournaments.map(t =>
            t.id === tournamentId ? { ...t, completed: true, winner: winnerTeam } : t
        );
        setTournaments(newTournaments);

        toast({
            title: `Turnier beendet: ${tournament.name}`,
            description: `${winnerTeam.name} gewinnt ${points} Punkte!`,
        });
    };
    
    const findUser = (userId: string) => teamMembers.find(u => u.id === userId);

    const renderTournament = (tournament: Tournament) => (
        <div key={tournament.id} className="space-y-8">
            {tournament.completed && tournament.winner && (
                <Card className="bg-accent/10 border-accent/30 text-center">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-3 font-headline">
                            <Trophy className="text-accent" />
                            Turnier-Gewinner: {tournament.winner.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center -space-x-4">
                            {tournament.winner.members.map(user => (
                                <Avatar key={user.id} className="h-16 w-16 border-2 border-card">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <p className="mt-4 text-muted-foreground">Herzlichen Glückwunsch zum Sieg und den +{tournament.points} Punkten!</p>
                        <Button variant="link" asChild><Link href="/leaderboard">Zum Leaderboard</Link></Button>
                    </CardContent>
                </Card>
            )}

            {tournament.rounds.map((round, roundIndex) => (
                <div key={roundIndex}>
                    <h3 className="text-xl font-bold font-headline mb-4">{round.name}</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        {round.matches.map((match, matchIndex) => (
                            <TournamentCard
                                key={matchIndex}
                                match={match}
                                onScoreChange={(team, score) => handleScoreChange(tournament.id, roundIndex, matchIndex, team, score)}
                                onDeclareWinner={() => handleDeclareWinner(tournament.id, roundIndex, matchIndex)}
                                disabled={tournament.completed}
                                findUser={findUser}
                            />
                        ))}
                    </div>
                </div>
            ))}
            {!tournament.completed && (
                 <div className="flex justify-end pt-4">
                    <Button onClick={() => handleFinishTournament(tournament.id)} size="lg" disabled={!tournament.rounds[tournament.rounds.length -1].matches[0].winner}>
                       <Trophy className='mr-2'/> Turnier beenden & Punkte vergeben
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Turniere"
                description="Messe dich mit deinen Kollegen in verschiedenen Disziplinen."
            />

            <Tabs defaultValue="darts" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="darts"><Target /> Dart</TabsTrigger>
                    <TabsTrigger value="ping-pong"><Tablets/> Ping Pong</TabsTrigger>
                    <TabsTrigger value="table-football"><Sword/> Tischfussball</TabsTrigger>
                </TabsList>

                <TabsContent value="darts" className="mt-6">
                    {renderTournament(tournaments.find(t => t.game === 'Darts')!)}
                </TabsContent>
                <TabsContent value="ping-pong" className="mt-6">
                    {renderTournament(tournaments.find(t => t.game === 'Ping Pong')!)}
                </TabsContent>
                <TabsContent value="table-football" className="mt-6">
                    {renderTournament(tournaments.find(t => t.game === 'Tischfussball')!)}
                </TabsContent>
            </Tabs>
        </div>
    );
}
