
'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Loader2 } from "lucide-react";
import type { TeamMember } from "@/lib/data";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getTeamMembers } from "@/lib/team-api";

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchLeaderboard = async () => {
                setLoading(true);
                const members = await getTeamMembers();
                const sortedMembers = members.sort((a, b) => b.points - a.points);
                setLeaderboard(sortedMembers);
                setLoading(false);
            };
            fetchLeaderboard();
        } else {
            setLeaderboard([]);
            setLoading(false);
        }
    }, [user]);

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
