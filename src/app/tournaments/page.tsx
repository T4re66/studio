
'use client'

<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Sword, Tablets, Trophy, Loader2 } from 'lucide-react';
import type { Tournament, TeamMember, Match } from '@/lib/data';
=======
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Sword, Tablets, Trophy } from 'lucide-react';
import type { Tournament, User } from '@/lib/data';
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
import { TournamentCard } from '@/components/tournaments/tournament-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getTournaments, updateTournamentMatch } from '@/lib/team-api';
import { useToast } from '@/hooks/use-toast';


// Placeholder data for UI shell
const teamMembers: User[] = [
  { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15', seat: 'A4', online: true, mood: 5 },
  { id: '2', name: 'Bob Williams', avatar: 'https://picsum.photos/seed/user2/200/200', status: 'remote', role: 'Backend Developer', department: 'Engineering', lastSeen: '2h ago', dnd: true, points: 800, birthday: '1988-11-22', online: true, mood: 3 },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', online: true, mood: 4 },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', lastSeen: '15m ago', dnd: false, points: 1100, birthday: '1992-09-05', seat: 'C1', online: true, mood: 2 },
  { id: '5', name: 'Ethan Davis', avatar: 'https://picsum.photos/seed/user5/200/200', status: 'away', role: 'QA Engineer', department: 'Engineering', lastSeen: 'yesterday', dnd: false, points: 600, birthday: '1993-12-10', online: false, mood: 5 },
  { id: '6', name: 'Fiona Garcia', avatar: 'https://picsum.photos/seed/user6/200/200', status: 'remote', role: 'Marketing Specialist', department: 'Marketing', lastSeen: '30m ago', dnd: false, points: 950, birthday: '1991-06-18', online: true, mood: 4 },
  { id: '7', name: 'George Clark', avatar: 'https://picsum.photos/seed/user7/200/200', status: 'office', role: 'DevOps Engineer', department: 'Engineering', lastSeen: 'now', dnd: true, points: 1300, birthday: '1989-08-25', seat: 'A3', online: true, mood: 3 },
  { id: '8', name: 'Hannah Lewis', avatar: 'https://picsum.photos/seed/user8/200/200', status: 'office', role: 'Data Scientist', department: 'Data', lastSeen: '1h ago', dnd: false, points: 1400, birthday: '1994-01-20', seat: 'B4', online: false, mood: 1 },
];
const [tarec, bob, charlie, diana, ethan, fiona, george, hannah] = teamMembers;

const tournaments: Tournament[] = [
    {
        id: 'tour-darts-1',
        name: 'Dart-Meisterschaft Q3',
        game: 'Darts',
        points: 500,
        completed: false,
        rounds: [
            {
                name: 'Halbfinale',
                matches: [
                    { name: 'Match 1', teamA: { name: 'Tarec', members: [tarec], score: 0 }, teamB: { name: 'Diana', members: [diana], score: 0 } },
                    { name: 'Match 2', teamA: { name: 'Charlie', members: [charlie], score: 0 }, teamB: { name: 'George', members: [george], score: 0 } },
                ]
            },
            {
                name: 'Finale',
                matches: [
                    { name: 'Final-Match', teamA: { name: 'TBD', members: [], score: 0 }, teamB: { name: 'TBD', members: [], score: 0 } },
                ]
            }
        ]
    },
    {
        id: 'tour-pingpong-1',
        name: 'Ping Pong Turnier',
        game: 'Ping Pong',
        points: 400,
        completed: true,
        winner: { name: 'Fiona', members: [fiona], score: 21 },
        rounds: [
            {
                name: 'Finale',
                matches: [
                    { name: 'Final-Match', teamA: { name: 'Fiona', members: [fiona], score: 21 }, teamB: { name: 'Bob', members: [bob], score: 18 }, winner: { name: 'Fiona', members: [fiona], score: 21 } },
                ]
            }
        ]
    },
    {
        id: 'tour-tf-1',
        name: 'Tischfussball Cup',
        game: 'Tischfussball',
        points: 750,
        completed: false,
        rounds: [
            {
                name: 'Halbfinale',
                matches: [
                    { name: 'Match 1', teamA: { name: 'Devs', members: [tarec, bob], score: 0 }, teamB: { name: 'Design & PM', members: [charlie, diana], score: 0 } },
                    { name: 'Match 2', teamA: { name: 'QA & Marketing', members: [ethan, fiona], score: 0 }, teamB: { name: 'Data & DevOps', members: [hannah, george], score: 0 } },
                ]
            },
             {
                name: 'Finale',
                matches: [
                    { name: 'Final-Match', teamA: { name: 'TBD', members: [], score: 0 }, teamB: { name: 'TBD', members: [], score: 0 } },
                ]
            }
        ]
    }
];

export default function TournamentsPage() {
<<<<<<< HEAD
    const { user, team, teamMembers, loading, refetchTeam } = useAuth();
    const { toast } = useToast();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const fetchTournaments = async () => {
        if (!team) {
            setIsDataLoading(false);
            return;
        }
        setIsDataLoading(true);
        const tourneyData = await getTournaments(team.id);
        setTournaments(tourneyData);
        setIsDataLoading(false);
    }

    useEffect(() => {
        if (!loading) {
            fetchTournaments();
        }
    }, [loading, team]);

    const handleScoreChange = (tournamentId: string, roundIndex: number, matchIndex: number, teamSide: 'teamA' | 'teamB', score: number) => {
        setTournaments(prev =>
            prev.map(t => {
                if (t.id === tournamentId) {
                    const newRounds = [...t.rounds];
                    newRounds[roundIndex].matches[matchIndex][teamSide].score = score;
                    return { ...t, rounds: newRounds };
                }
                return t;
            })
        );
    };

    const handleDeclareWinner = async (tournamentId: string, roundIndex: number, matchIndex: number) => {
        const tournament = tournaments.find(t => t.id === tournamentId);
        if (!tournament || !team) return;

        const match = tournament.rounds[roundIndex].matches[matchIndex];
        const winner = match.teamA.score > match.teamB.score ? match.teamA : match.teamB;
        
        const updatedMatch: Match = { ...match, winner };

        try {
            await updateTournamentMatch(team.id, tournamentId, roundIndex, matchIndex, updatedMatch);
            toast({ title: "Gewinner deklariert!", description: `${winner.name} hat das Match gewonnen.` });
            await fetchTournaments(); // Refetch all data to ensure consistency
        } catch (error) {
            toast({ variant: 'destructive', title: "Fehler", description: "Der Gewinner konnte nicht gespeichert werden." });
        }
    };
=======
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
    
    const findUser = (userId: string) => teamMembers.find(u => u.id === userId);

    const renderTournament = (tournament: Tournament | undefined) => {
<<<<<<< HEAD
        if (loading || isDataLoading) {
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

=======
        if (!tournament) {
            return <p className="text-muted-foreground text-center py-12">Kein Turnier für diese Disziplin gefunden.</p>;
        }
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
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
<<<<<<< HEAD
                                {tournament.winner.members.map(member => {
                                    const teamUser = teamMembers.find(u => u.id === member.id);
                                    return (
                                        <Avatar key={member.id} className="h-16 w-16 border-2 border-card">
                                            {teamUser?.avatar && <AvatarImage src={teamUser.avatar} />}
                                            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )
                                })}
=======
                                {tournament.winner.members.map(user => (
                                    <Avatar key={user.id} className="h-16 w-16 border-2 border-card">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ))}
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
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
<<<<<<< HEAD
                                    onScoreChange={(teamSide, score) => handleScoreChange(tournament.id, roundIndex, matchIndex, teamSide, score)}
                                    onDeclareWinner={() => handleDeclareWinner(tournament.id, roundIndex, matchIndex)}
=======
                                    onScoreChange={() => {}}
                                    onDeclareWinner={() => {}}
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
                                    disabled={tournament.completed}
                                    findUser={findUser}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                {!tournament.completed && (
                    <div className="flex justify-end pt-4">
<<<<<<< HEAD
                        <Button size="lg" disabled={!isFinalMatchFinished}>
                            <Trophy className='mr-2'/> Turnier beenden & Punkte vergeben
=======
                        <Button size="lg" disabled={!tournament.rounds[tournament.rounds.length -1].matches[0].winner}>
                        <Trophy className='mr-2'/> Turnier beenden & Punkte vergeben
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
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
