'use client'

import type { Match, User } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TournamentCardProps {
    match: Match;
    onScoreChange: (team: 'teamA' | 'teamB', score: number) => void;
    onDeclareWinner: () => void;
    disabled?: boolean;
    findUser: (userId: string) => User | undefined;
}

const TeamDisplay = ({ team, findUser, isWinner }: { team: Match['teamA'], findUser: (id: string) => User | undefined, isWinner?: boolean }) => (
    <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex -space-x-4">
            {team.members.map(member => {
                const user = findUser(member.id);
                return (
                    <Avatar key={member.id} className={cn("h-12 w-12 border-2", isWinner ? "border-amber-400" : "border-card")}>
                        {user && <AvatarImage src={user.avatar} />}
                        <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )
            })}
        </div>
        <p className="font-semibold text-sm">{team.name}</p>
    </div>
);

export function TournamentCard({ match, onScoreChange, onDeclareWinner, disabled, findUser }: TournamentCardProps) {
    const isFinished = !!match.winner;

    return (
        <Card className={cn(disabled && "bg-muted/50")}>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-center text-muted-foreground">{match.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-around gap-4">
                <TeamDisplay team={match.teamA} findUser={findUser} isWinner={isFinished && match.winner?.name === match.teamA.name} />
                
                <div className="flex items-center gap-2 font-mono text-2xl">
                     <Input
                        type="number"
                        className="w-16 h-12 text-center text-lg"
                        value={match.teamA.score}
                        onChange={(e) => onScoreChange('teamA', parseInt(e.target.value) || 0)}
                        disabled={disabled || isFinished}
                    />
                    <span>-</span>
                     <Input
                        type="number"
                        className="w-16 h-12 text-center text-lg"
                        value={match.teamB.score}
                        onChange={(e) => onScoreChange('teamB', parseInt(e.target.value) || 0)}
                        disabled={disabled || isFinished}
                    />
                </div>
                
                <TeamDisplay team={match.teamB} findUser={findUser} isWinner={isFinished && match.winner?.name === match.teamB.name} />
            </CardContent>
            <CardFooter>
                {isFinished ? (
                    <Button variant="outline" disabled className="w-full">
                        <Crown className="mr-2 h-4 w-4 text-amber-500"/>
                        Gewinner: {match.winner?.name}
                    </Button>
                ) : (
                    <Button onClick={onDeclareWinner} disabled={disabled} className="w-full">
                        Gewinner erklären
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
