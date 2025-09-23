
'use client'

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Sword, Tablets, Trophy, Loader2 } from 'lucide-react';
import type { Tournament, TeamMember, Match } from '@/lib/data';
import { TournamentCard } from '@/components/tournaments/tournament-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getTournaments, getTeamMembers, updateTournamentMatch } from '@/lib/team-api';
import { useToast } from '@/hooks/use-toast';


export default function TournamentsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTournaments = async () => {
        setLoading(true);
        const [tourneyData, memberData] = await Promise.all([getTournaments(), getTeamMembers()]);
        setTournaments(tourneyData);
        setTeamMembers(memberData);
        setLoading(false);
    }

    useEffect(() => {
        if (user) {
            fetchTournaments();
        } else {
            setTournaments([]);
            setTeamMembers([]);
            setLoading(false);
        }
    }, [user]);

    const handleScoreChange = (tournamentId: string, roundIndex: number, matchIndex: number, team: 'teamA' | 'teamB', score: number) => {
        setTournaments(prev =>
            prev.map(t => {
                if (t.id === tournamentId) {
                    const newRounds = [...t.rounds];
                    newRounds[roundIndex].matches[matchIndex][team].score = score;
                    return { ...t, rounds: newRounds };
                }
                return t;
            })
        );
    };

    const handleDeclareWinner = async (tournamentId: string, roundIndex: number, matchIndex: number) => {
        const tournament = tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        const match = tournament.rounds[roundIndex].matches[matchIndex];
        const winner = match.teamA.score > match.teamB.score ? match.teamA : match.teamB;
        
        const updatedMatch: Match = { ...match, winner };

        try {
            await updateTournamentMatch(tournamentId, roundIndex, matchIndex, updatedMatch);
            toast({ title: "Gewinner deklariert!", description: `${winner.name} hat das Match gewonnen.` });
            await fetchTournaments(); // Refetch all data to ensure consistency
        } catch (error) {
            toast({ variant: 'destructive', title: "Fehler", description: "Der Gewinner konnte nicht gespeichert werden." });
        }
    };
    
    const findUser = (userId: string) => teamMembers.find(u => u.id === userId);

    const renderTournament = (tournament: Tournament | undefined) => {
        if (loading) {
            return (
                <div className="flex justify-center items-center py-12 gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Lade Turnierdaten...</span>
                </div>
            )
        }
        if (!tournament) {
            return <p className="text-muted-foreground text-center py-12">Kein Turnier für diese Disziplin gefunden.</p>;
        }

        const isFinalMatchFinished = !!tournament.rounds[tournament.rounds.length -1]?.matches[0]?.winner;

        return (
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
                                {tournament.winner.members.map(member => {
                                    const teamUser = teamMembers.find(u => u.id === member.id);
                                    return (
                                        <Avatar key={member.id} className="h-16 w-16 border-2 border-card">
                                            {teamUser?.avatar && <AvatarImage src={teamUser.avatar} />}
                                            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )
                                })}
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
                        <Button size="lg" disabled={!isFinalMatchFinished}>
                            <Trophy className='mr-2'/> Turnier beenden & Punkte vergeben
                        </Button>
                    </div>
                )}
            </div>
        );
    }

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
                    {renderTournament(tournaments.find(t => t.game === 'Darts'))}
                </TabsContent>
                <TabsContent value="ping-pong" className="mt-6">
                    {renderTournament(tournaments.find(t => t.game === 'Ping Pong'))}
                </TabsContent>
                <TabsContent value="table-football" className="mt-6">
                    {renderTournament(tournaments.find(t => t.game === 'Tischfussball'))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
