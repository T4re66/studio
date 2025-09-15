import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { teamMembers, fridgeItems, parkingStatus } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Briefcase, Utensils, ParkingSquare, Rocket } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

const statusClasses = {
  office: "bg-green-500",
  remote: "bg-blue-500",
  away: "bg-gray-400",
};

export default function Home() {
  const onlineMembers = teamMembers.filter(m => m.status === 'office');
  const expiringSoon = fridgeItems.filter(item => item.expiryDays <= 3 && item.expiryDays > 0).length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Übersicht"
        description={`Willkommen zurück! Hier ist dein Überblick für heute.`}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Wer ist im Büro?</CardTitle>
            <CardDescription>{onlineMembers.length} von {teamMembers.length} Kollegen sind heute vor Ort.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {onlineMembers.map((member) => (
                <Link href="/people" key={member.id} className="flex flex-col items-center gap-2 group">
                  <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-primary transition-colors">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 block h-4 w-4 rounded-full border-2 border-card",
                        statusClasses[member.status]
                      )}
                    />
                  </Avatar>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{member.name.split(' ')[0]}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Heutige Events</CardTitle>
            <CardDescription>Deine anstehenden Termine.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Weekly Sync</p>
                <p className="text-sm text-muted-foreground">11:00 - 11:45</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 text-accent p-2 rounded-lg">
                <Rocket className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Project Phoenix Kick-off</p>
                <p className="text-sm text-muted-foreground">14:00 - 15:30</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Link href="/fridge">
          <Card className="hover:border-primary/50 hover:bg-primary/5 transition-all">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              <div className="bg-amber-100 text-amber-600 p-3 rounded-lg">
                <Utensils className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="font-headline text-lg">Kühlschrank</CardTitle>
                <CardDescription>
                  {expiringSoon > 0
                    ? `${expiringSoon} Artikel laufen bald ab`
                    : "Alles frisch!"}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
        
        <Card className="cursor-not-allowed opacity-60">
           <CardHeader className="flex-row items-center gap-4 space-y-0">
              <div className="bg-sky-100 text-sky-600 p-3 rounded-lg">
                <ParkingSquare className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="font-headline text-lg">Parkplätze</CardTitle>
                <CardDescription>{parkingStatus.freeSpots} freie Plätze gemeldet</CardDescription>
              </div>
            </CardHeader>
        </Card>

      </div>
    </div>
  );
}
