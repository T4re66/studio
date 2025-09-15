import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { teamMembers } from "@/lib/data";
import { Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
    const sortedMembers = [...teamMembers].sort((a, b) => b.points - a.points);

    const getRankColor = (rank: number) => {
        if (rank === 0) return "text-yellow-500";
        if (rank === 1) return "text-gray-400";
        if (rank === 2) return "text-yellow-700";
        return "text-muted-foreground";
    };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Leaderboard"
        description="Wer hat diese Woche die meisten Punkte gesammelt?"
      />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* 2nd place */}
            {sortedMembers[1] && (
                 <Card className="text-center relative order-2 md:order-1">
                    <CardContent className="p-6">
                        <Avatar className="h-24 w-24 mx-auto border-4 border-gray-400">
                            <AvatarImage src={sortedMembers[1].avatar}/>
                            <AvatarFallback>{sortedMembers[1].name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="mt-4 text-xl font-bold">{sortedMembers[1].name}</h3>
                        <p className="text-muted-foreground">2. Platz</p>
                        <p className="text-3xl font-bold mt-2 text-gray-400">{sortedMembers[1].points}</p>
                    </CardContent>
                </Card>
            )}
            {/* 1st place */}
            {sortedMembers[0] && (
                <Card className="text-center relative order-1 md:order-2 border-2 border-yellow-500 shadow-lg">
                    <CardContent className="p-6 pt-10">
                        <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 h-10 w-10 text-yellow-500" fill="currentColor" />
                         <Avatar className="h-32 w-32 mx-auto border-4 border-yellow-500">
                            <AvatarImage src={sortedMembers[0].avatar}/>
                            <AvatarFallback>{sortedMembers[0].name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="mt-4 text-2xl font-bold">{sortedMembers[0].name}</h3>
                        <p className="text-muted-foreground">1. Platz</p>
                        <p className="text-4xl font-bold mt-2 text-yellow-500">{sortedMembers[0].points}</p>
                    </CardContent>
                </Card>
            )}
             {/* 3rd place */}
            {sortedMembers[2] && (
                 <Card className="text-center relative order-3 md:order-3">
                    <CardContent className="p-6">
                        <Avatar className="h-24 w-24 mx-auto border-4 border-yellow-700">
                            <AvatarImage src={sortedMembers[2].avatar}/>
                            <AvatarFallback>{sortedMembers[2].name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="mt-4 text-xl font-bold">{sortedMembers[2].name}</h3>
                        <p className="text-muted-foreground">3. Platz</p>
                        <p className="text-3xl font-bold mt-2 text-yellow-700">{sortedMembers[2].points}</p>
                    </CardContent>
                </Card>
            )}
        </div>


      <Card>
        <CardContent className="p-0">
          <div className="space-y-2">
            {sortedMembers.slice(3).map((member, index) => (
              <div key={member.id} className="flex items-center p-4 border-b last:border-none">
                <p className="w-8 text-lg font-bold text-muted-foreground">{index + 4}.</p>
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 flex-1">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <p className="text-lg font-bold">{member.points} <span className="text-sm text-muted-foreground font-normal">Punkte</span></p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
