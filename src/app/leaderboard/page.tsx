
<<<<<<< HEAD
'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Loader2 } from "lucide-react";
import type { TeamMember } from "@/lib/data";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function LeaderboardPage() {
    const { teamMembers, loading } = useAuth();

    const leaderboard = useMemo(() => {
        return [...teamMembers].sort((a, b) => b.points - a.points);
    }, [teamMembers]);


    if (loading) {
        return (
             <div className="flex flex-col gap-8">
                <PageHeader
                    title="Leaderboard"
                    description="Wer hat diese Woche die meisten Punkte gesammelt?"
                />
                <div className="flex justify-center items-center py-12 gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Lade Leaderboard...</span>
                </div>
            </div>
        )
    }
=======
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import type { User } from "@/lib/data";

// Placeholder data for UI shell
const teamMembers: User[] = [
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', online: true, mood: 4 },
  { id: '7', name: 'George Clark', avatar: 'https://picsum.photos/seed/user7/200/200', status: 'office', role: 'DevOps Engineer', department: 'Engineering', lastSeen: 'now', dnd: true, points: 1300, birthday: '1989-08-25', seat: 'A3', online: true, mood: 3 },
  { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15', seat: 'A4', online: true, mood: 5 },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', lastSeen: '15m ago', dnd: false, points: 1100, birthday: '1992-09-05', seat: 'C1', online: true, mood: 2 },
];
// --

export default function LeaderboardPage() {
    const sortedMembers = teamMembers;
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Leaderboard"
        description="Wer hat diese Woche die meisten Punkte gesammelt?"
      />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* 2nd place */}
            {leaderboard[1] && (
                 <Card className="text-center relative order-2 md:order-1">
                    <CardContent className="p-6">
                        <Avatar className="h-24 w-24 mx-auto border-4 border-gray-400">
                            {leaderboard[1].avatar && <AvatarImage src={leaderboard[1].avatar}/>}
                            <AvatarFallback>{leaderboard[1].name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="mt-4 text-xl font-bold">{leaderboard[1].name}</h3>
                        <p className="text-muted-foreground">2. Platz</p>
                        <p className="text-3xl font-bold mt-2 text-gray-400">{leaderboard[1].points}</p>
                    </CardContent>
                </Card>
            )}
            {/* 1st place */}
            {leaderboard[0] && (
                <Card className="text-center relative order-1 md:order-2 border-2 border-yellow-500 shadow-lg">
                    <CardContent className="p-6 pt-10">
                        <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 h-10 w-10 text-yellow-500" fill="currentColor" />
                         <Avatar className="h-32 w-32 mx-auto border-4 border-yellow-500">
                            {leaderboard[0].avatar && <AvatarImage src={leaderboard[0].avatar}/>}
                            <AvatarFallback>{leaderboard[0].name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="mt-4 text-2xl font-bold">{leaderboard[0].name}</h3>
                        <p className="text-muted-foreground">1. Platz</p>
                        <p className="text-4xl font-bold mt-2 text-yellow-500">{leaderboard[0].points}</p>
                    </CardContent>
                </Card>
            )}
             {/* 3rd place */}
            {leaderboard[2] && (
                 <Card className="text-center relative order-3 md:order-3">
                    <CardContent className="p-6">
                        <Avatar className="h-24 w-24 mx-auto border-4 border-yellow-700">
                            {leaderboard[2].avatar && <AvatarImage src={leaderboard[2].avatar}/>}
                            <AvatarFallback>{leaderboard[2].name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="mt-4 text-xl font-bold">{leaderboard[2].name}</h3>
                        <p className="text-muted-foreground">3. Platz</p>
                        <p className="text-3xl font-bold mt-2 text-yellow-700">{leaderboard[2].points}</p>
                    </CardContent>
                </Card>
            )}
        </div>


      <Card>
        <CardContent className="p-0">
          <div className="space-y-2">
            {leaderboard.length > 3 ? leaderboard.slice(3).map((member, index) => (
              <div key={member.id} className="flex items-center p-4 border-b last:border-none">
                <p className="w-8 text-lg font-bold text-muted-foreground">{index + 4}.</p>
                 <Avatar className="h-10 w-10">
                    {member.avatar && <AvatarImage src={member.avatar} />}
                    <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 flex-1">
                    <p className="font-semibold">{member.name}</p>
                </div>
                <p className="text-lg font-bold">{member.points} <span className="text-sm text-muted-foreground font-normal">Punkte</span></p>
              </div>
            )) : leaderboard.length === 0 ? (
                <p className="text-muted-foreground text-center p-6">Keine Teammitglieder gefunden.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
